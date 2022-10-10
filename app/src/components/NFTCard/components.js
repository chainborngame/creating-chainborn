import styled from 'styled-components'
import { Box } from 'grommet'

export const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 300px;
  width: 210px;
  border: 1px solid var(--color-secondary);
  border-radius: 3px;
  cursor: pointer;
  background: #222;
  box-shadow: 0 1px 2px rgba(0,0,0,0.15);
  transition: all var(--transition-move-ms) ease-in-out;
  &:hover {
    transform: translateY(-6px);
  }
`

export const CardImage = styled.div`
  display: flex;
  justify-content: center;
  height: 70%;
  background-color: #222;
`

export const CardImg = styled.img`
  height: 100%;
  width: 208px;
`

export const CardText = styled.div`
  height: 30%;
  margin: 8px 0px;
  padding: 8px;
  border: 1px solid #222;
  background-color: #222;
  color: var(--color-accent);
  overflow: hidden;
`

export const CardName = styled.div`
  margin-bottom: 8px;
`

export const CardDescription = styled.div`
  font-size: 12px;
`
