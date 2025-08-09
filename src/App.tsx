import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Character, Rock, DazaiWork } from './types'
import { 
  PHYSICS_CONFIG, 
  checkCollision, 
  calculateReflection, 
  updateTrail, 
  getWaterfallBounds 
} from './utils/physics'
import { 
  drawBackground, 
  drawRocks, 
  drawCharacterTrails, 
  drawCharacters, 
  setupCanvasContext 
} from './utils/rendering'

// APIが失敗した場合のフォールバックテキスト
const FALLBACK_TEXTS = [
  '人間失格の序章。私は、その男の写真を三葉、見たことがある。',
  '津軽の風景は、私の心に深い印象を残した。',
  '斜陽の家族は、時代の波に飲み込まれていく。'
]

function App() {
  // Canvasへの参照
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // 永続化された岩の状態
  const [rocks, setRocks] = useKV('waterfall-rocks', [] as Rock[])
  
  // 流れる文字の状態（非永続化）
  const [characters, setCharacters] = useState<Character[]>([])
  
  // 太宰治の作品テキスト
  const [dazaiTexts, setDazaiTexts] = useState<string[]>(FALLBACK_TEXTS)
  const [isLoadingTexts, setIsLoadingTexts] = useState(true)
  
  // アニメーションと文字生成の管理
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const characterSpawnRef = useRef<number>(0)
  
  // テキスト管理の参照
  const textIndexRef = useRef<number>(0)
  const currentTextRef = useRef<string>(FALLBACK_TEXTS[0])

  // 滝の幅を計算するメモ化された値
  const waterfallBounds = useMemo(() => getWaterfallBounds, [])

  // 太宰治の作品をAPIから取得
  useEffect(() => {
    const fetchDazaiTexts = async () => {
      try {
        setIsLoadingTexts(true)
        const response = await fetch('https://api.bungomail.com/works?author=太宰治')
        if (response.ok) {
          const works: DazaiWork[] = await response.json()
          const texts = works.map(work => work.content).filter(content => content && content.length > 0)
          if (texts.length > 0) {
            setDazaiTexts(texts)
            currentTextRef.current = texts[0]
          } else {
            // APIは動作するがコンテンツがない場合、フォールバックではなく再試行
            console.warn('APIからコンテンツを取得できません。再試行中...')
            setTimeout(fetchDazaiTexts, 2000)
            return
          }
        } else {
          console.warn('APIリクエストが失敗しました。再試行中...')
          setTimeout(fetchDazaiTexts, 2000)
          return
        }
      } catch (error) {
        console.error('太宰治のテキスト取得に失敗しました。再試行中...', error)
        setTimeout(fetchDazaiTexts, 2000)
        return
      } finally {
        setIsLoadingTexts(false)
      }
    }

    fetchDazaiTexts()
  }, [])

  // ランダムな文字を取得（太宰治の作品から順次選択）
  const getRandomChar = useCallback(() => {
    if (textIndexRef.current >= currentTextRef.current.length) {
      // 現在のテキストが終了したら次のテキストを選択
      const nextText = dazaiTexts[Math.floor(Math.random() * dazaiTexts.length)]
      currentTextRef.current = nextText
      textIndexRef.current = 0
    }
    const char = currentTextRef.current[textIndexRef.current]
    textIndexRef.current++
    return char
  }, [dazaiTexts])

  // 文字と岩の衝突判定
  const checkCharacterCollision = useCallback((char: Character, rock: Rock): boolean => {
    return checkCollision(char.x, char.y, rock.x, rock.y, rock.radius)
  }, [])

  // 文字を岩から反射させる物理計算
  const deflectCharacter = useCallback((char: Character, rock: Rock) => {
    const reflection = calculateReflection(
      char.x, char.y, char.vx, char.vy,
      rock.x, rock.y, rock.radius
    )
    
    return {
      ...char,
      x: reflection.x,
      y: reflection.y,
      vx: reflection.vx,
      vy: reflection.vy
    }
  }, [])

  // 文字の溢れ処理と境界チェック
  const checkOverflow = useCallback((char: Character, canvas: HTMLCanvasElement): Character => {
    const { left: waterfallLeft, right: waterfallRight } = waterfallBounds(canvas.width)
    
    // 近くの文字をカウント（溢れ判定用）
    const nearbyChars = characters.filter(c => 
      Math.abs(c.x - char.x) < 50 && 
      Math.abs(c.y - char.y) < 50 && 
      c.vy < 0.1
    )
    
    // 文字が溜まりすぎた場合の溢れ処理
    if (nearbyChars.length > PHYSICS_CONFIG.MAX_NEARBY_CHARS && char.vy < 0.3) {
      return {
        ...char,
        isOverflowing: true,
        vy: PHYSICS_CONFIG.OVERFLOW_VELOCITY + Math.random() * 0.25,
        vx: char.vx * 1.3 // 横方向の動きを強化
      }
    }
    
    // 溢れていない文字は滝の幅内に制限
    if (!char.isOverflowing) {
      if (char.x < waterfallLeft) {
        return { ...char, x: waterfallLeft, vx: Math.abs(char.vx) * 0.5 }
      }
      if (char.x > waterfallRight) {
        return { ...char, x: waterfallRight, vx: -Math.abs(char.vx) * 0.5 }
      }
    }
    
    return char
  }, [characters, waterfallBounds])

  // 全文字の物理更新処理
  const updateCharacters = useCallback((deltaTime: number) => {
    setCharacters(prev => {
      const canvas = canvasRef.current
      if (!canvas) return prev
      
      return prev.map(char => {
        // 基本的な物理演算（位置と速度の更新）
        let newChar = {
          ...char,
          x: char.x + char.vx * deltaTime,
          y: char.y + char.vy * deltaTime,
          vy: char.vy + PHYSICS_CONFIG.GRAVITY * deltaTime, // 重力を適用
          age: char.age + deltaTime
        }
        
        // 自然な流れのための乱流効果（溢れていない場合のみ）
        if (!newChar.isOverflowing) {
          newChar.vx += (Math.random() - 0.5) * PHYSICS_CONFIG.TURBULENCE * deltaTime
        }
        
        // 軌跡の更新（視覚効果）
        newChar.trail = updateTrail(char.trail, char.x, char.y, char.opacity)
        
        // 岩との衝突判定と反射処理
        for (const rock of rocks) {
          if (checkCharacterCollision(newChar, rock)) {
            newChar = deflectCharacter(newChar, rock)
            newChar.trail = [] // 衝突時は軌跡をクリア
          }
        }
        
        // 溢れ処理と境界制約の適用
        newChar = checkOverflow(newChar, canvas)
        
        // 文字のフェードアウト処理
        if (newChar.y > canvas.height - 100) {
          newChar.opacity = Math.max(0, newChar.opacity - 0.01 * deltaTime)
        }
        
        // 古い文字のフェードアウト
        if (newChar.age > 8000) {
          newChar.opacity = Math.max(0, newChar.opacity - 0.005 * deltaTime)
        }
        
        return newChar
      }).filter(char => char.opacity > 0.01 && char.y < canvas.height + 100) // 見えない文字を除去
    })
  }, [rocks, checkCharacterCollision, deflectCharacter, checkOverflow])

  // 新しい文字を生成
  const spawnCharacter = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || isLoadingTexts || dazaiTexts.length === 0) return
    
    const char = getRandomChar()
    if (!char || char === ' ' || char === '\n') return // 空白や改行はスキップ
    
    // 滝の中央部分に文字を生成
    const { left: waterfallLeft, width } = waterfallBounds(canvas.width)
    
    const newCharacter: Character = {
      id: Math.random().toString(36),
      char,
      x: waterfallLeft + Math.random() * width,
      y: -20, // 画面上部から開始
      vx: (Math.random() - 0.5) * 0.025, // 軽微な横方向の初期速度
      vy: PHYSICS_CONFIG.MIN_VELOCITY + Math.random() * 0.15, // 縦方向の初期速度
      opacity: 1,
      trail: [],
      age: 0,
      isOverflowing: false
    }
    
    setCharacters(prev => [...prev, newCharacter])
  }, [getRandomChar, isLoadingTexts, dazaiTexts, waterfallBounds])

  // Canvas描画処理
  const render = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    
    // 背景の描画
    drawBackground(ctx, canvas)
    
    // 岩の描画
    drawRocks(ctx, rocks)
    
    // Canvas描画設定
    setupCanvasContext(ctx)
    
    // 文字の軌跡を先に描画
    drawCharacterTrails(ctx, characters)
    
    // メインの文字を描画
    drawCharacters(ctx, characters)
  }, [characters, rocks])

  // メインアニメーションループ
  const animate = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime
    
    // 文字生成タイマーの更新
    characterSpawnRef.current += deltaTime
    if (characterSpawnRef.current > PHYSICS_CONFIG.SPAWN_INTERVAL) {
      spawnCharacter()
      characterSpawnRef.current = 0
    }
    
    // 物理演算と描画の実行
    updateCharacters(deltaTime)
    render()
    
    // 次のフレームをスケジュール
    animationRef.current = requestAnimationFrame(animate)
  }, [spawnCharacter, updateCharacters, render])

  // Canvasクリック時の岩配置処理
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // クリック位置の計算
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // 新しい岩を生成
    const newRock: Rock = {
      id: Math.random().toString(36),
      x,
      y,
      radius: 25 + Math.random() * 15 // ランダムなサイズ
    }
    
    setRocks(prev => [...prev, newRock])
  }, [setRocks])

  // 全ての岩をクリアする処理
  const clearRocks = useCallback(() => {
    setRocks([])
  }, [setRocks])

  // Canvas初期化とリサイズ処理
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Canvasサイズをウィンドウサイズに合わせる
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // アニメーション開始
    animationRef.current = requestAnimationFrame(animate)
    
    // クリーンアップ関数
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* メインの文字流れCanvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="text-flow-canvas absolute inset-0"
      />
      
      {/* 操作パネル */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {/* 岩クリアボタン */}
        <button
          onClick={clearRocks}
          className="px-4 py-2 bg-black/70 text-white rounded-lg text-sm hover:bg-black/80 transition-colors backdrop-blur-sm border border-white/20"
        >
          岩をクリア
        </button>
        
        {/* 操作説明 */}
        <div className="px-4 py-2 bg-black/70 text-white rounded-lg text-sm backdrop-blur-sm border border-white/20">
          クリックして岩を配置 
        </div>
        
        {/* ローディング状態の表示 */}
        {isLoadingTexts && (
          <div className="px-4 py-2 bg-black/70 text-white rounded-lg text-sm backdrop-blur-sm border border-white/20">
            太宰治の作品を読み込み中...
          </div>
        )}
        
        {/* API接続エラーの表示 */}
        {!isLoadingTexts && dazaiTexts.length === 0 && (
          <div className="px-4 py-2 bg-red-600/70 text-white rounded-lg text-sm backdrop-blur-sm border border-white/20">
            APIに接続できません。再読み込みしてください。
          </div>
        )}
      </div>
    </div>
  )
}

export default App