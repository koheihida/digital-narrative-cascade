import { SpeedLevel, SpeedConfig } from '../types'

interface CompactSpeedControllerProps {
  currentSpeed: SpeedLevel
  onSpeedChange: (speed: SpeedLevel) => void
}

const COMPACT_SPEED_CONFIGS: SpeedConfig[] = [
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

const CompactSpeedController = ({ currentSpeed, onSpeedChange }: CompactSpeedControllerProps) => {
  const currentConfig = COMPACT_SPEED_CONFIGS.find(config => config.level === currentSpeed) || COMPACT_SPEED_CONFIGS[2]

  return (
    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-lg p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-white/80">速度</h3>
        <span className="text-xs text-white/60">{currentConfig.name}</span>
      </div>
      
      <div className="flex justify-between space-x-1">
        {COMPACT_SPEED_CONFIGS.map((config) => (
          <button
            key={config.level}
            onClick={() => onSpeedChange(config.level)}
            className={`
              w-7 h-7 rounded text-xs font-medium transition-all duration-200 
              ${currentSpeed === config.level
                ? 'bg-white/20 text-white border border-white/30'
                : 'text-white/60 hover:text-white/80 hover:bg-white/10'
              }
            `}
          >
            {config.level}
          </button>
        ))}
      </div>
      
      <div className="mt-2 h-0.5 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white/50 rounded-full transition-all duration-300"
          style={{ width: `${(currentSpeed / 5) * 100}%` }}
        />
      </div>
    </div>
  )
}

export { CompactSpeedController, COMPACT_SPEED_CONFIGS }
export type { CompactSpeedControllerProps }