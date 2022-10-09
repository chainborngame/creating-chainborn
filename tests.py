import smartpy as sp
from datetime import datetime
from random import randint
import os

cwd = os.getcwd()

Game = sp.io.import_script_from_url("file://%s/controller.py" % cwd)
Data = sp.io.import_script_from_url("file://%s/datastore.py" % cwd)
Types = sp.io.import_script_from_url("file://%s/types.py" % cwd)
Tokens = sp.io.import_script_from_url("file://%s/tokens.py" % cwd)
Randomizer = sp.io.import_script_from_url("https://ipfs.io/ipfs/QmPNkabMCpDmFE6GynfS9UAoQDLE6PyCLpRJQmceEp2oTv")

# TODO: Test all battle modes (both missing)
# TODO: Test case for deleting hero + battle and returning tokens to owner via admin_transfer_tokens

gameContractMeta = sp.big_map({
  "": sp.utils.bytes_of_string("tezos-storage:content"),
  "content": sp.utils.bytes_of_string('{"name" : "ChainBorn Game"}')
})
gameDataMeta = sp.big_map({
  "": sp.utils.bytes_of_string("tezos-storage:content"),
  "content": sp.utils.bytes_of_string('{"name" : "ChainBorn Data"}')
})
nftContractMeta = sp.big_map({
  "": sp.utils.bytes_of_string("tezos-storage:content"),
  "content": sp.utils.bytes_of_string('{"name" : "Some pfp collection"}')
})
nftTokenMeta = sp.map({
  "": sp.utils.bytes_of_string("tezos-storage:content"),
  "content": sp.utils.bytes_of_string('{"name" : "Some pfp"}')
})
randomizerMeta = sp.map({
  "": sp.utils.bytes_of_string("tezos-storage:content"),
  "content": sp.utils.bytes_of_string('{"name" : "Randomizer"}')
})

allKind = "all"

def init(scene, admin):
  token = Tokens.NFT(
    Tokens.NFT_config,
    admin=admin, 
    metadata=nftContractMeta 
  )
  scene += token

  randomizer = Randomizer.Randomizer(
    admin=admin,
    metadata=randomizerMeta
  )
  scene += randomizer

  data = Data.ChainBornData(
    admins=sp.set([admin]),
    metadata=gameDataMeta
  )
  scene += data

  game = Game.ChainBornGame(
    admins=sp.set([admin]),
    owners=sp.map({
      admin: 100
    }),
    datastore_address=data.address,
    randomizer_address=randomizer.address,
    metadata=gameContractMeta 
  )
  scene += game
  scene += data.add_admin(game.address).run(sender=admin)

  return token, game, data 

def mint(scene, token, admin, token_id, owner, amount=1, metadata=nftTokenMeta):
  scene += token.mint(sp.record(
    address = owner, 
    amount = amount, 
    metadata = metadata,
    token_id = token_id
  )).run(sender=admin)

def transfer(scene, token, token_id, from_, to_, amount=1):
  transfer_arg = [sp.record(from_=from_, txs = [
    sp.record(
        to_      = to_,
        token_id = token_id,
        amount   = amount
    )])]
  scene += token.transfer(transfer_arg).run(sender=from_)

def operator(scene, token, owner, operator, token_id=0, operation='add_operator'):
  scene += token.update_operators([
    sp.variant(operation, sp.record(
      owner = owner,
      operator = operator,
      token_id = token_id
    ))
  ]).run(sender = owner)

