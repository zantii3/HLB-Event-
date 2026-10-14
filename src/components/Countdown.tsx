import { useEffect, useState } from 'react'

type CountdownProps = {
  targetDate: string
}

type TimeRemaining = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeRemaining(targetDate: string): TimeRemaining {
  const milliseconds = Math.max(0, new Date(targetDate).getTime() - Date.now())
  const totalSeconds = Math.floor(milliseconds / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function Countdown({ targetDate }: CountdownProps) {
  const [time, setTime] = useState(() => getTimeRemaining(targetDate))

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getTimeRemaining(targetDate)), 1000)
    return () => window.clearInterval(timer)
  }, [targetDate])

  return (
    <div aria-label="Countdown to HLB Event" className="event-countdown" role="timer">
      {Object.entries(time).map(([unit, value]) => (
        <div key={unit} className="countdown-unit">
          <div className="countdown-value">{String(value).padStart(2, '0')}</div>
          <div className="countdown-label">{unit}</div>
        </div>
      ))}
    </div>
  )
}

export default Countdown