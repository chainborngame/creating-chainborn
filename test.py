import smartpy as sp
import os

cwd = os.getcwd()

Game = sp.io.import_script_from_url("file://%s/controller.py" % cwd)
Data = sp.io.import_script_from_url("file://%s/datastore.py" % cwd)
Types = sp.io.import_script_from_url("file://%s/types.py" % cwd)
Tokens = sp.io.import_script_from_url("file://%s/tokens.py" % cwd)
Randomizer = sp.io.import_script_from_url("https://ipfs.infura.io/ipfs/QmPNkabMCpDmFE6GynfS9UAoQDLE6PyCLpRJQmceEp2oTv")

## Metadata
#

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

## Init function
#

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
    datastore_address=data.address,
    randomizer_address=randomizer.address,
    metadata=gameContractMeta
  )
  scene += game
  scene += data.add_admin(game.address).run(sender=admin)

  return token, game, data

## Tests
#

@sp.add_target(name="Admin", kind="all")
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

  # Admin can set game config

  scene.verify(game.data.config.paused == False)
  scene.verify(game.data.config.summon_cost == sp.tez(10))
  config = sp.record(
    paused=True,
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
  
  