@sp.add_target(name="Admin", kind=allKind)
def test():
  scene = sp.test_scenario()
  admin = sp.address("tz1-admin")
  user1 = sp.address("tz1-user-1")
  user2 = sp.address("tz1-user-2")
  token, game, data = init(scene, admin) 

  # Admin can modify admins

  scene.verify(game.data.admins.contains(user1) == False)
  scene += game.add_admin(user1).run(sender=user1, valid=False, exception='Only admin can call this entrypoint')
  scene += game.add_admin(user1).run(sender=admin)
  scene.verify(game.data.admins.contains(user1))
  scene += game.del_admin(user1).run(sender=admin)
  scene.verify(game.data.admins.contains(user1) == False)

  # Admin cen set game config 

  scene.verify(game.data.config.paused == False)
  scene.verify(game.data.config.summon_cost == sp.tez(10))
  config = sp.record(
    paused=True, 
    owners=sp.map({
      admin: 50,
      user1: 25,
      user2: 25
    }),
    summon_cost=sp.tez(5),
    minimum_loot=sp.tez(1),
    hero_health_initial=220,
    hero_strength_initial=200,
    pair_battle_cooldown=1000000,
    battle_turn_timeout=50000,
    battle_experience_min=4,
    battle_experience_max=8,
    platform_loot_percentage=10,
    datastore_address=sp.address('KT19etCHSt75MTF4NvUHxRNBPvp74ggv9g3P'),
    randomizer_address=sp.address('KT19etCHSt75MTF4NvUHxRNBPvp74ggv9g3P'),
    supported_game_modes=sp.set(['eple'])
  )
  scene += game.set_config(config).run(sender=user1, valid=False, exception='Only admin can call this entrypoint')
  scene += game.set_config(config).run(sender=admin) 
  scene.verify(game.data.config.paused == True)
  scene.verify(game.data.config.owners[user1]== 25)
  scene.verify(game.data.config.summon_cost == sp.tez(5))
  scene.verify(game.data.config.minimum_loot == sp.tez(1))
  scene.verify(game.data.config.hero_health_initial == 220) 
  scene.verify(game.data.config.hero_strength_initial == 200) 
  scene.verify(game.data.config.pair_battle_cooldown == 1000000) 
  scene.verify(game.data.config.battle_turn_timeout == 50000) 
  scene.verify(game.data.config.battle_experience_min == 4) 
  scene.verify(game.data.config.battle_experience_max == 8) 
  scene.verify(game.data.config.platform_loot_percentage == 10) 
  scene.verify(game.data.config.randomizer_address == sp.address('KT19etCHSt75MTF4NvUHxRNBPvp74ggv9g3P')) 
  scene.verify(game.data.config.supported_game_modes.contains('eple'))

  # Admin can add and del collections

  scene.verify(sp.len(game.data.collections) == 0)
  scene += game.add_collection(token.address).run(sender=user1, valid=False, exception='Only admin can call this entrypoint')
  scene += game.add_collection(token.address).run(sender=admin)
  scene.verify(game.data.collections.contains(token.address))
  scene += game.del_collection(token.address).run(sender=admin)
  scene.verify(game.data.collections.contains(token.address) == False)
  scene.verify(sp.len(game.data.collections) == 0)

  # Admin can set earnings (in case of errors)

  scene.verify(data.data.earnings == sp.tez(0))
  scene += data.set_earnings(sp.tez(100)).run(sender=user1, valid=False, exception='Only admin can call this entrypoint')
  scene += data.set_earnings(sp.tez(100)).run(sender=admin)
  scene.verify(data.data.earnings == sp.tez(100))

  # TODO: Missing test case for these two (only to be used in case of errors): 
  # def del_hero(self, uid)
  # def del_battle(self, bid)

