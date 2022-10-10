import { useMemo, useCallback } from 'react'
import { useLocation } from 'wouter'
import { Tabs } from 'components'

export default function TabsRoute({ children, ...props }) {
  
  const [ location, setLocation ] = useLocation()

  const onActive = useCallback(index => {
    setLocation(children[index].props.route)
  }, [children, setLocation])

  const activeIndex = useMemo(() => {
    for (const index in children) {
      if (children[index]?.props?.route === location) {
        return parseInt(index)
      }
    }
    return 0
  }, [location, children])

  return (
    <Tabs activeIndex={activeIndex} onActive={onActive} {...props}>
      { children }
    </Tabs>
  )
}