import styled from 'styled-components'
import { Tip } from 'components'
import CrownGold from './images/BadgeCrownGold.webp'
import CrownSilver from './images/BadgeCrownSilver.webp'
import CrownBronze from './images/BadgeCrownBronze.webp'
import FireGold from './images/BadgeFireGold.webp'
import FireSilver from './images/BadgeFireSilver.webp'
import FireBronze from './images/BadgeFireBronze.webp'
import StarGold from './images/BadgeStarGold.webp'
import StarSilver from './images/BadgeStarSilver.webp'
import StarBronze from './images/BadgeStarBronze.webp'

export default function Badges({ badges }) {
  return (
    <BadgeList>
      { badges.mostWins === 1 &&
        <Tip text='Gold in Most Wins'>
          <img src={CrownGold} alt='CrownGold' />
        </Tip>
      }
      { badges.mostWins === 2 &&
        <Tip text='Silver in Most Wins'>
          <img src={CrownSilver} alt='CrownSilver' />
        </Tip>
      }
      { badges.mostWins === 3 &&
        <Tip text='Bronze in Most Wins'>
          <img src={CrownBronze} alt='CrownBronze' />
        </Tip>
      }
      { badges.mostExperience === 1 &&
        <Tip text='Gold in Most XP'>
          <img src={StarGold} alt='StarGold' />
        </Tip>
      }
      { badges.mostExperience === 2 &&
        <Tip text='Silver in Most XP'>
          <img src={StarSilver} alt='StarSilver' />
        </Tip>
      }
      { badges.mostExperience === 3 &&
        <Tip text='Bronze in Most XP'>
          <img src={StarBronze} alt='StarBronze' />
        </Tip>
      }
      { badges.mostWinStreaks === 1 &&
        <Tip text='Gold in Winning Streaks'>
          <img src={FireGold} alt='FireGold' />
        </Tip>
      }
      { badges.mostWinStreaks === 2 &&
        <Tip text='Silver in Winning Streaks'>
          <img src={FireSilver} alt='FireSilver' />
        </Tip>
      }
      { badges.mostWinStreaks === 3 &&
        <Tip text='Bronze in Winning Streaks'>
          <img src={FireBronze} alt='FireBronze' />
        </Tip>
      }
    </BadgeList>
  )
}

const BadgeList = styled.div`
  position: absolute;
  right: 3%;
  top: 5%;
  width: 13%;
  height: 50%;
  display: flex;
  flex-direction: column;
  gap: 2%;
  img {
    width: 100%;
    border: 2px solid black;
    border-radius: 50%;
  }
`
