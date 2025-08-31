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

// テキストソースの種類
export type TextSource = 'dazai' | 'hannya' | 'custom'

// テキストソース設定のインターフェース
export interface TextSourceConfig {
  id: TextSource
  name: string
  description: string
  texts: string[]
}

// スピードレベルの定義
export type SpeedLevel = 1 | 2 | 3 | 4 | 5

// スピード設定のインターフェース
export interface SpeedConfig {
  level: SpeedLevel
  name: string
  description: string
  gravity: number
  spawnInterval: number
  minVelocity: number
}

// URL文字取得の状態
export interface UrlFetchState {
  url: string
  isLoading: boolean
  error: string | null
  texts: string[]
}