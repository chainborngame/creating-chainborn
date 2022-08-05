import smartpy as sp

## Config
#

TGameConfig = sp.TRecord(
  paused=sp.TBool,
  summon_cost=sp.TMutez,
  minimum_loot=sp.TMutez,
  hero_health_initial=sp.TNat,
  hero_strength_initial=sp.TNat,
  pair_battle_cooldown=sp.TInt,
  battle_turn_timeout=sp.TInt,
  battle_experience_min=sp.TNat,
  battle_experience_max=sp.TNat,
  platform_loot_percentage=sp.TNat,
  datastore_address=sp.TAddress,
  randomizer_address=sp.TAddress,
)

## Hero
#

THeroUid = sp.TPair(sp.TAddress, sp.TNat)

THeroCharacter = sp.TRecord(
  name=sp.TString,
  story=sp.TString,
  battle_ready=sp.TBool
)

THeroAttributes = sp.TRecord(
  health=sp.TNat,
  strength=sp.TNat,
  experience=sp.TNat,
  experience_total=sp.TNat,
)

THeroBattles = sp.TRecord(
  latest=sp.TTimestamp,
  battles=sp.TSet(sp.TString)
)

THero = sp.TRecord(
  owner=sp.TAddress,
  token_id=sp.TNat,
  token_address=sp.TAddress,
  summoned=sp.TTimestamp,
  suited=sp.TBool,
  battling=sp.TBool,
  battles=sp.TMap(THeroUid, THeroBattles),
  character=THeroCharacter,
  attrs=THeroAttributes,
  items=THeroItems,
  meta=sp.TMap(sp.TString, sp.TBytes)
)