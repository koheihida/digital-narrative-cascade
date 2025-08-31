import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { UrlFetchState } from '../types'

interface UrlTextFetcherProps {
  onUrlFetch: (url: string) => Promise<void>
  fetchState: UrlFetchState
  onReset: () => void
}

const UrlTextFetcher = ({ onUrlFetch, fetchState, onReset }: UrlTextFetcherProps) => {
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
    <Card className="w-full bg-black/70 border-white/20 backdrop-blur-sm shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-1">カスタムURL</h3>
            <div className="text-xs text-white/70">
              任意のWebページから文字を取得
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              type="url"
              placeholder="https://example.com"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              disabled={fetchState.isLoading}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
            />
            
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={!inputUrl.trim() || !isValidUrl(inputUrl.trim()) || fetchState.isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                {fetchState.isLoading ? '取得中...' : '文字を取得'}
              </Button>
              
              {fetchState.url && (
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  リセット
                </Button>
              )}
            </div>
          </form>

          {fetchState.isLoading && (
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
              <span className="ml-2 text-xs text-white/70">ページを解析中...</span>
            </div>
          )}

          {fetchState.error && (
            <Alert className="bg-red-900/50 border-red-500/50">
              <AlertDescription className="text-red-200 text-xs">
                {fetchState.error}
              </AlertDescription>
            </Alert>
          )}

          {fetchState.url && !fetchState.error && !fetchState.isLoading && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-2">
              <div className="text-xs text-green-200">
                <div className="font-medium">取得完了</div>
                <div className="truncate mt-1 opacity-75">{fetchState.url}</div>
                <div className="mt-1">
                  文字数: {fetchState.texts.reduce((sum, text) => sum + text.length, 0)}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default UrlTextFetcher
export type { UrlTextFetcherProps }