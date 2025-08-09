import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

interface Character {
  id: string
  char: string
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
}

interface Rock {
  id: string
  x: number
  y: number
  radius: number
}

const LITERARY_TEXTS = [
  "吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。",
  "国境の長いトンネルを抜けると雪国であった。夜の底が白くなった。信号所に汽車が止まった。",
  "メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。メロスには政治がわからぬ。",
  "木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深い谷を臨む檜のかけ橋である。",
  "親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。",
  "古池や蛙飛び込む水の音",
  "夏草や兵どもが夢の跡",
  "閑さや岩にしみ入る蝉の声",
  "雲雀より上にやすらふ峠かな",
  "菜の花や月は東に日は西に"
]

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rocks, setRocks] = useKV('waterfall-rocks', [] as Rock[])
  const [characters, setCharacters] = useState<Character[]>([])
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const characterSpawnRef = useRef<number>(0)
  const textIndexRef = useRef<number>(0)
  const currentTextRef = useRef<string>(LITERARY_TEXTS[0])

  const getRandomChar = useCallback(() => {
    if (textIndexRef.current >= currentTextRef.current.length) {
      const nextText = LITERARY_TEXTS[Math.floor(Math.random() * LITERARY_TEXTS.length)]
      currentTextRef.current = nextText
      textIndexRef.current = 0
    }
    const char = currentTextRef.current[textIndexRef.current]
    textIndexRef.current++
    return char
  }, [])

  const checkCollision = useCallback((char: Character, rock: Rock): boolean => {
    const dx = char.x - rock.x
    const dy = char.y - rock.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < rock.radius + 8
  }, [])

  const deflectCharacter = useCallback((char: Character, rock: Rock) => {
    const dx = char.x - rock.x
    const dy = char.y - rock.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance === 0) return char
    
    const normalX = dx / distance
    const normalY = dy / distance
    
    const dotProduct = char.vx * normalX + char.vy * normalY
    
    const newVx = char.vx - 2 * dotProduct * normalX
    const newVy = char.vy - 2 * dotProduct * normalY
    
    const pushDistance = rock.radius + 10 - distance
    const newX = char.x + normalX * pushDistance
    const newY = char.y + normalY * pushDistance
    
    return {
      ...char,
      x: newX,
      y: newY,
      vx: newVx * 0.8,
      vy: Math.max(newVy * 0.8, 0.5)
    }
  }, [])

  const updateCharacters = useCallback((deltaTime: number) => {
    setCharacters(prev => {
      const canvas = canvasRef.current
      if (!canvas) return prev
      
      return prev.map(char => {
        let newChar = {
          ...char,
          x: char.x + char.vx * deltaTime,
          y: char.y + char.vy * deltaTime,
          vy: char.vy + 0.002 * deltaTime
        }
        
        for (const rock of rocks) {
          if (checkCollision(newChar, rock)) {
            newChar = deflectCharacter(newChar, rock)
          }
        }
        
        if (newChar.y > canvas.height + 50) {
          newChar.opacity = 0
        }
        
        return newChar
      }).filter(char => char.opacity > 0 && char.y < canvas.height + 100)
    })
  }, [rocks, checkCollision, deflectCharacter])

  const spawnCharacter = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const char = getRandomChar()
    if (!char || char === ' ' || char === '\n') return
    
    const newCharacter: Character = {
      id: Math.random().toString(36),
      char,
      x: Math.random() * (canvas.width - 40) + 20,
      y: -20,
      vx: (Math.random() - 0.5) * 0.1,
      vy: 0.5 + Math.random() * 0.3,
      opacity: 1
    }
    
    setCharacters(prev => [...prev, newCharacter])
  }, [getRandomChar])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    rocks.forEach(rock => {
      ctx.fillStyle = 'rgba(128, 128, 128, 0.8)'
      ctx.beginPath()
      ctx.arc(rock.x, rock.y, rock.radius, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.strokeStyle = 'rgba(160, 160, 160, 0.6)'
      ctx.lineWidth = 2
      ctx.stroke()
    })
    
    ctx.font = '16px "Noto Serif JP", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    characters.forEach(char => {
      ctx.fillStyle = `rgba(255, 255, 255, ${char.opacity})`
      ctx.fillText(char.char, char.x, char.y)
    })
  }, [characters, rocks])

  const animate = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime
    
    characterSpawnRef.current += deltaTime
    if (characterSpawnRef.current > 150) {
      spawnCharacter()
      characterSpawnRef.current = 0
    }
    
    updateCharacters(deltaTime)
    render()
    
    animationRef.current = requestAnimationFrame(animate)
  }, [spawnCharacter, updateCharacters, render])

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newRock: Rock = {
      id: Math.random().toString(36),
      x,
      y,
      radius: 25 + Math.random() * 15
    }
    
    setRocks(prev => [...prev, newRock])
  }, [setRocks])

  const clearRocks = useCallback(() => {
    setRocks([])
  }, [setRocks])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="text-flow-canvas absolute inset-0"
      />
      
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={clearRocks}
          className="px-3 py-1 bg-muted/80 text-muted-foreground rounded text-sm hover:bg-muted transition-colors"
        >
          岩をクリア
        </button>
        <div className="px-3 py-1 bg-muted/80 text-muted-foreground rounded text-sm">
          クリックして岩を配置
        </div>
      </div>
    </div>
  )
}

export default App