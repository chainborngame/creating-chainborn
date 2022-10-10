import { useEffect } from 'react'
import { useGetConfig } from 'shared/apollo'
import { setProvider } from 'shared/wallet'

export default function BootstrapConfig() {
  const { loading, config } = useGetConfig()

  useEffect(() => {
    if (!loading) {
      setProvider(config.RPC_ENDPOINT)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return null
}