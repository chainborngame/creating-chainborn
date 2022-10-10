import { config } from 'tiny-env-config'

export const DB_HOST = config('DB_HOST', 'localhost')
export const DB_PORT = config('DB_HORT', '5432')
export const DB_NAME = config('DB_NAME', 'chainborn')
export const DB_USER = config('DB_USER', 'postgres')
export const DB_PASS = config('DB_PASS', 'password')
export const TZKT_API = config('TZKT_API', 'https://api.ghostnet.tzkt.io')
export const TEZOS_ENV = config('TEZOS_ENV', 'development')
export const RPC_ENDPOINT = config('RPC_ENDPOINT', 'https://ghostnet.ecadinfra.com/')
export const NETWORK_NAME = config('NETWORK_NAME', 'ghostnet')
export const IPFS_ENDPOINT = config('IPFS_ENDPOINT', 'https://chainborn.infura-ipfs.io/ipfs' )
export const SCRAPE_INTERVAL = config('SCRAPE_INTERVAL', 5000)
export const CHAINBORN_CONTRACT = config('CHAINBORN_CONTRACT', 'KT1Vope8at5KLwtJrzgLBmRYnSzfdLu3w63w') // replace
export const COLLECTION_INDEXER = config('COLLECTION_INDEXER', '')
export const CHAINBORN_DATASTORE = config('CHAINBORN_DATASTORE', 'KT1J5wddYxtFehL7iNgYGE1sSEzptbXBUoch') // replace
export const COLLECTION_REINDEX_INTERVAL = config('COLLECTION_REINDEX_INTERVAL', '300000', parseInt)
export const COLLECTION_INDEXER_BATCH_SIZE = config('COLLECTION_INDEXER_BATCH_SIZE', 100)
export const COLLECTION_INDEXER_MAX_UPDATES = config('COLLECTION_INDEXER_MAX_UPDATES', 1000)
