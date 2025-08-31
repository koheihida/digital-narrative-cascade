// Canvas描画ユーティリティ関数

import { Character, Rock } from '../types'

// 背景グラデーションの描画
export function drawBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  // 滝の背景グラデーション効果
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, 'rgb(5, 5, 15)')
  gradient.addColorStop(0.3, 'rgb(0, 0, 0)')
  gradient.addColorStop(1, 'rgb(0, 0, 5)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 滝の霧効果を追加
  const mistGradient = ctx.createRadialGradient(
    canvas.width/2, canvas.height*0.8, 0, 
    canvas.width/2, canvas.height*0.8, canvas.width*0.6
  )
  mistGradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)')
  mistGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = mistGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// 岩の描画（控えめで美しい表示）
export function drawRocks(ctx: CanvasRenderingContext2D, rocks: Rock[]) {
  rocks.forEach(rock => {
    // 内側の薄い塗りつぶし
    ctx.fillStyle = 'rgba(20, 25, 35, 0.3)'
    ctx.beginPath()
    ctx.arc(rock.x, rock.y, rock.radius, 0, Math.PI * 2)
    ctx.fill()
    
    // 美しい輪郭線（グラデーション効果）
    const gradient = ctx.createRadialGradient(
      rock.x, rock.y, rock.radius * 0.7,
      rock.x, rock.y, rock.radius
    )
    gradient.addColorStop(0, 'rgba(100, 120, 150, 0.4)')
    gradient.addColorStop(1, 'rgba(60, 80, 110, 0.2)')
    
    ctx.strokeStyle = gradient
    ctx.lineWidth = 1.5
    ctx.stroke()
    
    // さらに内側のハイライト
    ctx.strokeStyle = 'rgba(150, 170, 200, 0.15)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(rock.x, rock.y, rock.radius * 0.8, 0, Math.PI * 2)
    ctx.stroke()
  })
}

// 文字の軌跡描画
export function drawCharacterTrails(ctx: CanvasRenderingContext2D, characters: Character[]) {
  characters.forEach(char => {
    char.trail.forEach((point) => {
      if (point.opacity > 0.01) {
        ctx.fillStyle = `rgba(200, 230, 255, ${point.opacity * 0.3})`
        ctx.fillText(char.char, point.x, point.y)
      }
    })
  })
}

// メインの文字描画（光る効果付き）
export function drawCharacters(ctx: CanvasRenderingContext2D, characters: Character[]) {
  characters.forEach(char => {
    const glowIntensity = Math.sin(char.age * 0.003) * 0.2 + 0.8 // 脈動効果
    const overflowOpacity = char.isOverflowing ? 0.7 : 1.0 // 溢れ時の透明度調整
    
    // 外側の光彩効果
    ctx.shadowColor = char.isOverflowing ? 'rgba(255, 200, 180, 0.6)' : 'rgba(180, 220, 255, 0.6)'
    ctx.shadowBlur = 8
    ctx.fillStyle = `rgba(220, 240, 255, ${char.opacity * glowIntensity * overflowOpacity})`
    ctx.fillText(char.char, char.x, char.y)
    
    // 内側の文字本体
    ctx.shadowBlur = 0
    ctx.fillStyle = `rgba(255, 255, 255, ${char.opacity * overflowOpacity})`
    ctx.fillText(char.char, char.x, char.y)
  })
  
  ctx.shadowBlur = 0 // シャドウをリセット
}

// Canvas設定の初期化
export function setupCanvasContext(ctx: CanvasRenderingContext2D) {
  ctx.font = '18px "Noto Serif JP", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
}