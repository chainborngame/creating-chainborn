import { useState, useCallback } from 'react'
import { Box } from 'components'

export default function Img({ 
  src, 
  size, 
  height,
  width, 
  Component, 
  ComponentProps,
  ComponentLoader, 
  ComponentError, 
  isLoading, 
  isError,
  ...props
}) {

  const [ isLoadingImg, setIsLoadingImg] = useState(true)
  const onLoad = useCallback(() => setIsLoadingImg(false), [])

  return (
    <Box {...props}>
      { isLoading || isLoadingImg
          ? <ComponentLoader size={size} width={width} height={height} /> :
        isError 
          ? <ComponentError  size={size} width={width} height={height} /> : 
        null
      }
      { !isError && 
        <Component
          src={src} 
          alt='img' 
          height={`${size || height}px`}
          width={`${size || height}px`}
          style={isLoadingImg ? styleLoading : null}
          isLoading={isLoadingImg}
          onLoad={onLoad}
          {...ComponentProps}
        />
      }
    </Box>
  )
}

const styleLoading = { display: 'none' }