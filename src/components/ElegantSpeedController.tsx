import { SpeedLevel, SpeedConfig } from '../types'
import { Card, CardContent } from './ui/card'

interface ElegantSpeedControllerProps {
  currentSpeed: SpeedLevel
  onSpeedChange: (speed: SpeedLevel) => void
}

const ELEGANT_SPEED_CONFIGS: SpeedConfig[] = [
  {
    level: 1,
    name: '静寂',
    description: '瞑想的な静けさ',
    gravity: 0.0005,
    spawnInterval: 8,
    minVelocity: 0.15
  },
  {
    level: 2,
    name: '微風',
    description: 'そよ風のように',
    gravity: 0.0008,
    spawnInterval: 6,
    minVelocity: 0.2
  },
  {
    level: 3,
    name: '調和',
    description: 'バランスの美',
    gravity: 0.001,
    spawnInterval: 4,
    minVelocity: 0.25
  },
  {
    level: 4,
    name: '躍動',
    description: '生命力あふれる',
    gravity: 0.0015,
    spawnInterval: 3,
    minVelocity: 0.3
  },
  {
    level: 5,
    name: '激流',
    description: '圧倒的な流れ',
    gravity: 0.002,
    spawnInterval: 2,
    minVelocity: 0.4
  }
]

const ElegantSpeedController = ({ currentSpeed, onSpeedChange }: ElegantSpeedControllerProps) => {
  const currentConfig = ELEGANT_SPEED_CONFIGS.find(config => config.level === currentSpeed) || ELEGANT_SPEED_CONFIGS[2]

  return (
    <Card className="w-full bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 border-slate-600/30 backdrop-blur-xl shadow-2xl">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-light text-white/95 tracking-wide">文字速度</h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-400/60 via-cyan-400/60 to-blue-400/60 mx-auto mt-2 rounded-full"></div>
            <div className="mt-3 space-y-1">
              <div className="text-xl font-light text-emerald-300">{currentConfig.name}</div>
              <div className="text-sm text-slate-300/70">{currentConfig.description}</div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2">
            {ELEGANT_SPEED_CONFIGS.map((config) => (
              <button
                key={config.level}
                onClick={() => onSpeedChange(config.level)}
                className={`
                  relative group transition-all duration-300 transform
                  ${currentSpeed === config.level
                    ? 'scale-110'
                    : 'hover:scale-105'
                  }
                `}
              >
                <div className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${currentSpeed === config.level
                    ? 'border-emerald-400 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 shadow-lg shadow-emerald-400/25'
                    : 'border-slate-500/40 bg-slate-800/20 hover:border-slate-400/60 hover:bg-slate-700/30'
                  }
                `}>
                  <span className={`
                    text-sm font-medium transition-colors duration-300
                    ${currentSpeed === config.level
                      ? 'text-emerald-300'
                      : 'text-slate-400 group-hover:text-slate-300'
                    }
                  `}>
                    {config.level}
                  </span>
                </div>
                
                {currentSpeed === config.level && (
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 blur-sm -z-10"></div>
                )}
                
                <div className={`
                  absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap transition-opacity duration-300
                  ${currentSpeed === config.level
                    ? 'opacity-100 text-emerald-300/80'
                    : 'opacity-0 group-hover:opacity-70 text-slate-400'
                  }
                `}>
                  {config.name}
                </div>
              </button>
            ))}
          </div>
          
          <div className="relative mt-8">
            <div className="flex justify-between text-xs text-slate-400/60">
              <span>静寂</span>
              <span>激流</span>
            </div>
            <div className="mt-2 h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400/60 to-cyan-400/60 rounded-full transition-all duration-500"
                style={{ width: `${(currentSpeed / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { ElegantSpeedController, ELEGANT_SPEED_CONFIGS }
export type { ElegantSpeedControllerProps }