// URL文字取得ユーティリティ

const CORS_PROXY = 'https://api.allorigins.win/get?url='
const MAX_TEXT_LENGTH = 50000 // 最大文字数制限

export interface ExtractedText {
  url: string
  texts: string[]
  error?: string
}

// HTMLからテキストを抽出する関数
function extractTextFromHtml(html: string): string {
  // DOMParserを使用してHTMLを解析
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // スクリプトとスタイルタグを除去
  const scripts = doc.querySelectorAll('script, style, noscript')
  scripts.forEach(element => element.remove())
  
  // メインコンテンツエリアを優先的に取得
  const contentSelectors = [
    'main',
    'article', 
    '.content',
    '.main-content',
    '#content',
    '#main',
    '.post-content',
    '.entry-content'
  ]
  
  let mainContent = ''
  for (const selector of contentSelectors) {
    const element = doc.querySelector(selector)
    if (element) {
      mainContent = element.textContent || ''
      break
    }
  }
  
  // メインコンテンツが見つからない場合はbody全体を使用
  if (!mainContent) {
    mainContent = doc.body?.textContent || doc.documentElement?.textContent || ''
  }
  
  return mainContent
}

// テキストをクリーンアップする関数
function cleanupText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // 連続する空白を1つにまとめる
    .replace(/\n\s*\n/g, '\n') // 連続する改行を整理
    .trim()
}

// テキストを適切なチャンクに分割
function chunkText(text: string, maxLength: number = 1000): string[] {
  const chunks: string[] = []
  let currentChunk = ''
  
  // 文単位で分割
  const sentences = text.split(/[。！？\.\!\?]+/)
  
  for (const sentence of sentences) {
    if (sentence.trim().length === 0) continue
    
    if (currentChunk.length + sentence.length > maxLength) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim())
      }
      currentChunk = sentence
    } else {
      currentChunk += sentence
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks.filter(chunk => chunk.length > 0)
}

// URLからテキストを取得する関数
export async function fetchTextFromUrl(url: string): Promise<ExtractedText> {
  try {
    // URLの妥当性を確認
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('HTTPまたはHTTPSのURLのみサポートしています')
    }
    
    // CORSプロキシを使用してHTMLを取得
    const proxyUrl = CORS_PROXY + encodeURIComponent(url)
    const response = await fetch(proxyUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.contents) {
      throw new Error('ページの内容を取得できませんでした')
    }
    
    // HTMLからテキストを抽出
    const rawText = extractTextFromHtml(data.contents)
    
    if (!rawText || rawText.length < 50) {
      throw new Error('十分なテキストコンテンツが見つかりませんでした')
    }
    
    // テキストをクリーンアップ
    const cleanText = cleanupText(rawText)
    
    // 長すぎる場合は切り詰める
    const truncatedText = cleanText.length > MAX_TEXT_LENGTH 
      ? cleanText.substring(0, MAX_TEXT_LENGTH) + '...'
      : cleanText
    
    // テキストをチャンクに分割
    const textChunks = chunkText(truncatedText)
    
    if (textChunks.length === 0) {
      throw new Error('有効なテキストが抽出できませんでした')
    }
    
    return {
      url,
      texts: textChunks
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました'
    return {
      url,
      texts: [],
      error: errorMessage
    }
  }
}

// URLの妥当性をチェック
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

// 一般的なWebサイトのサンプルURL
export const SAMPLE_URLS = [
  'https://www.aozora.gr.jp/cards/000035/files/301_14912.html',
  'https://ja.wikipedia.org/wiki/日本文学',
  'https://www.gutenberg.org/files/74/74-0.txt'
]