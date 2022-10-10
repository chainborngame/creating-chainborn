import { useCallback } from 'react'
import { Text, Clock } from 'components'

export default function CoolDownCounter({ secondsLeft, onZeroTick }) {

  const seconds = Math.floor(secondsLeft % 60);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const hours = Math.floor((secondsLeft % (3600 * 24)) / 3600);
  const days = Math.floor(secondsLeft / (3600 * 24));

  const onChange = useCallback((time) => {
    if (time === 'T0:0:0') {
      onZeroTick()
    }
  }, [onZeroTick])

  return (
    <>
      <Text color='status-error'>
        { days > 0 && `${days} days` }
      </Text>
      <Clock 
        type='digital'
        run='backward'
        color='status-error'
        time={`22T${pad(hours)}:${pad(minutes)}:${pad(seconds)}`} 
        onChange={onChange}
      />
    </>
  )
}

function pad(number) {
  return String(number).padStart(2, '0')
}