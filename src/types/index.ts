// 型定義ファイル

// 文字オブジェクトのインターフェース
export interface Character {
  id: string
  char: string
  x: number
  y: number
  vx: number // 横方向の速度
  vy: number // 縦方向の速度
  opacity: number // 透明度
  trail: { x: number; y: number; opacity: number }[] // 軌跡
  age: number // 文字の年齢（生成からの時間）
  isOverflowing: boolean // 溢れ状態かどうか
}

// 岩オブジェクトのインターフェース
export interface Rock {
  id: string
  x: number
  y: number
  radius: number
}

// 太宰治作品のインターフェース
export interface DazaiWork {
  title: string
  content: string
}