@sp.add_target(name="Summon Hero", kind=allKind)
def test():
  scene = sp.test_scenario()
  admin = sp.address("tz1-admin")
  user1 = sp.address("tz1-user-1")
  user2 = sp.address("tz1-user-2")
  token, game, data = init(scene, admin)
  hero1 = sp.pair(token.address, 1)
  hero2 = sp.pair(token.address, 2)

  mint(scene, token, admin, 1, user1)
  mint(scene, token, admin, 2, user1)
  scene.verify(token.data.ledger[(user1, 1)].balance == 1)

  # Cannot Summon for unsupported collection

  scene += game.summon_hero(sp.record(
    name='Conan',
    token_id=1,
    token_address=token.address,
  )).run(sender=user1, valid=False, exception='Collection not supported')

  scene += game.add_collection(token.address).run(sender=admin)
  
  # Cannot Summon with too low amount 

  scene += game.summon_hero(sp.record(
    name='Conan',
    token_id=1,
    token_address=token.address,
  )).run(sender=user1, valid=False, exception='Amount too low') 

  # Cannot Summon without adding operator

  scene += game.summon_hero(sp.record(
    name='Conan',
    token_id=1,
    token_address=token.address,
  )).run(sender=user1, amount=sp.tez(10), valid=False, exception='FA2_NOT_OPERATOR') # Fails before FA2_NOT_OPERATOR

  # Cannot Summon if you are not the token owner

  operator(scene, token, user2, game.address, 2, 'add_operator')

  scene += game.summon_hero(sp.record(
    name='Conan',
    token_id=2,
    token_address=token.address,
  )).run(sender=user2, amount=sp.tez(10), valid=False, exception='Missing item in map')

  operator(scene, token, user2, game.address, 2, 'remove_operator')

  # Can Summon if you are token owner and add operator

  operator(scene, token, user1, game.address, 1, 'add_operator')

  scene += game.summon_hero(sp.record(
    name='Conan',
    token_id=1,
    token_address=token.address,
  )).run(sender=user1, amount=sp.tez(10))

  scene.verify(data.data.heroes.contains(hero1))
  scene.verify(token.data.ledger[(user1, 1)].balance == 0)
  scene.verify(token.data.ledger[(data.address, 1)].balance == 1)

  # Owner can update Hero

  character = data.data.heroes[hero1].character
  scene.verify(character.name == 'Conan')
  scene.verify(character.battle_ready == True)

  scene += game.update_hero_character(sp.record(
    uid=hero1, 
    character=sp.record(
      name='Luke',
      story='I can walk on the sky',
      battle_ready=True
    )
  )).run(sender=user1)

  _character = data.data.heroes[hero1].character
  scene.verify(_character.name == 'Luke') 
  scene.verify(_character.story == 'I can walk on the sky') 
  scene.verify(_character.battle_ready == True)

  # Owner can unsuit (unstake) Hero and receive original NFT back

  scene += game.unsuit(sp.pair(token.address, 10)).run(sender=user1, valid=False, exception='Hero does not exist')
  scene += game.unsuit(hero1).run(sender=user2, valid=False, exception='Only owner can unsuit')
  scene += game.unsuit(hero1).run(sender=user1)
  scene.verify(token.data.ledger[(user1, 1)].balance == 1)
  scene.verify(token.data.ledger[(data.address, 1)].balance == 0)

  # An unsuited Hero cannot be summoned again

  scene += game.summon_hero(sp.record(
    name='Conan',
    token_id=1,
    token_address=token.address,
  )).run(sender=user1, amount=sp.tez(10), valid=False, exception='Hero already exists')
  scene.verify(data.data.heroes[hero1].suited == False)

  # An unsuited Hero can suit-up by owner

  scene += game.suit_up(hero1).run(sender=user1)
  scene.verify(data.data.heroes[hero1].suited == True)

  # A user can sell the NFT and new owner can suit up

  scene += game.unsuit(hero1).run(sender=user1)
  transfer(scene, token, 1, user1, user2)
  scene += game.suit_up(hero1).run(sender=user1, valid=False, exception='FA2_INSUFFICIENT_BALANCE')
  operator(scene, token, user2, game.address, 1, 'add_operator')
  scene += game.suit_up(hero1).run(sender=user2)
  scene.verify(data.data.heroes[hero1].suited == True)
  scene.verify(data.data.heroes[hero1].owner == user2)

