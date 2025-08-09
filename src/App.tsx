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
  trail: { x: number; y: number; opacity: number }[]
  age: number
  isOverflowing: boolean
}

interface Rock {
  id: string
  x: number
  y: number
  radius: number
}

interface DazaiWork {
  title: string
  content: string
}

// Fallback texts in case API fails
const FALLBACK_TEXTS = [
  '人間失格の序章。私は、その男の写真を三葉、見たことがある。',
  '津軽の風景は、私の心に深い印象を残した。',
  '斜陽の家族は、時代の波に飲み込まれていく。'
]

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rocks, setRocks] = useKV('waterfall-rocks', [] as Rock[])
  const [characters, setCharacters] = useState<Character[]>([])
  const [dazaiTexts, setDazaiTexts] = useState<string[]>(FALLBACK_TEXTS)
  const [isLoadingTexts, setIsLoadingTexts] = useState(true)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const characterSpawnRef = useRef<number>(0)
  const textIndexRef = useRef<number>(0)
  const currentTextRef = useRef<string>(FALLBACK_TEXTS[0])
  const overflowPositionsRef = useRef<{ [key: string]: { count: number; lastSpawn: number } }>({})

  // Fetch Dazai works from API
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
            // If API works but no content, wait for retry instead of using fallback
            console.warn('No content from API, retrying...')
            setTimeout(fetchDazaiTexts, 2000)
            return
          }
        } else {
          console.warn('API request failed, retrying...')
          setTimeout(fetchDazaiTexts, 2000)
          return
        }
      } catch (error) {
        console.error('Failed to fetch Dazai texts, retrying...', error)
        setTimeout(fetchDazaiTexts, 2000)
        return
      } finally {
        setIsLoadingTexts(false)
      }
    }

    fetchDazaiTexts()
  }, [])

  const getRandomChar = useCallback(() => {
    if (textIndexRef.current >= currentTextRef.current.length) {
      const nextText = dazaiTexts[Math.floor(Math.random() * dazaiTexts.length)]
      currentTextRef.current = nextText
      textIndexRef.current = 0
    }
    const char = currentTextRef.current[textIndexRef.current]
    textIndexRef.current++
    return char
  }, [dazaiTexts])

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
      vx: newVx * 0.7, // Reduced deflection force for slower flow
      vy: Math.max(newVy * 0.7, 0.25) // Minimum speed reduced for slower flow
    }
  }, [])

  // Check if character should overflow when blocked
  const checkOverflow = useCallback((char: Character, canvas: HTMLCanvasElement): Character => {
    const waterfallWidth = 300
    const waterfallLeft = (canvas.width - waterfallWidth) / 2
    const waterfallRight = waterfallLeft + waterfallWidth
    
    // Count characters in nearby area
    const nearbyChars = characters.filter(c => 
      Math.abs(c.x - char.x) < 50 && Math.abs(c.y - char.y) < 50 && c.vy < 0.1
    )
    
    // If too many characters accumulated, start overflow
    if (nearbyChars.length > 8 && char.vy < 0.3) {
      return {
        ...char,
        isOverflowing: true,
        vy: 0.5 + Math.random() * 0.25, // Reduced overflow force for slower flow
        vx: char.vx * 1.3 // Reduced horizontal movement for overflow effect
      }
    }
    
    // Keep characters within waterfall bounds unless overflowing
    if (!char.isOverflowing) {
      if (char.x < waterfallLeft) {
        return { ...char, x: waterfallLeft, vx: Math.abs(char.vx) * 0.5 }
      }
      if (char.x > waterfallRight) {
        return { ...char, x: waterfallRight, vx: -Math.abs(char.vx) * 0.5 }
      }
    }
    
    return char
  }, [characters])

  const updateCharacters = useCallback((deltaTime: number) => {
    setCharacters(prev => {
      const canvas = canvasRef.current
      if (!canvas) return prev
      
      return prev.map(char => {
        let newChar = {
          ...char,
          x: char.x + char.vx * deltaTime,
          y: char.y + char.vy * deltaTime,
          vy: char.vy + 0.001 * deltaTime, // Reduced gravity for slower fall
          age: char.age + deltaTime
        }
        
        // Add turbulence for more natural flow (reduced for centered waterfall)
        if (!newChar.isOverflowing) {
          newChar.vx += (Math.random() - 0.5) * 0.000025 * deltaTime // Reduced turbulence for slower flow
        }
        
        // Update trail
        newChar.trail = [
          { x: char.x, y: char.y, opacity: char.opacity },
          ...char.trail.slice(0, 8)
        ].map((point, index) => ({
          ...point,
          opacity: point.opacity * Math.pow(0.8, index)
        }))
        
        // Check rock collisions
        for (const rock of rocks) {
          if (checkCollision(newChar, rock)) {
            newChar = deflectCharacter(newChar, rock)
            // Clear trail on collision for dramatic effect
            newChar.trail = []
          }
        }
        
        // Apply overflow logic and boundary constraints
        newChar = checkOverflow(newChar, canvas)
        
        // Fade out characters as they age or leave screen
        if (newChar.y > canvas.height - 100) {
          newChar.opacity = Math.max(0, newChar.opacity - 0.01 * deltaTime)
        }
        
        if (newChar.age > 8000) {
          newChar.opacity = Math.max(0, newChar.opacity - 0.005 * deltaTime)
        }
        
        return newChar
      }).filter(char => char.opacity > 0.01 && char.y < canvas.height + 100)
    })
  }, [rocks, checkCollision, deflectCharacter, checkOverflow])

  const spawnCharacter = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || isLoadingTexts || dazaiTexts.length === 0) return
    
    const char = getRandomChar()
    if (!char || char === ' ' || char === '\n') return
    
    // Calculate waterfall width (8cm ≈ 300px at 96dpi)
    const waterfallWidth = 300
    const waterfallLeft = (canvas.width - waterfallWidth) / 2
    
    const newCharacter: Character = {
      id: Math.random().toString(36),
      char,
      x: waterfallLeft + Math.random() * waterfallWidth,
      y: -20,
      vx: (Math.random() - 0.5) * 0.025, // Reduced horizontal movement for slower flow
      vy: 0.25 + Math.random() * 0.15, // Half the vertical speed
      opacity: 1,
      trail: [],
      age: 0,
      isOverflowing: false
    }
    
    setCharacters(prev => [...prev, newCharacter])
  }, [getRandomChar, isLoadingTexts, dazaiTexts])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    
    // Create gradient background for waterfall effect
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, 'rgb(5, 5, 15)')
    gradient.addColorStop(0.3, 'rgb(0, 0, 0)')
    gradient.addColorStop(1, 'rgb(0, 0, 5)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add waterfall mist effect
    const mistGradient = ctx.createRadialGradient(canvas.width/2, canvas.height*0.8, 0, canvas.width/2, canvas.height*0.8, canvas.width*0.6)
    mistGradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)')
    mistGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = mistGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Render rocks with invisible/hidden styling
    rocks.forEach(rock => {
      // Render rocks with same color as background - invisible but functional
      ctx.fillStyle = 'rgba(5, 5, 15, 0.8)' // Almost same as background gradient
      ctx.beginPath()
      ctx.arc(rock.x, rock.y, rock.radius, 0, Math.PI * 2)
      ctx.fill()
      
      // Very subtle outline for debugging (barely visible)
      ctx.strokeStyle = 'rgba(20, 20, 30, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()
    })
    
    ctx.font = '18px "Noto Serif JP", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Render character trails first
    characters.forEach(char => {
      char.trail.forEach((point, index) => {
        if (point.opacity > 0.01) {
          ctx.fillStyle = `rgba(200, 230, 255, ${point.opacity * 0.3})`
          ctx.fillText(char.char, point.x, point.y)
        }
      })
    })
    
    // Render main characters with glow effect
    characters.forEach(char => {
      const glowIntensity = Math.sin(char.age * 0.003) * 0.2 + 0.8
      const overflowOpacity = char.isOverflowing ? 0.7 : 1.0
      
      // Outer glow
      ctx.shadowColor = char.isOverflowing ? 'rgba(255, 200, 180, 0.6)' : 'rgba(180, 220, 255, 0.6)'
      ctx.shadowBlur = 8
      ctx.fillStyle = `rgba(220, 240, 255, ${char.opacity * glowIntensity * overflowOpacity})`
      ctx.fillText(char.char, char.x, char.y)
      
      // Inner character
      ctx.shadowBlur = 0
      ctx.fillStyle = `rgba(255, 255, 255, ${char.opacity * overflowOpacity})`
      ctx.fillText(char.char, char.x, char.y)
    })
    
    ctx.shadowBlur = 0
  }, [characters, rocks])

  const animate = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime
    
    characterSpawnRef.current += deltaTime
    // Reduced to 4ms for double the amount (was 8ms)
    if (characterSpawnRef.current > 4) {
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
          className="px-4 py-2 bg-black/70 text-white rounded-lg text-sm hover:bg-black/80 transition-colors backdrop-blur-sm border border-white/20"
        >
          岩をクリア
        </button>
        <div className="px-4 py-2 bg-black/70 text-white rounded-lg text-sm backdrop-blur-sm border border-white/20">
          クリックして岩を配置 
        </div>
        {isLoadingTexts && (
          <div className="px-4 py-2 bg-black/70 text-white rounded-lg text-sm backdrop-blur-sm border border-white/20">
            太宰治の作品を読み込み中...
          </div>
        )}
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