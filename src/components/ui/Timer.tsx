import React, { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface TimerProps {
  durationMinutes: number
  onComplete?: () => void
  onTick?: (remainingSeconds: number) => void
  className?: string
}

export const Timer: React.FC<TimerProps> = ({
  durationMinutes,
  onComplete,
  onTick,
  className = ''
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60)

  useEffect(() => {
    if (remainingSeconds <= 0) {
      onComplete?.()
      return
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        const newValue = prev - 1
        onTick?.(newValue)
        return newValue
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [remainingSeconds, onComplete, onTick])

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const isLowTime = remainingSeconds < 60

  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock size={20} className={isLowTime ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'} />
      <span
        className={`text-lg font-mono font-semibold ${
          isLowTime
            ? 'text-red-500 animate-pulse'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {formatTime(minutes, seconds)}
      </span>
    </div>
  )
}

