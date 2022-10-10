import styled from 'styled-components'
import { Select as GSelect } from 'grommet'

const Select = styled(GSelect)`
  color: ${props => props.theme.global.colors.brand};
`

Select.defaultProps = {
  labelKey: 'label',
  valueKey: { key: 'value', reduce: true },
}

export default Select