@sp.add_target(name="Battle", kind=allKind)
def test():
  scene = sp.test_scenario()
  admin = sp.address("tz1-admin")
  user1 = sp.address("tz1-user-1")
  user2 = sp.address("tz1-user-2")
  token, game, data = init(scene, admin)
  hero1 = sp.pair(token.address, 1)
  hero2 = sp.pair(token.address, 2)
  battle_start_time = 1637752889

  mint(scene, token, admin, 1, user1)
  mint(scene, token, admin, 2, user2)
  operator(scene, token, user1, game.address, 1, 'add_operator')
  operator(scene, token, user2, game.address, 2, 'add_operator')
  scene += game.add_collection(token.address).run(sender=admin)

  scene += game.summon_hero(sp.record(
    name='Conan',
    token_id=1,
    token_address=token.address,
  )).run(sender=user1, amount=sp.tez(10))
  scene += game.summon_hero(sp.record(
    name='Hulk',
    token_id=2,
    token_address=token.address,
  )).run(sender=user2, amount=sp.tez(10))

  scene += game.update_hero_character(sp.record(
    uid=hero1,
    character=sp.record(
      name='Conan',
      story='',
      battle_ready=True
    )
  )).run(sender=user1)
  scene += game.update_hero_character(sp.record(
    uid=hero2,
    character=sp.record(
      name='Hulk',
      story='',
      battle_ready=True
    )
  )).run(sender=user2)

  # Owner can challenge any battle_ready Hero

  scene += game.challenge_hero(sp.record(
    challenger=hero1,
    challenged=hero2,
    bid='abc',
    mode='loot',
    loot=sp.tez(3)
  )).run(sender=user1, amount=sp.tez(3))
  scene.verify(data.data.battles.contains('abc'))

  # Owner can cancel a challenge before it is accepted

  scene += game.cancel_challenge('abc').run(sender=user2, valid=False, exception='Only the owner of challenger Hero can cancel')
  scene.verify(data.balance == sp.tez(23))
  scene += game.cancel_challenge('abc').run(sender=user1) 
  scene.verify(data.data.battles.contains('abc') == False)
  scene.verify(data.balance == sp.tez(20))

  # Owner of challenged Hero can accept challenge

  scene += game.challenge_hero(sp.record(
    challenger=hero1,
    challenged=hero2,
    bid='abc',
    mode='loot',
    loot=sp.tez(12)
  )).run(sender=user1, amount=sp.tez(12))
  scene.verify(data.data.battles.contains('abc'))
  scene += game.accept_challenge('abc').run(sender=user1, amount=sp.tez(12), now=sp.timestamp(battle_start_time), valid=False, exception='Caller is not owner of challenged Hero')
  scene += game.accept_challenge('abc').run(sender=user2, amount=sp.tez(12), now=sp.timestamp(battle_start_time))
  scene.verify(data.data.battles['abc'].started)
  scene.verify(data.data.battles['abc'].finished == False)
  scene.verify(data.data.heroes[hero1].battling)
  scene.verify(data.data.heroes[hero2].battling)
  scene.verify(data.data.heroes[hero1].battles.contains(hero2))
  scene.verify(data.data.heroes[hero1].battles[hero2].battles.contains('abc'))
  scene.verify(data.data.heroes[hero2].battles.contains(hero1))
  scene.verify(data.data.heroes[hero2].battles[hero1].battles.contains('abc'))

  # Cannot cancel started challenge

  scene += game.cancel_challenge('abc').run(sender=user1, valid=False, exception='Battle already started')

  # Cannot update character while battling

  scene += game.update_hero_character(sp.record(
    uid=hero1, 
    character=sp.record(
      name='Luke',
      story='I can walk on the sky',
      battle_ready=False
    )
  )).run(sender=user1, valid=False, exception='Hero battling')

  # Cannot unsuit while battling

  scene += game.unsuit(hero1).run(sender=user1, valid=False, exception='Hero is battling')

  # Current turn owner can execute turn

  scene += game.execute_battle_turn('abc').run(sender=user1, valid=False, exception='Not your turn')
  scene += game.execute_battle_turn('abc').run(sender=user2, now=sp.timestamp(battle_start_time+10000))
  scene.verify(data.data.battles['abc'].turn == hero1)
  scene.verify(data.data.battles['abc'].challenger_damage > 0)
  scene.verify(data.data.battles['abc'].challenged_damage == 0)
  scene += game.execute_battle_turn('abc').run(sender=user2, valid=False, exception='Not your turn')
  scene += game.execute_battle_turn('abc').run(sender=user1, now=sp.timestamp(battle_start_time+20000))
  scene += game.execute_battle_turn('abc').run(sender=user2, now=sp.timestamp(battle_start_time+30000))
  scene += game.execute_battle_turn('abc').run(sender=user1, now=sp.timestamp(battle_start_time+40000))
  scene += game.execute_battle_turn('abc').run(sender=user2, now=sp.timestamp(battle_start_time+50000))
  scene += game.execute_battle_turn('abc').run(sender=user1, now=sp.timestamp(battle_start_time+60000), valid=False, exception='Battle is finished')
  scene.verify(data.data.battles['abc'].finished)
