import { TextSource, TextSourceConfig } from '../types'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'

interface CompactTextSourceSelectorProps {
  currentSource: TextSource
  onSourceChange: (source: TextSource) => void
  isLoading?: boolean
}

const COMPACT_TEXT_SOURCES: TextSourceConfig[] = [
  {
    id: 'dazai',
    name: '太宰治',
    description: '文学作品',
    texts: []
  },
  {
    id: 'hannya',
    name: '般若心経',
    description: '仏教経典',
    texts: ['観自在菩薩行深般若波羅蜜多時照見五蘊皆空度一切苦厄舎利子色不異空空不異色色即是空空即是色受想行識亦復如是舎利子是諸法空相不生不滅不垢不浄不増不減是故空中無色無受想行識無眼耳鼻舌身意無色声香味触法無眼界乃至無意識界無無明亦無無明尽乃至無老死亦無老死尽無苦集滅道無智亦無得以無所得故菩提薩埵依般若波羅蜜多故心無罣礙無罣礙故無有恐怖遠離一切顛倒夢想究竟涅槃三世諸仏依般若波羅蜜多故得阿耨多羅三藐三菩提故知般若波羅蜜多是大神咒是大明咒是無上咒是無等等咒能除一切苦真実不虚故説般若波羅蜜多咒即説咒曰羯諦羯諦波羅羯諦波羅僧羯諦菩提薩婆訶般若心経']
  },
  {
    id: 'custom',
    name: 'カスタム',
    description: 'URL取得',
    texts: []
  }
]

const CompactTextSourceSelector = ({ currentSource, onSourceChange, isLoading }: CompactTextSourceSelectorProps) => {
  return (
    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-white/80">テキスト</h3>
        {isLoading && <div className="w-3 h-3 border border-white/20 border-t-white/60 rounded-full animate-spin"></div>}
      </div>
      
      <RadioGroup
        value={currentSource}
        onValueChange={(value: TextSource) => onSourceChange(value)}
        className="space-y-2"
        disabled={isLoading}
      >
        {COMPACT_TEXT_SOURCES.map((source) => (
          <Label
            key={source.id}
            htmlFor={source.id}
            className={`
              flex items-center space-x-2 p-2 rounded cursor-pointer transition-all duration-200 text-sm
              ${currentSource === source.id 
                ? 'bg-white/10 text-white border border-white/20' 
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
              }
            `}
          >
            <RadioGroupItem
              value={source.id}
              id={source.id}
              className={`w-3 h-3 ${currentSource === source.id ? 'border-white text-white' : 'border-white/40'}`}
            />
            <div className="flex-1 min-w-0">
              <span className="font-medium">{source.name}</span>
              <span className="text-xs opacity-60 ml-1">({source.description})</span>
            </div>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}

export { CompactTextSourceSelector, COMPACT_TEXT_SOURCES }
export type { CompactTextSourceSelectorProps }