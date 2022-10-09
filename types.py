import smartpy as sp

## Config
#

TGameConfig = sp.TRecord(
  paused=sp.TBool,
  owners=sp.TMap(sp.TAddress, sp.TNat),
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
  supported_game_modes=sp.TSet(sp.TString),
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
THeroItem = sp.TRecord(
  token_id=sp.TNat,
  token_address=sp.TAddress,
  item_type=sp.TString,     # Broadsword, Fabriel, Shield, etc.
  item_offensive=sp.TBool,  # Offensive or defensive
  item_power=sp.TNat        # How powerful is the item
)
THeroItems = sp.TList(THeroItem)
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

## Battle
#

TTurn = sp.TRecord(
  hero=THeroUid,
  damage=sp.TNat,
  timestamp=sp.TTimestamp
)
TTurns = sp.TRecord(
  latest=sp.TOption(sp.TTimestamp),
  turns=sp.TList(TTurn)
)

TBattle = sp.TRecord(
  bid=sp.TString,
  victor=sp.TOption(THeroUid),
  looser=sp.TOption(THeroUid),
  challenger=THeroUid,
  challenged=THeroUid,
  challenger_damage=sp.TNat,
  challenged_damage=sp.TNat,
  started=sp.TBool,
  finished=sp.TBool,
  resolved=sp.TBool,
  mode=sp.TString,
  loot=sp.TMutez,
  turn=THeroUid,
  turns=TTurns,
  challenge_time=sp.TTimestamp,
  start_time=sp.TOption(sp.TTimestamp),
  finish_time=sp.TOption(sp.TTimestamp),
  experience_gained=sp.TNat,
)

## Other
#

TTransferTokensParam = sp.TRecord(
  sender=sp.TAddress,
  receiver=sp.TAddress,
  token_address=sp.TAddress,
  token_ids=sp.TList(sp.TNat),
  amount=sp.TNat
)