#  NOTE: Victor and looser is not set until we call resolve - for gas issues.
#  scene.verify(data.data.battles['abc'].victor.open_some() == hero2)
#  scene.verify(data.data.battles['abc'].looser.open_some() == hero1)
  scene.verify(data.data.battles['abc'].resolved == False)

  # Anyone can resolve a finished battle

  scene += game.resolve_battle('abc').run(sender=user1)
  scene.verify(data.data.heroes[hero1].battling == False)
  scene.verify(data.data.heroes[hero1].attrs.experience > 0)
  scene.verify(data.data.heroes[hero1].attrs.experience_total > 0)
  scene.verify(data.data.heroes[hero2].battling == False)
  scene.verify(data.data.heroes[hero2].attrs.experience > 0)
  scene.verify(data.data.heroes[hero2].attrs.experience_total > 0)
  scene.verify(data.data.battles['abc'].resolved)
  scene += game.resolve_battle('abc').run(sender=user1, valid=False, exception='Battle already resolved')

  # Cannot challenge same Hero again shortly after

  scene += game.challenge_hero(sp.record(
    challenger=hero1,
    challenged=hero2,
    bid='def',
    mode='loot',
    loot=sp.tez(3)
  )).run(sender=user1, amount=sp.tez(3), valid=False, exception='Cannot challenge same Hero so soon after last battle')
  scene += game.challenge_hero(sp.record(
    challenger=hero2,
    challenged=hero1,
    bid='def',
    mode='loot',
    loot=sp.tez(3)
  )).run(sender=user2, amount=sp.tez(3), valid=False, exception='Cannot challenge same Hero so soon after last battle')

  # Hero can spend their experience points updating their attributes

  scene.verify(data.data.heroes[hero1].attrs.experience == 2)
  scene += game.update_hero_attributes(sp.record(
    uid=hero1,
    attribute='strength',
    points=3 
  )).run(sender=user1, valid=False, exception='Not that many experience points available')
  scene += game.update_hero_attributes(sp.record(
    uid=hero1,
    attribute='strength',
    points=1 
  )).run(sender=user1)
  scene.verify(data.data.heroes[hero1].attrs.strength == 101)
  scene.verify(data.data.heroes[hero1].attrs.experience == 1)
  scene += game.update_hero_attributes(sp.record(
    uid=hero1,
    attribute='health',
    points=1 
  )).run(sender=user1) 
  scene.verify(data.data.heroes[hero1].attrs.health == 121)
  scene.verify(data.data.heroes[hero1].attrs.experience == 0)
  scene += game.update_hero_attributes(sp.record(
    uid=hero1,
    attribute='health',
    points=1 
  )).run(sender=user1, valid=False, exception='Not that many experience points available')

  # Admin can payout platform earnings

  scene.verify(data.balance == sp.mutez(21200000)) # 20 from Hero summons and 1.2 from loot percentage
  scene += game.payout_earnings(sp.tez(30)).run(sender=admin, valid=False, exception='Cannot payout more than total earnings')
  scene += game.payout_earnings(sp.mutez(21200000)).run(sender=admin)
  scene.verify(data.balance == sp.mutez(0))

