import styled from 'styled-components'
import { Box, TwitterIcon, GithubIcon } from 'components'

const width = '256'

export default function TeamMember({ img, name, role, twitter, github, description }) {
  return (
    <Member width={width}>
      <Img src={img} loading='lazy' />
      <Name>{name}</Name>
      <Role>{role}</Role>
      <SocialMedia>
        { twitter &&
          <a href={`https://twitter.com/${twitter}`} target='_blank' rel='noreferrer'>
            <TwitterIcon />
          </a>
        }
        { github &&
          <a href={`https://github.com/${twitter}`} target='_blank' rel='noreferrer'>
            <GithubIcon />
          </a>
        }
      </SocialMedia>
      <Description>
        { description }
      </Description>
    </Member>
  )
}

const Member = styled(Box)`
  align-items: center;
  justify-content: center;
  width: ${width}px;
  padding: 16px;
`

const Img = styled.img`
  border-radius: 50%;
  height: ${width*0.8}px;
`

const Name = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`

const Role = styled.p`
  color: ${props => props.theme.global.colors.brandMiddle};
  text-align: center;
  margin: 4px 0;
  height: 32px;
`

const SocialMedia = styled(Box).attrs({
  direction: 'row',
  gap: 'small',
  align: 'center',
  justify: 'center',
  margin: { vertical: 'small' }
})`
  svg {
    transition: fill var(--transition-glow-ms);  
  }
  svg:hover {
    fill: ${props => props.theme.global.colors.brandMiddle};
  }
`

const Description = styled.p`
  height: 200px;
  // text-align: justify;
`
