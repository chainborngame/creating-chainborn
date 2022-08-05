import smartpy as sp
import os

cwd = os.getcwd()
Types = sp.io.import_script_from_url("file://%s/types.py" % cwd)

class ChainBornGame(sp.Contract):
  def __init__(
    self,
    admins,
    owners,
    datastore_address,
    randomizer_address,
    metadata
  ):
    self.init(
      admins=admins,
      config=sp.record(
        paused=False,
        summon_cost=sp.tez(10),
        minimum_loot=sp.tez(3),
        hero_health_initial=120,
        hero_strength_initial=100,
        pair_battle_cooldown=86400, # 1 day
        battle_turn_timeout=604800, # 1 week
        battle_experience_min=2,
        battle_experience_max=6,
        platform_loot_percentage=10,
        datastore_address=datastore_address,
        randomizer_address=randomizer_address,
        supported_game_modes=sp.set(['loot', 'both'])
      ),
      collections=sp.set([]),
      metadata=metadata,
    )
    self.init_type(sp.TRecord(
      admins=sp.TSet(sp.TAddress),
      config=Types.TGameConfig,
      collections=sp.TSet(sp.TAddress),
      metadata=sp.TBigMap(sp.TString, sp.TBytes)
    ))

  ## Hero
  #

  @sp.entry_point
  def summon_hero(self, token_id, token_address, name):
    self.check_not_paused()
    self.check_collection(token_address)
    self.check_amount(self.data.config.summon_cost)
    uid = sp.pair(token_address, token_id)

    # Transfer token to datastore (ensures ownership)
    transfer_param = sp.record(
      sender=sp.sender,
      receiver=self.data.config.datastore_address,
      token_address=token_address,
      token_ids=[token_id],
      amount=1
    )
    self.transfer_tokens(transfer_param)

    # Create Hero
    character = sp.record(
      name=name,
      story='',
      battle_ready=True
    )
    attrs = sp.record(
      health=self.data.config.hero_health_initial,
      strength=self.data.config.hero_strength_initial,
      experience=0,
      experience_total=0
    )

    sp.set_type(character, Types.THeroCharacter)
    sp.set_type(attrs, Types.THeroAttributes)
    
    hero = sp.record(
      owner=sp.sender,
      token_id=token_id,
      token_address=token_address,
      summoned=sp.now,
      suited=True,
      battling=False,
      battles=sp.map({}),
      character=character,
      attrs=attrs,
      meta=sp.map({})
    )

    # Add Hero to datastore
    self.add_hero(hero)

    # Update earnings and send to datastore
    self.add_earnings(sp.amount)
    sp.send(self.data.config.datastore_address, sp.amount)