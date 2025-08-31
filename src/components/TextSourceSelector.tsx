import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { TextSource, TextSourceConfig } from '../types'

interface TextSourceSelectorProps {
  currentSource: TextSource
  onSourceChange: (source: TextSource) => void
  isLoading?: boolean
}

const TEXT_SOURCES: TextSourceConfig[] = [
  {
    id: 'dazai',
    name: '太宰治',
    description: '人間失格、津軽など',
    texts: [] // Will be populated from API
  },
  {
    id: 'hannya',
    name: '般若心経',
    description: '仏教の経典',
    texts: [
      '観自在菩薩行深般若波羅蜜多時照見五蘊皆空度一切苦厄舎利子色不異空空不異色色即是空空即是色受想行識亦復如是舎利子是諸法空相不生不滅不垢不浄不増不減是故空中無色無受想行識無眼耳鼻舌身意無色声香味触法無眼界乃至無意識界無無明亦無無明尽乃至無老死亦無老死尽無苦集滅道無智亦無得以無所得故菩提薩埵依般若波羅蜜多故心無罣礙無罣礙故無有恐怖遠離一切顛倒夢想究竟涅槃三世諸仏依般若波羅蜜多故得阿耨多羅三藐三菩提故知般若波羅蜜多是大神咒是大明咒是無上咒是無等等咒能除一切苦真実不虚故説般若波羅蜜多咒即説咒曰羯諦羯諦波羅羯諦波羅僧羯諦菩提薩婆訶般若心経'
    ]
  },
  {
    id: 'custom',
    name: 'カスタムURL',
    description: '任意のWebページから取得',
    texts: [] // Will be populated from URL fetch
  }
]

const TextSourceSelector = ({ currentSource, onSourceChange, isLoading }: TextSourceSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentSource}
        onValueChange={(value: TextSource) => onSourceChange(value)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full px-4 py-3 bg-black/70 text-white border-white/20 hover:bg-black/80 backdrop-blur-sm rounded-lg font-medium transition-all duration-200 shadow-lg">
          <SelectValue placeholder="テキスト選択" />
        </SelectTrigger>
        <SelectContent className="bg-black/95 text-white border-white/20 backdrop-blur-lg">
          {TEXT_SOURCES.map((source) => (
            <SelectItem 
              key={source.id} 
              value={source.id}
              className="hover:bg-white/10 focus:bg-white/10"
            >
              <div className="flex flex-col">
                <span className="font-medium">{source.name}</span>
                <span className="text-xs text-white/60">{source.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isLoading && (
        <div className="px-3 py-1.5 bg-black/70 text-white rounded text-xs backdrop-blur-sm border border-white/20">
          読み込み中...
        </div>
      )}
    </div>
  )
}

export { TextSourceSelector, TEXT_SOURCES }
export type { TextSourceSelectorProps }