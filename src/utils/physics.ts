// 物理演算ユーティリティ関数

// 物理定数（デフォルト値）
export const DEFAULT_PHYSICS_CONFIG = {
  GRAVITY: 0.001, // 重力加速度
  TURBULENCE: 0.000025, // 乱流の強さ
  DEFLECTION_DAMPING: 0.7, // 反射時の減衰率
  MIN_VELOCITY: 0.25, // 最小速度
  OVERFLOW_VELOCITY: 0.5, // 溢れ時の速度
  SPAWN_INTERVAL: 4, // 文字生成間隔（ms）
  TRAIL_LENGTH: 8, // 軌跡の長さ
  MAX_NEARBY_CHARS: 8, // 溢れを起こす文字数
  WATERFALL_WIDTH: 300 // 滝の幅（8cm相当）
} as const

// 動的物理設定（速度制御用）
export interface DynamicPhysicsConfig {
  GRAVITY: number
  TURBULENCE: number
  DEFLECTION_DAMPING: number
  MIN_VELOCITY: number
  OVERFLOW_VELOCITY: number
  SPAWN_INTERVAL: number
  TRAIL_LENGTH: number
  MAX_NEARBY_CHARS: number
  WATERFALL_WIDTH: number
}

// デフォルト設定をコピーして動的設定を作成
export const createPhysicsConfig = (overrides: Partial<DynamicPhysicsConfig> = {}): DynamicPhysicsConfig => ({
  ...DEFAULT_PHYSICS_CONFIG,
  ...overrides
})

// 後方互換性のため
export const PHYSICS_CONFIG = DEFAULT_PHYSICS_CONFIG

// 文字と岩の衝突判定
export function checkCollision(
  charX: number, 
  charY: number, 
  rockX: number, 
  rockY: number, 
  rockRadius: number
): boolean {
  const dx = charX - rockX
  const dy = charY - rockY
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < rockRadius + 8 // 文字のサイズを考慮
}

// 反射ベクトルの計算
export function calculateReflection(
  charX: number,
  charY: number,
  charVx: number,
  charVy: number,
  rockX: number,
  rockY: number,
  rockRadius: number
) {
  const dx = charX - rockX
  const dy = charY - rockY
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance === 0) {
    return { x: charX, y: charY, vx: charVx, vy: charVy }
  }
  
  // 法線ベクトルを計算
  const normalX = dx / distance
  const normalY = dy / distance
  
  // 反射ベクトルを計算
  const dotProduct = charVx * normalX + charVy * normalY
  const newVx = charVx - 2 * dotProduct * normalX
  const newVy = charVy - 2 * dotProduct * normalY
  
  // 岩から文字を押し出す
  const pushDistance = rockRadius + 10 - distance
  const newX = charX + normalX * pushDistance
  const newY = charY + normalY * pushDistance
  
  return {
    x: newX,
    y: newY,
    vx: newVx * PHYSICS_CONFIG.DEFLECTION_DAMPING,
    vy: Math.max(newVy * PHYSICS_CONFIG.DEFLECTION_DAMPING, PHYSICS_CONFIG.MIN_VELOCITY)
  }
}

// 軌跡の更新
export function updateTrail(
  trail: { x: number; y: number; opacity: number }[],
  currentX: number,
  currentY: number,
  currentOpacity: number
) {
  return [
    { x: currentX, y: currentY, opacity: currentOpacity },
    ...trail.slice(0, PHYSICS_CONFIG.TRAIL_LENGTH - 1)
  ].map((point, index) => ({
    ...point,
    opacity: point.opacity * Math.pow(0.8, index)
  }))
}

// 滝の境界計算
export function getWaterfallBounds(canvasWidth: number) {
  const left = (canvasWidth - PHYSICS_CONFIG.WATERFALL_WIDTH) / 2
  const right = left + PHYSICS_CONFIG.WATERFALL_WIDTH
  return { left, right, width: PHYSICS_CONFIG.WATERFALL_WIDTH }
}