import { useState } from 'react'
import { Slider } from './ui/slider'
import { Card, CardContent } from './ui/card'
import { SpeedLevel, SpeedConfig } from '../types'

interface SpeedControllerProps {
  currentSpeed: SpeedLevel
  onSpeedChange: (speed: SpeedLevel) => void
}

const SPEED_CONFIGS: SpeedConfig[] = [
  {
    level: 1,
    name: '非常に遅い',
    description: 'ゆったりとした流れ',
    gravity: 0.0005,
    spawnInterval: 8,
    minVelocity: 0.15
  },
  {
    level: 2,
    name: '遅い',
    description: 'のんびりとした流れ',
    gravity: 0.0008,
    spawnInterval: 6,
    minVelocity: 0.2
  },
  {
    level: 3,
    name: '標準',
    description: 'バランスの良い流れ',
    gravity: 0.001,
    spawnInterval: 4,
    minVelocity: 0.25
  },
  {
    level: 4,
    name: '速い',
    description: '活発な流れ',
    gravity: 0.0015,
    spawnInterval: 3,
    minVelocity: 0.3
  },
  {
    level: 5,
    name: '非常に速い',
    description: '激流のような流れ',
    gravity: 0.002,
    spawnInterval: 2,
    minVelocity: 0.4
  }
]

const SpeedController = ({ currentSpeed, onSpeedChange }: SpeedControllerProps) => {
  const currentConfig = SPEED_CONFIGS.find(config => config.level === currentSpeed) || SPEED_CONFIGS[2]

  const handleSliderChange = (value: number[]) => {
    const newSpeed = value[0] as SpeedLevel
    onSpeedChange(newSpeed)
  }

  return (
    <Card className="w-full bg-black/70 border-white/20 backdrop-blur-sm shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-sm font-medium text-white mb-1">文字速度調整</h3>
            <div className="text-xs text-white/70">
              {currentConfig.name} - {currentConfig.description}
            </div>
          </div>
          
          <div className="px-2">
            <Slider
              value={[currentSpeed]}
              onValueChange={handleSliderChange}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-between text-xs text-white/50 px-1">
            <span>遅い</span>
            <span>速い</span>
          </div>
          
          <div className="flex justify-center space-x-1 mt-2">
            {SPEED_CONFIGS.map((config) => (
              <button
                key={config.level}
                onClick={() => onSpeedChange(config.level)}
                className={`w-6 h-6 rounded-full text-xs transition-all duration-200 ${
                  currentSpeed === config.level
                    ? 'bg-blue-500 text-white shadow-lg scale-110'
                    : 'bg-white/20 text-white/60 hover:bg-white/30'
                }`}
              >
                {config.level}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { SpeedController, SPEED_CONFIGS }
export type { SpeedControllerProps }