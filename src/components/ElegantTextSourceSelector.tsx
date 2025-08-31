import { TextSource, TextSourceConfig } from '../types'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Card, CardContent } from './ui/card'

interface ElegantTextSourceSelectorProps {
  currentSource: TextSource
  onSourceChange: (source: TextSource) => void
  isLoading?: boolean
}

const ELEGANT_TEXT_SOURCES: TextSourceConfig[] = [
  {
    id: 'dazai',
    name: '太宰治',
    description: '人間失格、津軽など名作文学',
    texts: []
  },
  {
    id: 'hannya',
    name: '般若心経',
    description: '古典仏教経典の美しい文字',
    texts: []
    },
  {
    id: 'custom',
    name: 'Custom',
    description: '任意のWebページから抽出',
    texts: []
  }
]

const ElegantTextSourceSelector = ({ currentSource, onSourceChange, isLoading }: ElegantTextSourceSelectorProps) => {
  return (
    <Card className="w-full bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 border-slate-600/30 backdrop-blur-xl shadow-2xl">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-light text-white/95 tracking-wide">テキストソース</h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400/60 via-purple-400/60 to-pink-400/60 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <RadioGroup
            value={currentSource}
            onValueChange={(value: TextSource) => onSourceChange(value)}
            className="space-y-3"
            disabled={isLoading}
          >
            {ELEGANT_TEXT_SOURCES.map((source) => (
              <div key={source.id} className="group">
                <Label
                  htmlFor={source.id}
                  className={`
                    flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300
                    ${currentSource === source.id 
                      ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-pink-500/20 border-2 border-blue-400/40 shadow-lg' 
                      : 'bg-slate-800/20 border border-slate-600/20 hover:bg-slate-700/30 hover:border-slate-500/30'
                    }
                  `}
                >
                  <RadioGroupItem
                    value={source.id}
                    id={source.id}
                    className={`
                      mt-1 transition-all duration-300
                      ${currentSource === source.id 
                        ? 'border-blue-400 text-blue-400' 
                        : 'border-slate-400/50 text-slate-400/50'
                      }
                    `}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`
                      font-medium transition-colors duration-300
                      ${currentSource === source.id 
                        ? 'text-blue-100' 
                        : 'text-white/85 group-hover:text-white/95'
                      }
                    `}>
                      {source.name}
                    </div>
                    <div className={`
                      text-sm mt-1 transition-colors duration-300
                      ${currentSource === source.id 
                        ? 'text-blue-200/80' 
                        : 'text-slate-300/60 group-hover:text-slate-200/70'
                      }
                    `}>
                      {source.description}
                    </div>
                  </div>
                  {currentSource === source.id && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-purple-400/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-pink-400/60 rounded-full animate-bounce"></div>
              </div>
              <span className="ml-3 text-sm text-white/60">読み込み中...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { ElegantTextSourceSelector, ELEGANT_TEXT_SOURCES }
export type { ElegantTextSourceSelectorProps }