@sp.add_target(name="Battle timeout", kind=allKind)
def test():
  scene = sp.test_scenario()
  admin = sp.address("tz1-admin")
  user1 = sp.address("tz1-user-1")
  user2 = sp.address("tz1-user-2")
  user3 = sp.address("tz1-user-3")
  token, game, data = init(scene, admin)
  hero1 = sp.pair(token.address, 1)
  hero2 = sp.pair(token.address, 2)
  battle_start_time = 1637752889

  mint(scene, token, admin, 1, user1)
  mint(scene, token, admin, 2, user2)
  operator(scene, token, user1, game.address, 1, 'add_operator')
  operator(scene, token, user2, game.address, 2, 'add_operator')
  scene += game.add_collection(token.address).run(sender=admin)

  # Heroes

  scene += game.summon_hero(sp.record(
    name='Conan',
    token_id=1,
    token_address=token.address,
  )).run(sender=user1, amount=sp.tez(10))
  scene += game.summon_hero(sp.record(
    name='Hulk',
    token_id=2,
    token_address=token.address,
  )).run(sender=user2, amount=sp.tez(10))
  scene += game.update_hero_character(sp.record(
    uid=hero1,
    character=sp.record(
      name='Conan',
      story='',
      battle_ready=True
    )
  )).run(sender=user1)
  scene += game.update_hero_character(sp.record(
    uid=hero2,
    character=sp.record(
      name='Hulk',
      story='',
      battle_ready=True
    )
  )).run(sender=user2)

  # Challenge

  scene += game.challenge_hero(sp.record(
    challenger=hero1,
    challenged=hero2,
    bid='abc',
    mode='loot',
    loot=sp.tez(3)
  )).run(sender=user1, amount=sp.tez(3))
  scene.verify(data.data.battles.contains('abc'))
  scene += game.accept_challenge('abc').run(sender=user2, amount=sp.tez(3), now=sp.timestamp(battle_start_time))

  # Opponent can finish & resolve a battle if turn holder is taking too long with a turn 

  scene += game.execute_battle_turn('abc').run(sender=user2, now=sp.timestamp(battle_start_time+10000))
  scene += game.execute_battle_turn('abc').run(sender=user1, now=sp.timestamp(battle_start_time+20000))
  # It is now user2's turn - he is not taking his turn for 1 week!
  scene += game.resolve_battle('abc').run(sender=user1, now=sp.timestamp(battle_start_time+500000), valid=False, exception='Battle not finished')
  scene += game.resolve_battle('abc').run(sender=user2, now=sp.timestamp(battle_start_time+1000000), valid=False, exception='Only none-turn owner can end battle on timeout')
  scene += game.resolve_battle('abc').run(sender=user3, now=sp.timestamp(battle_start_time+1000000), valid=False, exception='Only none-turn owner can end battle on timeout')
  scene += game.resolve_battle('abc').run(sender=user1, now=sp.timestamp(battle_start_time+1000000))
  scene.verify(data.data.battles['abc'].finished)
  scene.verify(data.data.battles['abc'].resolved)
  scene.verify(data.data.battles['abc'].victor.open_some() == hero1)
  scene.verify(data.data.battles['abc'].looser.open_some() == hero2)
  scene.verify(data.data.heroes[hero1].battling == False)
  scene.verify(data.data.heroes[hero1].attrs.experience > 0)
  scene.verify(data.data.heroes[hero1].attrs.experience_total > 0)
  scene.verify(data.data.heroes[hero2].battling == False)
  scene.verify(data.data.heroes[hero2].attrs.experience > 0)
  scene.verify(data.data.heroes[hero2].attrs.experience_total > 0)
  scene += game.resolve_battle('abc').run(sender=user1, valid=False, exception='Battle already resolved')
  scene.verify(data.balance == sp.mutez(20300000)) # 20 from Hero summons and 0.3 from loot percentage
