import { useState, useEffect } from 'react'
import { Page, Box, ActionButton, LinkIcon, Tip } from 'components'
import { useRecoilState } from 'recoil'
import { validateAddress } from '@taquito/utils'
import { 
  getIpfsLink,
  truncateAddress, 
  getIdentityImage 
} from 'shared/utils'
import { getTezIDProfile } from 'shared/api'
import { 
  walletState,
  signatureState,
  tezidProfileAtom, 
  firebaseTokenState,
} from 'shared/state'
import {
  disconnectWallet,
  fetchAddressFromTezosDomain
} from 'shared/wallet'
import battleBackgroundImage from 'images/background-battle.webp'
import HeroList from './HeroList'
import './index.css'

export default function Player({ params: { address }}) {
  const [ _address, setAddress ] = useState(address)
  const [ image, setImage ] = useState(getIdentityImage(address).src)
  const [ playerName, setPlayerName ] = useState('Unknown')
  const [ description, setDescription ] = useState('')
  const [ wallet, setWallet ] = useRecoilState(walletState)
  const [ , setProfile ] = useRecoilState(tezidProfileAtom)
  const [ , setSignature ] = useRecoilState(signatureState)
  const [ ,setFirebaseToken ] = useRecoilState(firebaseTokenState)

  useEffect(() => {
    (async () => {
      if (!validateAddress(_address)) {
        const __address = await fetchAddressFromTezosDomain(`${_address}.tez`)
        if (!validateAddress(__address)) return
        setAddress(__address) 
      }
      setPlayerName(truncateAddress(_address))
      const profile = await getTezIDProfile(_address)
      if (profile.name) setPlayerName(profile.name)
      if (profile.avatar) setImage(getIpfsLink(profile.avatar))
      if (profile.description) setDescription(profile.description)
    })()
  }, [_address])

  const onDisconnectWallet = async () => {
    await disconnectWallet()
    setWallet(null)
    setProfile(null)
    setSignature({})
    setFirebaseToken(null)
  }

  const imageStyle = { backgroundImage: `url(${image})`, backgroundSize: 'cover' }
 
  return (
    <Page className='Player' direction='column' align='start' minHeight='220vh' image={battleBackgroundImage}>
      <Box className='inner' direction='row'>
        <Box className='imageAndName'>
          <Box className='image' style={imageStyle} margin='small'></Box>
          <Box className='name' pad='small' background='black' color='white' margin='small' align='center'>{playerName}</Box>
        </Box>
        <Box className='meta' pad='medium' margin='small' color='brand'>
          <Box direction='row' justify='between'>
            <Box className='description' color='brand'>{description}</Box>
            { wallet?.address === _address &&
            <Box align='end'>
              <Tip text='TezID Profile'>
                <a href={`https://tezid.net/#/${_address}`} target='_blank' rel='noreferrer'><LinkIcon size='22px' /></a>
              </Tip>
            </Box>
            }
          </Box>
          <Box className='playerstats'></Box>
          <Box>
            { wallet?.address === _address &&
            <Box align='end'>
              <ActionButton 
                label='Disconnect'
                onClick={onDisconnectWallet}
              />
            </Box>
            }
          </Box>
        </Box>
      </Box>
      <Box margin='small'>
        <HeroList owner={_address} />
      </Box>
    </Page>
  )
}

