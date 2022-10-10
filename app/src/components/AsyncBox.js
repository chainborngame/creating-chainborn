import InfoBox from './InfoBox'
import Spinner from './Spinner'

export default function AsyncBox({ loading, error, message='Could not load data', children }) {
  return (
    loading
    ? <Spinner />
    : error 
    ? <InfoBox level='6' width='100%' severity='error'>{message}</InfoBox>
    : children
  )
}
