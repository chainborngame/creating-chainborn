import { css } from 'styled-components'

const ReactIconStyled = css`
  color: ${props => props.theme.global.colors[props.color] || props.color || 'inherit'};
  width: ${props => props.theme.icon.size[props.size] || props.size || props.theme.icon.size['medium']};
  height: ${props => props.theme.icon.size[props.size] || props.size || props.theme.icon.size['medium']};
`

export default ReactIconStyled