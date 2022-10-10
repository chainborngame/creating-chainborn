import { useState } from 'react'
import Section from './Section'
import styled from 'styled-components'
import green from 'images/background-home-banner-green.webp'
import yellow from 'images/background-home-banner-yellow.webp'
import red from 'images/background-home-banner-red.webp'
import logoBig from 'images/logo-big-color.webp'

const images = [green, yellow, red]

export default function Banner() {
  const [ index, setIndex ] = useState(Math.round(Math.random()*10%2))
  return (
    <Section image={images[index]} height='500px' align='center' onClick={() => setIndex((index+1) % images.length )}>
      <Logo />
    </Section>
  )
}

const Logo = styled.img.attrs({
  src: logoBig,
})`
  margin-top: 128px;
  width: 476px;
  user-select: none;
  @media (max-width: 1200px) {
    width: 376px;
  }
  @media (max-width: 900px) {
    width: 276px;
  }
`

