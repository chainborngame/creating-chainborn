import { useState, useEffect } from 'react'
import Box from './Box'
import Header from './Header'

export default function Layout({ children }) {
  const [ showSidebar, setShowSidebar ] = useState(false)
  const [ isScrolling, setIsScrolling ] = useState(false)

  const onScroll = (event) => {
    setIsScrolling(window.scrollY > 0)
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <Box>
      <Header 
        withBoxShadow={isScrolling} 
        onNotificationsClick={() => setShowSidebar(!showSidebar)} 
      />
      <div>
        { children }
      </div>
    </Box>
  )
}
