import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useLocation } from 'wouter'
import styled from 'styled-components'
import Typist from 'react-typist'
import { Box, ActionButton, SummonIcon, Delay } from 'components'
import Section from './Section'

const universe = <em>Tezmir</em>
const high = <em>Nobility</em>
const land = <em>Pax Timor</em>
const lord = <em>Lord Emperor</em>
const low = <em>Raf</em>

const initialStep = 1

export default function Lore() {
  const [ step, setStep ] = useState(initialStep)
  const [ , setLocation ] = useLocation()
  const { ref, inView } = useInView({ threshold: 0.5 })

  useEffect(() => {
    if (inView && step === initialStep) {
      setStep(step => step+1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  const onTypingDone = index => () => {
    if (index === paragraphs.length - 1) {
      setStep(step => step + 1)
    }
  }

  return (
    <Section background='brand' pad='large' justify='center' align='center' ref={ref}>
      <StoryWrapper>
        <Title>The Land of {land}</Title>
        <Content>
          { paragraphs.map((paragraph, index) => {
              return (
                index === step 
                ? <Typist 
                    key={index}
                    className='Paragraph' 
                    avgTypingDelay={30} 
                    onTypingDone={onTypingDone(index)}
                    >
                    { paragraph }
                  </Typist>
                : step > index
                ? paragraph
                : null
              )
            })
          }
          { step < paragraphs.length &&
            <FadeOutBox enabled={step === paragraphs.length - 1}>
              <StoryButton 
                label='Continue...'
                onClick={() => setStep(step => step+1)}
              />
            </FadeOutBox>
          }
          { step === paragraphs.length &&
            <Delay contentWaiting={<StoryButton visibility='hidden' label='placeholder' />}>
              <FadeInBox>
                <StoryButton 
                  icon={<SummonIcon />}
                  label='Summon a Hero'
                  glow={true}
                  onClick={() => setLocation('/heroes/summon')}
                />
              </FadeInBox>
            </Delay>
          }
        </Content>
      </StoryWrapper>
    </Section>
  )
}

const StoryWrapper = styled.div`
  width: 100%;
  max-width: 1455px;
`

const Title = styled.span`
  font-family: 'ghostclan';
  font-size: 3rem;
  text-transform: uppercase;
  margin-bottom: 16px;
  margin-left: 16px;
  color: var(--color-secondary);
  line-height: 40px;
  em {
    color: ${props => props.theme.global.colors.brandMiddle};
    font-style: initial;
  }
  @media (max-width: 768px) {
    em {
      display: block;
      text-align: end;
    }
  }
  @media (max-width: 350px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`

const Content = styled.div`
  margin-top: 32px;
  padding: 32px 24px;
  border-radius: 8px;
  color: ${props => props.theme.global.colors.brand};
  background: var(--color-secondary);
  /*
  * Trick to keep the cursor visible while typing, it seems to 
  * be a bug in react-typist. If the inner element has "display: block"
  * the cursor is moved underneath the text.
  */
  .Typist {
    .Paragraph {
      display: initial;
    }
  }
  .Paragraph {
    display: block;
    margin-top: 32px;
    &:first-child {
      margin-top: 0;
    }
  }

  @media (min-width: 768px) {
    padding: 48px;
  }
`

const Text = styled.span.attrs({ className: 'Paragraph'})`
  font-family: zig;
  font-size: 1rem;
  line-height: 1.4;
  em {
    color: var(--color-accent);
    font-style: initial;
  }
`

const StoryButton = styled(ActionButton)`
  margin-top: 2em;
  padding: 0.5em 1em;
  font-family: 'ghostclan';
  font-size: 1.2rem;
  background: ${props => props.theme.global.colors.brandDark};
  box-shadow: ${props => props.glow ? `-0px 0px 16px 6px rgba(0,255,224,0.75)` : 'inherit'};
  transition: box-shadow var(--transition-glow-ms);
  visibility: ${props => props.visibility || 'visible'};
  &:hover {
    box-shadow: ${props => props.glow ? `-0px 0px 16px 8px rgba(0,255,224,0.75)` : 'inherit'};
  }
`

const FadeInBox = styled(Box).attrs({ 
  margin: 'medium',
  justify: 'center',
  animation: { 
    type: 'fadeIn', 
    duration: 3000,
  },
})`
  width: fit-content;
  padding: 0;
  margin: 0;
`

const FadeOutBoxWrap = styled(Box).attrs({ 
  margin: 'medium',
  justify: 'center',
  animation: { 
    type: 'fadeOut', 
    duration: 4000,
  },
})`
  width: fit-content;
  padding: 0;
  margin: 0;
`

function FadeOutBox({ enabled, children }) {
  return (
    enabled 
      ? <FadeOutBoxWrap>{children}</FadeOutBoxWrap> 
      : children
  )
}

const paragraphs = [
  <Text key="a">
    The land of {land} has been ruled by the {lord} for a thousand epochs. It is an orderly land, where everyone knows their place and follows the {lord}<em>s</em> will.
  </Text>,
  <Text key="b">
    The {lord} himself is seen as a diety.
  </Text>,
  <Text key="c">
    He has divided his subjects into two classes; the {low} and the {high}.
    The {low} live hard lives. They are forced to work without compensation, barely scraping by on what they can grow on the side for themselves. The {low} all dream about becoming part of the {high}, finally ending their struggles, being lifted up from the slums to a life of comfort.
  </Text>,
  <Text key="d">
    The {high} run the empire. They are administrators and managers of the {low}. They live comfortable lives, attending balls, engaging in philosophy, economics and politics.
  </Text>,
  <Text key="g">
    Both the {low} and the {high} are infirtile, which is one way the {lord} maintains control over the populous.
  </Text>,
  <Text key="h">
    When The {lord} require new subjects, he summons them from the {universe}. His strange ability to summon souls from all across the {universe} universe is the reason why so many strange and different creatures inhabit {land}.
  </Text>,
  <Text key="e">
    Everyone in {land} is born of the {low}. The only way to reach the {high} class is to enlist as a «Hero» and become «unchained». Only Heroes with 100 victories in battle are considered «unchained» and worthy of becoming part of the {high}.
  </Text>,
  <Text key="f">
    Lately there have been whispers about a secret society of both {high} and {low} working together to overthrow the {lord} and end his tyrannical rule. However, hardly anyone believes such rumors….
  </Text>
]
