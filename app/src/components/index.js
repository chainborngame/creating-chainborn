import styled from 'styled-components'
import ReactIconStyled from './ReactIconStyled'
import { 
  GiTwoCoins, 
  GiCrestedHelmet,
  GiFlyingFlag,
  GiCrossedSwords,
  GiBattleMech,
  GiUpgrade,
  GiPointySword,
  GiStrong,
  GiNightSleep,
} from 'react-icons/gi'
import {
  BiFace,
  BiLinkExternal
} from 'react-icons/bi'
import {
  BsFillTrophyFill
} from 'react-icons/bs'
import {
  SiDatabricks
} from 'react-icons/si'
import { 
  FaDiscord,
  FaSkullCrossbones
} from 'react-icons/fa'
import {
  MdOutlineHealthAndSafety
} from 'react-icons/md'

export const LootIcon = styled(GiTwoCoins)`${ReactIconStyled}`
export const HeroIcon = styled(GiCrestedHelmet)`${ReactIconStyled}`
export const PlayerIcon = styled(BiFace)`${ReactIconStyled}`
export const ChallengeIcon = styled(GiFlyingFlag)`${ReactIconStyled}`
export const BattleIcon = styled(GiCrossedSwords)`${ReactIconStyled}`
export const SummonIcon = styled(GiBattleMech)`${ReactIconStyled}`
export const StrengthIcon = styled(GiStrong)`${ReactIconStyled}`
export const HealthIcon = styled(MdOutlineHealthAndSafety)`${ReactIconStyled}`
export const ExperienceIcon = styled(GiUpgrade)`${ReactIconStyled}`
export const NotBattleReadyIcon = styled(GiNightSleep)`${ReactIconStyled}`
export const AttackIcon = styled(GiPointySword)`${ReactIconStyled}`
export const LinkIcon = styled(BiLinkExternal)`${ReactIconStyled}`
export const MetaIcon = styled(SiDatabricks)`${ReactIconStyled}`
export const DiscordIcon = styled(FaDiscord)`${ReactIconStyled}`
export const LoserIcon = styled(FaSkullCrossbones)`${ReactIconStyled}`
export const VictorIcon = styled(BsFillTrophyFill)`${ReactIconStyled}`

export {
  Cart as BuyIcon,
  Deploy as UpgradeIcon,
  Edit as EditIcon,
  AddCircle as AddIcon,
  Twitter as TwitterIcon,
  Github as GithubIcon,
  FormClose as CloseIcon,
  Chat as ChatIcon,
  Notification as NotificationIcon,
  ChatOption as StoryIcon,
  Menu as MenuIcon,
  Ascend as AscendIcon,
  Descend as DescendIcon,
  Calendar as DateIcon,
  Calendar as ChallengeDateIcon,
  SchedulePlay as StartDateIcon,
  Plan as FinishDateIcon,
  CaretRightFill as ArrowRightIcon,
  CaretLeftFill as ArrowLeftIcon,
  Filter as FilterIcon
} from 'grommet-icons'

export { 
  Accordion,
  Grid,
  Text,
  TextInput,
  TextArea,
  Tab,
  Tabs,
  CheckBox,
  RadioButton,
} from 'grommet'

export * from './Loaders/Circle'
export * from './Loaders/Rectangle'
export { default as AccordionPanel } from './AccordionPanel'
export { default as AsyncBox } from './AsyncBox'
export { default as BattleCard } from './BattleCard'
export { default as Clock } from './Clock'
export { default as CollectionCard } from './CollectionCard'
export { default as Header } from './Header'
export { default as HeroCard } from './HeroCard'
export { default as NFTCard } from './NFTCard'
export { default as Layout } from './Layout'
export { default as Modal } from './Modal'
export { default as ModalAlert } from './ModalAlert'
export { default as BootstrapConfig } from './BootstrapConfig'
export { default as Wallet } from './Wallet'
export { default as Img } from './Img'
export { default as TabsRoute } from './TabsRoute'
export { default as BattleRow } from './BattleRow'
export { default as ActionButton } from './ActionButton'
export { default as Box } from './Box'
export { default as Button } from './Button'
export { default as Delay } from './Delay'
export { default as DropButton } from './DropButton'
export { default as Grommet } from './Grommet'
export { default as Heading } from './Heading'
export { default as InfoBox } from './InfoBox'
export { default as Page } from './Page'
export { default as PageContent } from './PageContent'
export { default as PageSidebar } from './PageSidebar'
export { default as PageHeading } from './PageHeading'
export { default as Select } from './Select'
export { default as Spinner } from './Spinner'
export { default as SortButton } from './SortButton'
export { default as SortButtonList } from './SortButtonList'
export { default as Slider } from './Slider'
export { default as Tip } from './Tip'
