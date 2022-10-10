import { 
  gql,
  split, 
  HttpLink, 
  ApolloClient, 
  InMemoryCache, 
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { useQuery } from '@apollo/client'
import { Config, Collection, Hero, PossibleHero, Battle } from './models'
import { isEqualHero, statusToQuery, lootToQuery } from './utils'
import { HASURA_HOST } from './constants'

const POLL_INTERVAL = 5000

/** INIT **/

const httpLink = new HttpLink({
  uri: `http://${HASURA_HOST}/v1/graphql`
})

const wsLink = new WebSocketLink({
  uri: `ws://${HASURA_HOST}/v1/graphql`,
  options: {
    reconnect: true
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
)

let apolloClient;
export function getApolloClient() {
  if (!apolloClient) apolloClient = new ApolloClient({
    uri: `http://${HASURA_HOST}/v1/graphql`,
    link: splitLink,
    cache: new InMemoryCache()
  })
  return apolloClient
}


/** HOOKS **/

/*
* Fetches the config of the game
*/
export function useGetConfig() {
  const { loading, data, error } = useQuery(gql`
    query getConfig {
      config {
        config
        network
        storage
      }
    }
  `)

  return {
    loading,
    error,
    config: loading ? null : new Config(data)
  }
}

/*
* Fetches all collections
*/
export function useGetCollections() {
  const { loading, data, error } = useQuery(gql`
    query getCollections {
      collections (
        order_by: { sort_order: asc }
      ) {
        name
        lore
        link
        crest
        banner
        address
      }
    }
  `)

  const collections = 
    data?.collections.map(collection => new Collection(collection)) || []

  return {
    loading,
    error,
    collections
  }
}

/*
* Fetches 1 collection
*/
export function useGetCollection({ address }) {
  const { loading, data, error } = useQuery(gql`
    query getCollections($address: String) {
      collections(
        where: {
          address: { _eq: $address }
        }
      ) {
        address
        name
        crest
        lore
        link
      }
    }
  `, {
    variables: { address }
  })

  const collection = data?.collections?.[0]
    ? new Collection(data?.collections?.[0]) 
    : null

  return {
    loading,
    error,
    collection
  }
}
/*
* Fetches possible heroes of a specific owner to be summoned
*/
export function useGetPossibleHeroes({ owner='' }) {
  const { loading, data, error } = useQuery(gql`
    query getPossibleHeroes($owner: String) {
      heroes(
        where: {
          hero: { _is_null: true }
          token_owner: { _eq: $owner }
        },
        order_by: [
          { token_id: asc }
        ]
      ) {
        token_owner
        token_metadata
        token_address
        token_id
      }
    }
  `, { 
    pollInterval: POLL_INTERVAL,
    variables: { owner }
  })

  const heroes = data?.heroes || []

  return {
    loading,
    error,
    heroes: heroes.map(hero => new PossibleHero(hero))
  }
}

/*
* Fetch heroes
*/
export function useGetHeroes({ owner='', not_owner='', name, token_address, sort_by='summoned_at', sort_direction='desc', offset=0, limit=25 }={}) {
  const { 
    loading, 
    data, 
    error,
    fetchMore
  } = useQuery(gql`
    query getHeroes($owner: String, $not_owner: String, $name: String, $token_address: String, $order_by: heroes_order_by!, $offset: Int, $limit: Int) {
      heroes(
        where: {
          _and: [
            { hero: { _is_null: false } },
            ${token_address ? '{ token_address: { _eq: $token_address } },' : ''}
            ${ name ? `{ name: { _ilike: "%${name}%" } },` : ''}
            ${ owner ? `
              { _or : [
                { hero_owner: { _eq: $owner } },
                { token_owner: { _eq: $owner } }
              ]},
            `: ''}
            ${ not_owner ? `
              { hero_owner: { _neq: $not_owner } },
              { token_owner: { _neq: $not_owner } },
            ` : ''}
          ]
        },
        order_by: [$order_by],
        offset: $offset,
        limit: $limit
      ) {
        hero
        hero_owner
        token_owner
        token_address
        token_id
        token_metadata
      }
    }
  `, { 
    pollInterval: POLL_INTERVAL,
    variables: { owner, not_owner, name, token_address, order_by: { [sort_by]: sort_direction }, offset, limit }
  })

  // Query data for badges
  const { heroes: heroesMostWins } = useGetHeroesMostWins()
  const { heroes: heroesMostExperience } = useGetHeroesMostExperience()
  const { heroes: heroesMostWinStreaks } = useGetHeroesMostWinStreaks()

  const heroes = (data?.heroes || [])
    .map(heroServer => new Hero(heroServer, heroesMostWins, heroesMostExperience, heroesMostWinStreaks))
    .filter(hero => owner 
      ? hero.owner === owner // Required to filter out Heroes I have unsuited and transferred
      : true
    ) 

  return { 
    loading,
    error,
    fetchMore,
    heroes
  }
}

/*
* Fetches a specific hero
*/
export function useGetHero({ address, id }) {
  // Get Hero
  // 
  const { 
    loading, 
    data, 
    error
  } = useQuery(gql`
    query getHero($address: String, $id: Int) {
      heroes(where: {
        token_address: { _eq: $address }
        token_id: { _eq: $id }
      }) {
        hero,
        wins,
        losses,
        token_id,
        hero_owner,
        token_owner,
        token_address,
        token_metadata,
      }
    }
  `, { 
    pollInterval: POLL_INTERVAL,
    variables: { address, id },
  })
  const heroServer = data?.heroes?.[0]

  // Query data for badges
  const { heroes: heroesMostWins } = useGetHeroesMostWins()
  const { heroes: heroesMostExperience } = useGetHeroesMostExperience()
  const { heroes: heroesMostWinStreaks } = useGetHeroesMostWinStreaks()

  let hero
  if (!loading && heroServer) {
    hero = new Hero(heroServer, heroesMostWins, heroesMostExperience, heroesMostWinStreaks)
  }

  return {
    loading,
    error,
    hero
  }
}

/*
* Fetch Top 3 heroes with most wins
*/
function useGetHeroesMostWins() {
  const { 
    loading, 
    data, 
    error,
  } = useQuery(gql`
    query getHeroesMostWins {
      heroes(
        where: {
          _and: [
            { hero: { _is_null: false } }
          ]
        },
        order_by: { wins: desc },
        limit: 3
      ) {
        token_address
        token_id
      }
    }
  `, { 
    pollInterval: POLL_INTERVAL
  })

  const heroes = (data?.heroes || [])

  return { 
    loading,
    error,
    heroes
  }
}

/*
* Fetch Top 3 heroes with most experience
*/
function useGetHeroesMostExperience() {
  const { 
    loading, 
    data, 
    error,
  } = useQuery(gql`
    query getHeroesMostExperience {
      heroes(
        where: {
          _and: [
            { hero: { _is_null: false } }
          ]
        },
        order_by: { experience_total: desc },
        limit: 3
      ) {
        token_address
        token_id
      }
    }
  `, { 
    pollInterval: POLL_INTERVAL
  })

  const heroes = data?.heroes || []

  return { 
    loading,
    error,
    heroes
  }
}

/*
* Fetch Top 3 heroes with most winning streaks
*/
function useGetHeroesMostWinStreaks() {
  const { 
    loading, 
    data, 
    error,
  } = useQuery(gql`
    query getHeroesMostWinStreaks {
      streaks(
        limit: 3
      ) {
        player,
        streak
      }
    }
  `, { 
    pollInterval: POLL_INTERVAL
  })

  const heroes = (data?.streaks || [])
    .map(streak => streak.player)

  return { 
    loading,
    error,
    heroes
  }
}

export function useGetBattles({ owner='', not_owner='', status, token_address='', token_id, loot, sort_by='challenge_time', sort_direction='desc', offset=0, limit=25 }) {
  const { loading, data, error, fetchMore } = useQuery(gql`
    query getMyBattles($owner: String, $not_owner: String, $token_address: String, $token_id: String, $order_by: battles_order_by!, $offset: Int, $limit: Int) {
      battles(
        where: {
          _and : [
            {cancelled: { _eq: false }},
            ${owner ? `
              {_or: [ 
                {challenger_owner: { _eq: $owner }},
                {challenged_owner: { _eq: $owner }},
              ]},
            ` : ''}
            ${not_owner ? `
              {challenger_owner: { _neq: $not_owner }},
              {challenged_owner: { _neq: $not_owner }},
            ` : ''}
            ${statusToQuery(status)},
            ${token_address ? `
              {_or: [
                {challenger_token_address: { _eq: $token_address } }, 
                {challenged_token_address: { _eq: $token_address } }
              ]},
            ` : ''}
            ${token_id ? `
              {_or: [
                {challenger_token_id: { _eq: $token_id } }, 
                {challenged_token_id: { _eq: $token_id } }
              ]},
            ` : ''}
            ${lootToQuery(loot)},
          ]
        },
        order_by: [$order_by],
        offset: $offset,
        limit: $limit
      ) {
        battle
        bid
        challenged_owner
        challenger_owner
      }
    }
  `, {
    pollInterval: POLL_INTERVAL,
    variables: { owner, not_owner, token_address, token_id, order_by: { [sort_by]: sort_direction }, offset, limit  },
  })

  const battles = (data?.battles || [])
    .map(battle => new Battle(battle))

  return { 
    loading,
    error,
    fetchMore,
    battles
  }
}

export function useGetHeroBattles({ id, address}) {
  const { loading, data, error } = useQuery(gql`
    query getHeroBattles($token_id: String, $token_address: String) {
      battles(
        where: {
          _or: [
            { 
              _and: [
                { start_time: { _is_null: false } },
                { cancelled: { _eq: false } },
                { challenger_token_id: { _eq: $token_id } },
                { challenger_token_address: { _eq: $token_address } }
              ]
            },
            { 
              _and: [
                { start_time: { _is_null: false } },
                { cancelled: { _eq: false } },
                { challenged_token_id: { _eq: $token_id } },
                { challenged_token_address: { _eq: $token_address } }
              ]
            }
          ]
        },
        order_by: [
          { challenge_time: desc }
        ],
        limit: 5
      ) {
        battle
        bid
        challenged_owner
        challenger_owner
      }
    }
  `, {
    pollInterval: POLL_INTERVAL,
    variables: { token_id: id, token_address: address },
  })

  const battles = data?.battles.map(battle => new Battle(battle))

  return { 
    loading, 
    error,
    battles
  }
}

/*
* Fetches a specific Battle
*/
export function useGetBattle({ bid }) {
  // Get Battle
  // 
  const { 
    loading: loadingBattle, 
    error: errorBattle,
    data,  
  } = useQuery(gql`
    query getBattle($bid: String) {
      battles(where: {
        bid: { _eq: $bid }
      }) {
        battle
        bid
        challenged_owner
        challenger_owner
        cancelled
      }
    }
  `, {
    pollInterval: POLL_INTERVAL,
    variables: { bid },
  })
  const battle = data?.battles?.[0]?.battle

  // Get Heroes data and add them to the Battle
  // 
  const {
    loading: loadingChallenger,
    error: errorChallenger,
    hero: challenger
  } = useGetHero({ address: battle?.challenger.address, id: battle?.challenger.nat })

  const {
    loading: loadingChallenged,
    error: errorChallenged,
    hero: challenged
  } = useGetHero({ address: battle?.challenged.address, id: battle?.challenged.nat })

  const loading = loadingBattle || loadingChallenger || loadingChallenged
  const error = errorBattle || errorChallenger || errorChallenged

  let battleObject
  if (!loading && !error) {
    // Calculcate Heroes health
    const turns = battle?.turns?.turns
    if (challenger && challenged && turns?.length > 0) {
      challenged.damage = 0
      challenger.damage = 0
      for (const turn of turns) {
        if (isEqualHero(turn.hero, challenger)) {
          challenged.damage += parseInt(turn.damage)
        }
        if (isEqualHero(turn.hero, challenged)) {
          challenger.damage += parseInt(turn.damage)
        }
      }
    }

    // Find vitor/looser
    const victor = isEqualHero(challenger, battle?.victor) 
      ? challenger
      : isEqualHero(challenged, battle?.victor)
      ? challenged
      : null
    const looser = isEqualHero(challenger, battle?.looser) 
      ? challenger
      : isEqualHero(challenged, battle?.looser)
      ? challenged
      : null

    // Merge Heroes to the Battle
    const battleAllData = { 
      ...data?.battles?.[0], 
      battle: { 
        ...battle, 
        challenger, 
        challenged,
        victor,
        looser,
      }
    }

    battleObject = new Battle(battleAllData)
  }

  return { 
    loading, 
    error,
    battle: battleObject
  }
}

// export async function waitForIndexToUpdate(query, variables, validateFn, errorMessage='Data might be incorrect') {
//   const maxTries = 10
//   for (let i=0; i<maxTries; i++) {
//     const { data, loading } = await apolloClient.query({ query, variables })
//     if (validateFn({ data, loading })) {
//       return true
//     }
//     await sleep(1)
//   }
//   throw new Error({ title: errorMessage })
// }
