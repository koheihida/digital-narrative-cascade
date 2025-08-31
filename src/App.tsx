import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { useKV } from './hooks/useKV'
import { Character, Rock, DazaiWork, TextSource, SpeedLevel, UrlFetchState } from './types'
import { 
  PHYSICS_CONFIG,
  createPhysicsConfig,
  DynamicPhysicsConfig,
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
import { fetchTextFromUrl } from './utils/urlTextExtractor'
import HowToModal from './components/HowToModal'
import { CompactTextSourceSelector, COMPACT_TEXT_SOURCES } from './components/CompactTextSourceSelector'
import { CompactSpeedController, COMPACT_SPEED_CONFIGS } from './components/CompactSpeedController'
import CompactUrlFetcher from './components/CompactUrlFetcher'
import ElegantActionButton from './components/ElegantActionButton'

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
  
  // テキストソースの状態
  const [currentTextSource, setCurrentTextSource] = useKV<TextSource>('text-source', 'dazai')
  const [dazaiTexts, setDazaiTexts] = useState<string[]>(FALLBACK_TEXTS)
  const [isLoadingTexts, setIsLoadingTexts] = useState(true)
  const [currentTexts, setCurrentTexts] = useState<string[]>(FALLBACK_TEXTS)
  
  // スピード制御の状態
  const [currentSpeedLevel, setCurrentSpeedLevel] = useKV<SpeedLevel>('speed-level', 3)
  const [physicsConfig, setPhysicsConfig] = useState<DynamicPhysicsConfig>(() => {
    const speedConfig = COMPACT_SPEED_CONFIGS.find(config => config.level === 3)
    return createPhysicsConfig({
      GRAVITY: speedConfig?.gravity || PHYSICS_CONFIG.GRAVITY,
      SPAWN_INTERVAL: speedConfig?.spawnInterval || PHYSICS_CONFIG.SPAWN_INTERVAL,
      MIN_VELOCITY: speedConfig?.minVelocity || PHYSICS_CONFIG.MIN_VELOCITY
    })
  })
  
  // URL文字取得の状態
  const [urlFetchState, setUrlFetchState] = useState<UrlFetchState>({
    url: '',
    isLoading: false,
    error: null,
    texts: []
  })
  const [customTexts, setCustomTexts] = useState<string[]>([])
  
  // アニメーションと文字生成の管理
  const animationRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const characterSpawnRef = useRef<number>(0)
  
  // テキスト管理の参照
  const textIndexRef = useRef<number>(0)
  const currentTextRef = useRef<string>(FALLBACK_TEXTS[0])
  
  // テキストソース切り替え処理
  const handleTextSourceChange = useCallback((newSource: TextSource) => {
    setCurrentTextSource(newSource)
    textIndexRef.current = 0 // テキストインデックスをリセット
  }, [setCurrentTextSource])
  
  // スピード変更処理
  const handleSpeedChange = useCallback((newSpeed: SpeedLevel) => {
    setCurrentSpeedLevel(newSpeed)
    const speedConfig = COMPACT_SPEED_CONFIGS.find(config => config.level === newSpeed)
    if (speedConfig) {
      setPhysicsConfig(createPhysicsConfig({
        GRAVITY: speedConfig.gravity,
        SPAWN_INTERVAL: speedConfig.spawnInterval,
        MIN_VELOCITY: speedConfig.minVelocity
      }))
    }
  }, [setCurrentSpeedLevel])
  
  // URL文字取得処理
  const handleUrlFetch = useCallback(async (url: string) => {
    setUrlFetchState({
      url: '',
      isLoading: true,
      error: null,
      texts: []
    })
    
    try {
      const result = await fetchTextFromUrl(url)
      
      if (result.error) {
        setUrlFetchState({
          url,
          isLoading: false,
          error: result.error,
          texts: []
        })
      } else {
        setUrlFetchState({
          url,
          isLoading: false,
          error: null,
          texts: result.texts
        })
        setCustomTexts(result.texts)
        
        // 自動的にカスタムテキストソースに切り替え
        if (currentTextSource !== 'custom') {
          setCurrentTextSource('custom')
          textIndexRef.current = 0
        }
      }
    } catch (error) {
      setUrlFetchState({
        url,
        isLoading: false,
        error: error instanceof Error ? error.message : '不明なエラーが発生しました',
        texts: []
      })
    }
  }, [currentTextSource, setCurrentTextSource])
  
  // URL取得リセット処理
  const handleUrlReset = useCallback(() => {
    setUrlFetchState({
      url: '',
      isLoading: false,
      error: null,
      texts: []
    })
    setCustomTexts([])
    
    // 太宰治に戻す
    if (currentTextSource === 'custom') {
      setCurrentTextSource('dazai')
      textIndexRef.current = 0
    }
  }, [currentTextSource, setCurrentTextSource])
  
  // 現在のテキストソースに応じたテキストを取得
  useEffect(() => {
    const sourceConfig = COMPACT_TEXT_SOURCES.find(source => source.id === currentTextSource)
    
    if (currentTextSource === 'hannya') {
      const hannyaTexts = sourceConfig?.texts || []
      setCurrentTexts(hannyaTexts)
      currentTextRef.current = hannyaTexts[0] || ''
      setIsLoadingTexts(false)
    } else if (currentTextSource === 'custom') {
      // カスタムURL取得のテキストを使用
      setCurrentTexts(customTexts)
      currentTextRef.current = customTexts[0] || ''
      setIsLoadingTexts(false)
    } else {
      // 太宰治の場合は既存のAPIロジックを使用
      setCurrentTexts(dazaiTexts)
      currentTextRef.current = dazaiTexts[0] || FALLBACK_TEXTS[0]
    }
  }, [currentTextSource, dazaiTexts, customTexts])

  // 滝の境界計算関数をメモ化
  const waterfallBounds = useCallback((canvasWidth: number) => getWaterfallBounds(canvasWidth), [])

  // 太宰治の作品をAPIから取得（CORS対応）
  useEffect(() => {
    const fetchDazaiTexts = async () => {
      try {
        setIsLoadingTexts(true)
        
        // CORSエラーを回避するためプロキシを使用する場合の設定
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.bungomail.com/works?author=太宰治')
          : 'https://api.bungomail.com/works?author=太宰治'
          
        const response = await fetch(apiUrl)
        if (response.ok) {
          let works: DazaiWork[]
          
          if (process.env.NODE_ENV === 'production') {
            // プロキシ経由の場合
            const proxyData = await response.json()
            works = JSON.parse(proxyData.contents)
          } else {
            // 直接アクセスの場合
            works = await response.json()
          }
          
          const texts = works.map(work => work.content).filter(content => content && content.length > 0)
          if (texts.length > 0) {
            setDazaiTexts(texts)
            // 現在のソースが太宰治の場合のみテキスト参照を更新
            if (currentTextSource === 'dazai') {
              currentTextRef.current = texts[0]
            }
          } else {
            // APIは動作するがコンテンツがない場合、フォールバックを使用
            console.warn('APIからコンテンツを取得できません。フォールバックテキストを使用します。')
            setDazaiTexts(FALLBACK_TEXTS)
            if (currentTextSource === 'dazai') {
              currentTextRef.current = FALLBACK_TEXTS[0]
            }
          }
        } else {
          console.warn('APIリクエストが失敗しました。フォールバックテキストを使用します。')
          setDazaiTexts(FALLBACK_TEXTS)
          if (currentTextSource === 'dazai') {
            currentTextRef.current = FALLBACK_TEXTS[0]
          }
        }
      } catch (error) {
        console.error('太宰治のテキスト取得に失敗しました。フォールバックテキストを使用します。', error)
        setDazaiTexts(FALLBACK_TEXTS)
        if (currentTextSource === 'dazai') {
          currentTextRef.current = FALLBACK_TEXTS[0]
        }
      } finally {
        // 太宰治ソースの場合のみローディング状態を更新
        if (currentTextSource === 'dazai') {
          setIsLoadingTexts(false)
        }
      }
    }

    fetchDazaiTexts()
  }, [currentTextSource])

  // ランダムな文字を取得（現在のテキストソースから順次選択）
  const getRandomChar = useCallback(() => {
    if (textIndexRef.current >= currentTextRef.current.length) {
      // 現在のテキストが終了したら次のテキストを選択
      const nextText = currentTexts[Math.floor(Math.random() * currentTexts.length)]
      currentTextRef.current = nextText
      textIndexRef.current = 0
    }
    const char = currentTextRef.current[textIndexRef.current]
    textIndexRef.current++
    return char
  }, [currentTexts])

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
    if (nearbyChars.length > physicsConfig.MAX_NEARBY_CHARS && char.vy < 0.3) {
      return {
        ...char,
        isOverflowing: true,
        vy: physicsConfig.OVERFLOW_VELOCITY + Math.random() * 0.25,
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
  }, [characters, physicsConfig, waterfallBounds])

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
          vy: char.vy + physicsConfig.GRAVITY * deltaTime, // 動的重力を適用
          age: char.age + deltaTime
        }
        
        // 自然な流れのための乱流効果（溢れていない場合のみ）
        if (!newChar.isOverflowing) {
          newChar.vx += (Math.random() - 0.5) * physicsConfig.TURBULENCE * deltaTime
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
  }, [rocks, physicsConfig, checkCharacterCollision, deflectCharacter, checkOverflow])

  // 新しい文字を生成
  const spawnCharacter = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || isLoadingTexts || currentTexts.length === 0) return
    
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
      vy: physicsConfig.MIN_VELOCITY + Math.random() * 0.15, // 動的な縦方向初期速度
      opacity: 1,
      trail: [],
      age: 0,
      isOverflowing: false
    }
    
    setCharacters(prev => [...prev, newCharacter])
  }, [getRandomChar, isLoadingTexts, currentTexts, physicsConfig, waterfallBounds])

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
    
    // 文字生成タイマーの更新（動的スピード適用）
    characterSpawnRef.current += deltaTime
    if (characterSpawnRef.current > physicsConfig.SPAWN_INTERVAL) {
      spawnCharacter()
      characterSpawnRef.current = 0
    }
    
    // 物理演算と描画の実行
    updateCharacters(deltaTime)
    render()
    
    // 次のフレームをスケジュール
    animationRef.current = requestAnimationFrame(animate)
  }, [physicsConfig, spawnCharacter, updateCharacters, render])

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

  // 全てのClearする処理
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
      
      {/* 控えめなエレガント操作パネル */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 w-56">
        {/* 使い方ガイド */}
        <HowToModal />
        
        {/* テキストソース選択 */}
        <CompactTextSourceSelector
          currentSource={currentTextSource}
          onSourceChange={handleTextSourceChange}
          isLoading={isLoadingTexts && currentTextSource === 'dazai'}
        />
        
        {/* スピード制御 */}
        <CompactSpeedController
          currentSpeed={currentSpeedLevel}
          onSpeedChange={handleSpeedChange}
        />
        
        {/* URL文字取得 */}
        {currentTextSource === 'custom' && (
          <CompactUrlFetcher
            onUrlFetch={handleUrlFetch}
            fetchState={urlFetchState}
            onReset={handleUrlReset}
          />
        )}
        
        {/* 岩クリア */}
        <ElegantActionButton onClick={clearRocks} variant="danger">
          Clear
        </ElegantActionButton>
        
      </div>
    </div>
  )
}

export default App