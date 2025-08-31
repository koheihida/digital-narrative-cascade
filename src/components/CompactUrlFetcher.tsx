import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { UrlFetchState } from '../types'

interface CompactUrlFetcherProps {
  onUrlFetch: (url: string) => Promise<void>
  fetchState: UrlFetchState
  onReset: () => void
}

const CompactUrlFetcher = ({ onUrlFetch, fetchState, onReset }: CompactUrlFetcherProps) => {
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
    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-white/80">URL</h3>
        {fetchState.isLoading && <div className="w-3 h-3 border border-white/20 border-t-white/60 rounded-full animate-spin"></div>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="url"
          placeholder="https://example.com"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          disabled={fetchState.isLoading}
          className="
            h-8 px-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/40 text-xs
            focus:border-white/40 focus:bg-white/15 transition-all duration-200
          "
        />
        
        <div className="flex gap-1">
          <Button
            type="submit"
            disabled={!inputUrl.trim() || !isValidUrl(inputUrl.trim()) || fetchState.isLoading}
            className="
              flex-1 h-7 px-2 bg-white/15 hover:bg-white/25 text-white text-xs rounded
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
            "
          >
            {fetchState.isLoading ? '取得中...' : '取得'}
          </Button>
          
          {fetchState.url && (
            <Button
              type="button"
              onClick={handleReset}
              className="
                px-2 h-7 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs rounded
                transition-all duration-200
              "
            >
              ×
            </Button>
          )}
        </div>
      </form>

      {fetchState.error && (
        <div className="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-300/90">
          {fetchState.error}
        </div>
      )}

      {fetchState.url && !fetchState.error && !fetchState.isLoading && (
        <div className="mt-2 p-2 bg-green-900/30 border border-green-500/30 rounded">
          <div className="text-xs text-green-300/90 truncate">{fetchState.url}</div>
          <div className="text-xs text-green-400/70 mt-1">
            {fetchState.texts.reduce((sum, text) => sum + text.length, 0).toLocaleString()}文字
          </div>
        </div>
      )}
    </div>
  )
}

export default CompactUrlFetcher
export type { CompactUrlFetcherProps }