import { getIpfsLink, isEqualHero } from './utils'
// import { RANK } from './constants'

export class Config {
  constructor(dataServer) {
    if (dataServer) {
      const config0 = dataServer?.config?.[0]?.config
      const config1 = dataServer?.config?.[0]?.storage?.config
      this.CHAINBORN_CONTRACT = config0.CHAINBORN_CONTRACT
      this.CHAINBORN_DATASTORE = config0.CHAINBORN_DATASTORE
      this.NETWORK_NAME = config0.NETWORK_NAME
      this.RPC_ENDPOINT = config0.RPC_ENDPOINT
      this.battle_experience_max  = config1.battle_experience_max
      this.battle_experience_min  = config1.battle_experience_min
      this.battle_turn_timeout  = config1.battle_turn_timeout
      this.hero_health_initial  = config1.hero_health_initial
      this.hero_strength_initial  = config1.hero_strength_initial
      this.looser_decide_faith_time  = config1.looser_decide_faith_time
      this.minimum_loot  = config1.minimum_loot / 1000000
      this.owners  = config1.owners
      this.pair_battle_cooldown = parseInt(config1.pair_battle_cooldown)
      this.paused  = config1.paused
      this.platform_loot_percentage  = config1.platform_loot_percentage
      this.randomizer_address  = config1.randomizer_address
      this.summon_cost = config1.summon_cost / 1000000
      this.supported_game_modes = config1.supported_game_modes
    }
  }
}

export class Collection {

  constructor(collectionServer) {
    if (collectionServer) {
      this.address = collectionServer.address
      this.banner = getIpfsLink(collectionServer.banner)
      this.name = collectionServer.name
      this.lore = collectionServer.lore
      this.crest = getIpfsLink(collectionServer.crest)
      this.link = collectionServer.link
    }
  }

}

export class Hero {

  constructor(heroServer, heroesMostWins, heroesMostExperience, heroesMostWinStreaks) {
    if (heroServer) {
      const owner = heroServer.token_owner.indexOf('tz1') === 0 ? heroServer.token_owner : heroServer.hero_owner
      this.token_address = heroServer.token_address
      this.token_id = heroServer.token_id
      this.id = `${heroServer.token_address}__${heroServer.token_id}` 
      this.owner = owner 
      this.thumbnailUri = getIpfsLink(heroServer.token_metadata.thumbnailUri)
      this.name = heroServer.hero.character.name
      this.story = heroServer.hero.character.story
      this.battle_ready = heroServer.hero.character.battle_ready
      this.suited = heroServer.hero.suited
      this.health = parseInt(heroServer.hero.attrs.health)
      this.strength = parseInt(heroServer.hero.attrs.strength)
      this.experience = parseInt(heroServer.hero.attrs.experience)
      this.experience_total = parseInt(heroServer.hero.attrs.experience_total)
      this.battling = heroServer.hero.battling
      this.battles = heroServer.hero.battles
      this.wins = heroServer?.wins || 0
      this.losses = heroServer?.losses || 0
      this.badges = {}
      if (heroesMostWins) {
        this.badges.mostWins = 
          isEqualHero(heroServer, heroesMostWins[0]) ? 1 :
          isEqualHero(heroServer, heroesMostWins[1]) ? 2 :
          isEqualHero(heroServer, heroesMostWins[2]) ? 3 : null
      }
      if (heroesMostExperience) {
        this.badges.mostExperience = 
          isEqualHero(heroServer, heroesMostExperience[0]) ? 1 :
          isEqualHero(heroServer, heroesMostExperience[1]) ? 2 :
          isEqualHero(heroServer, heroesMostExperience[2]) ? 3 : null
      }
      if (heroesMostWinStreaks) {
        this.badges.mostWinStreaks = 
          isEqualHero(heroServer, heroesMostWinStreaks[0]) ? 1 :
          isEqualHero(heroServer, heroesMostWinStreaks[1]) ? 2 :
          isEqualHero(heroServer, heroesMostWinStreaks[2]) ? 3 : null
      }
    }
  }

  static RANK = {
    UNKNOWN: 'Unknown',
    NOVICE: 'Novice',
    TRAINEE: 'Trainee',
    EXPERIENCED: 'Experienced',
    MASTER: 'Master',
  }

  static merge(hero1, hero2) {
    return Object.assign(new Hero(), hero1, hero2)
  }

  copy(hero) {
    for (const key of Object.keys(hero)) {
      this[key] = hero[key]
    }
  }

  getRank() {
    const xp = this.experience_total || 0
    if (xp < 25)  return Hero.RANK.UNKNOWN
    if (xp < 50)  return Hero.RANK.NOVICE
    if (xp < 75)  return Hero.RANK.TRAINEE
    if (xp < 100) return Hero.RANK.EXPERIENCED
    return Hero.RANK.MASTER
  }

}

export class PossibleHero {

  constructor(possibleHeroServer) {
    if (possibleHeroServer) {
      this.token_address = possibleHeroServer.token_address
      this.token_id = possibleHeroServer.token_id
      this.owner = possibleHeroServer.token_owner
      this.thumbnailUri = getIpfsLink(possibleHeroServer.token_metadata.thumbnailUri)
      this.nft = {
        name: possibleHeroServer.token_metadata.name,
        description: possibleHeroServer.token_metadata.description,
      }
    }
  }

}

export class Battle {

  constructor(battleServer) {
    this.bid = battleServer.bid
    this.challenger_owner = battleServer.challenger_owner
    this.challenged_owner = battleServer.challenged_owner
    this.challenge_time = battleServer.battle.challenge_time
    this.challenger = battleServer.battle.challenger
    this.challenger_damage = battleServer.battle.challenger_damage
    this.challenged = battleServer.battle.challenged
    this.challenged_damage = battleServer.battle.challenged_damage
    this.experience_gained = battleServer.battle.experience_gained
    this.finish_time = battleServer.battle.finish_time
    this.finished = battleServer.battle.finished
    this.looser = battleServer.battle.looser
    this.loot = battleServer.battle.loot / 1000000
    this.mode = battleServer.battle.mode
    this.resolved = battleServer.battle.resolved
    this.start_time = battleServer.battle.start_time
    this.started = battleServer.battle.started
    this.turn = battleServer.battle.turn
    this.turns = battleServer.battle.turns
    this.victor = battleServer.battle.victor
    this.cancelled = battleServer.cancelled || false
  }

  isTimeout(timeout) {
    const timeNow = (new Date()).getTime() / 1000
    const timeLatestTurn = (new Date(this.turns.latest)).getTime() / 1000
    return (timeNow - timeLatestTurn) > timeout
  }

}

