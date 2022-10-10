import ContentLoader from 'react-content-loader'

export function RectangleLoader({ width, height, ...props }) {
  return (
    <ContentLoader viewBox={`0 0 ${width} ${height}`} height={height} {...props} backgroundColor='#dadddf'>
      {/*<circle cx={size/2} cy={size/2} r={size/2} />*/}
      <rect x="0" y="0" rx="2" ry="2" width={width} height={height} />
    </ContentLoader>
  )
}

export function RectangleError({ size, ...props }) {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} height={size} {...props} fill='tomato'>
      <circle cx={size/2} cy={size/2} r={size/2} />
    </svg>
  )
}
