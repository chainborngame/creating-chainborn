import { useState, useEffect } from 'react'

/*
* Wrapper to delay the rendering of its children
*/
export default function Delay({ delay=500, contentWaiting=null, children }) {
  const [ isShown, setIsShown ] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true)
    }, delay)
    return () => {
      clearTimeout(timer)
    }
  }, [delay])

  return isShown ? children : contentWaiting
}
