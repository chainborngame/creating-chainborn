import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { create as createIdentityImage } from 'identity-img'
import queryString from 'query-string'
import { uid } from 'uid'
import debounce from 'debounce'
import { firestore } from 'shared/firebase' 
import { doc, collection, addDoc, updateDoc } from 'firebase/firestore'
import {
  getTezIDProfile as getTezIDProfileAPI
} from './api'
import { 
  TIME_FORMAT,
  DATE_FORMAT,
  IPFS_BASE_URI
} from './constants'

export async function notify(network, sender, receiver, type, text, link) {
  const notificationsRef = collection(firestore, `/${network}/notifications/${receiver}`);
  await addDoc(notificationsRef, {
    uid: uid(8),
    read: false,
    type: type,
    text: text,
    link: link,
    createdAt: new Date(), // TODO: Get server timestamp 
    sender
  })
}

export async function markNotificationRead(network, address, fid) {
  if (!network || !address || !fid) return
  const notificationsRef = doc(firestore, `/${network}/notifications/${address}/${fid}`);
  await updateDoc(notificationsRef, {
    read: true
  })
}

const imgCache = {}
export function getIdentityImage(address) {
  const idimg = new Image()
  if (!imgCache[address]) {
    imgCache[address] = createIdentityImage(address) 
  }
  idimg.src = imgCache[address]
  return idimg
}

const profileCache = {}
export async function getTezIDProfile(address) {
  if (!profileCache[address]) {
    profileCache[address] = await getTezIDProfileAPI(address) 
  }
  return profileCache[address] 
}

export function formatDate(date) {
  try {
    return format(new Date(date), DATE_FORMAT) 
  } catch(e) {
    // console.error(e)
  }
  return null
}

export function formatTime(date) {
  try {
    return format(new Date(date), TIME_FORMAT) 
  } catch(e) {
    // console.error(e)
  }
  return null
}

export function getIpfsLink(ipfsPath) {
  return `${IPFS_BASE_URI}/${ipfsPath?.split('ipfs://')[1]}`
}

export async function sleep(seconds) {
  await new Promise(resolve => setTimeout(resolve, seconds*1000))
}

export function isEqualHero(a, b) {
  if (!a || !b) {
    return false
  }

  const addressA = 'token_address' in a ? 'token_address' : 'address'
  const addressB = 'token_address' in b ? 'token_address' : 'address'
  const idA = 'token_id' in a ? 'token_id' : 'nat'
  const idB = 'token_id' in b ? 'token_id' : 'nat'

  return (
    a[addressA] === b[addressB] && 
    String(a[idA]) === String(b[idB]) &&
    a[addressA] !== undefined &&
    b[addressB] !== undefined &&
    a[idA] !== undefined &&
    b[idB] !== undefined
  )
}

export function getBattleStatus(battle) {
  if (battle.resolved) return 'Resolved'
  if (battle.finished) return 'Finished'
  // TODO: Missing timeout here
  if (battle.started) return 'Ongoing'
  return 'Challenge'
}

export function statusToQuery(status) {
  let query
  switch (status) {
    case 'challenge':
      query = `{ start_time: { _is_null: true } }`
      break
    case 'ongoing':
      query = `{ start_time: { _is_null: false }, finish_time: { _is_null: true }, resolved: { _eq: false } }`
      break
    case 'finished':
      query = `{ start_time: { _is_null: false }, finish_time: { _is_null: false }, resolved: { _eq: false } }`
      break
    case 'resolved':
      query = `{ start_time: { _is_null: false }, resolved: { _eq: true } }`
      break
    default:
      query = ``
      break
  }
  return query
}

export function lootToQuery(lootString) {
  let query = ''
  if (lootString) {
    const [ min, max ] = lootString.split('-')
    query = `
      ${min ? `{loot: { _gte: ${min} }},` : ''}
      ${max ? `{loot: { _lte: ${max} }},` : ''}
    `
  }
  return query
}

/*
* Like useState, but keeps the state in URL Search parameters
*/
export function useUrlState() {
  const query = queryString.parse(window.location.search)

  const setQuery = useCallback(queryObject => {
    const queryObjectNoNulls = Object.keys(queryObject).reduce((acc, key) => {
      if (queryObject[key] !== null) {
        acc[key] = queryObject[key]
      }
      return acc
    }, {})
    const path = window.location.pathname
    const search = queryString.stringify(queryObjectNoNulls)
    const newUrl = search ? `${path}?${search}` : path
    window.history.pushState({}, '', newUrl)
  }, [])

  return [ query, setQuery ]
}

/*
* Keeps the state in the localStorage
*/
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(key);
      const initial = saved !== null ? JSON.parse(saved) : defaultValue;
      return initial;
    }
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

/*
* Get the screen size on resizing
*/
export function useResponsive(debounceDefault=200) {
  const [ width, setWidth ] = useState(window.innerWidth)
  useEffect(() => {
    const onResize = debounce(event => {
      setWidth(window.innerWidth)
    }, debounceDefault)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [debounceDefault])
  return { width }
}

/*
* Util hook to fetch more data from a GraphQL query
*/
export function useFetchMore(data, dataName, fetchMore) {

  const [ hasMore, setHasMore ] = useState(true)

  const onFetchMore = useCallback(() => {
    fetchMore({
      variables: {
        offset: data.length
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult[dataName].length > 0) {
          return {
            [dataName]: previousResult[dataName].concat(fetchMoreResult[dataName])
          }
        } 
      },
    })
  }, [data, dataName, fetchMore])

  useEffect(() => {
    const checkIfMore = () => {
      fetchMore({
        variables: {
          offset: data.length
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          setHasMore(fetchMoreResult[dataName].length > 0)
        },
      })
    }
    checkIfMore()
  }, [data, dataName, fetchMore])

  return { onFetchMore, hasMore }
}

export function truncateAddress(addr) {
  return `${addr.substring(0,7)}..${addr.substring(addr.length-4,addr.length)}`
}

export function getTzktURI(config) {
  const prefix = config?.NETWORK_NAME !== 'mainnet' ? `${config?.NETWORK_NAME}.` : ''
  return `https://${prefix}tzkt.io`
}

export function useUnlockState(conditionStart, conditionFinish, callback, deps) {
  useEffect(() => {
    if (conditionStart()) {
      if (conditionFinish()) {
        callback()
      } 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps])
}
