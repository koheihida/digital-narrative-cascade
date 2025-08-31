import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { UrlFetchState } from '../types'

interface ElegantUrlFetcherProps {
  onUrlFetch: (url: string) => Promise<void>
  fetchState: UrlFetchState
  onReset: () => void
}

const ElegantUrlFetcher = ({ onUrlFetch, fetchState, onReset }: ElegantUrlFetcherProps) => {
  const [inputUrl, setInputUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputUrl.trim()) {
      await onUrlFetch(inputUrl.trim())
      setInputUrl('')
    }
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleReset = () => {
    setInputUrl('')
    onReset()
  }

  return (
    <Card className="w-full bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 border-slate-600/30 backdrop-blur-xl shadow-2xl">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-light text-white/95 tracking-wide">カスタムURL</h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-violet-400/60 via-purple-400/60 to-pink-400/60 mx-auto mt-2 rounded-full"></div>
            <div className="text-sm text-slate-300/70 mt-3">
              任意のWebページから文字を抽出
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="url"
                placeholder="https://example.com"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                disabled={fetchState.isLoading}
                className="
                  w-full px-4 py-3 bg-slate-800/40 border border-slate-600/30 rounded-xl 
                  text-white placeholder:text-slate-400/60 
                  focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20 focus:bg-slate-800/60
                  transition-all duration-300
                "
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!inputUrl.trim() || !isValidUrl(inputUrl.trim()) || fetchState.isLoading}
                className="
                  flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 
                  text-white font-medium rounded-xl transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg shadow-violet-500/25
                "
              >
                {fetchState.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    取得中...
                  </div>
                ) : '文字を取得'}
              </Button>
              
              {fetchState.url && (
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  className="
                    px-6 py-3 border border-slate-500/40 text-slate-300 rounded-xl
                    hover:border-slate-400/60 hover:bg-slate-700/30 hover:text-white
                    transition-all duration-300
                  "
                >
                  リセット
                </Button>
              )}
            </div>
          </form>

          {fetchState.isLoading && (
            <div className="flex items-center justify-center py-6">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-violet-400/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-pink-400/60 rounded-full animate-bounce"></div>
              </div>
              <span className="ml-3 text-sm text-white/60">ページを解析中...</span>
            </div>
          )}

          {fetchState.error && (
            <Alert className="bg-red-900/20 border border-red-500/30 rounded-xl">
              <AlertDescription className="text-red-300/90 text-sm">
                {fetchState.error}
              </AlertDescription>
            </Alert>
          )}

          {fetchState.url && !fetchState.error && !fetchState.isLoading && (
            <div className="bg-gradient-to-r from-emerald-900/20 via-green-900/20 to-emerald-900/20 border border-emerald-500/30 rounded-xl p-4">
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="font-medium text-emerald-300">取得完了</span>
                </div>
                <div className="text-emerald-200/70 truncate text-xs">{fetchState.url}</div>
                <div className="text-emerald-300/80">
                  文字数: {fetchState.texts.reduce((sum, text) => sum + text.length, 0).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ElegantUrlFetcher
export type { ElegantUrlFetcherProps }