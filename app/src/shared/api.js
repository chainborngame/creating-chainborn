export const getFBToken = async (payload) => {
  const res = await fetch('/rest/fbtoken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const token = await res.text()
  return token
}

export const executeBattleTurn = async (payload) => {
  await fetch('/rest/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export const getTezIDProfile = async (address) => {
  if (!address) return null
  const res = await fetch(`https://tezid.net/api/mainnet/profile/${address}`)
  const profile = await res.json()
  return profile
}
