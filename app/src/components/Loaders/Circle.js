import ContentLoader from 'react-content-loader'

export function CircleLoader({ size, ...props }) {
  return (
    <ContentLoader viewBox={`0 0 ${size} ${size}`} height={size} backgroundColor='#dadddf'>
      <circle cx={size/2} cy={size/2} r={size/2} />
    </ContentLoader>
  )
}

export function CircleError({ size, ...props }) {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} height={size} fill='tomato'>
      <circle cx={size/2} cy={size/2} r={size/2} />
    </svg>
  )
}
