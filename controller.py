import smartpy as sp
import os

cwd = os.getcwd()
Types = sp.io.import_script_from_url("file://%s/types.py" % cwd)

# TODO: Check for more TODOs

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
        owners=owners,
        summon_cost=sp.tez(10),
        minimum_loot=sp.tez(3),
        hero_health_initial=120,
        hero_strength_initial=100,
        pair_battle_cooldown=604800, # 1 week
        battle_turn_timeout=604800, # 1 week
        battle_experience_min=2,
        battle_experience_max=6,
        platform_loot_percentage=5, 
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

  ## Utility Functions
  #

  @sp.private_lambda(with_storage='read-only', with_operations=True, wrap_call=True)
  def transfer_tokens(self, params):
    sp.set_type(params, Types.TTransferTokensParam)
    txs = sp.local('txs', [])
    sp.for _id in params.token_ids:
      txs.value.push(sp.record(
        to_      = params.receiver,
        token_id = _id,
        amount   = params.amount 
      )) 
    arg = [
      sp.record(
        from_ = params.sender,
        txs = txs.value
      )
    ]

    transferHandle = sp.contract(
      sp.TList(sp.TRecord(from_ = sp.TAddress, txs = sp.TList(sp.TRecord(amount = sp.TNat, to_ = sp.TAddress, token_id = sp.TNat).layout(("to_", ("token_id", "amount")))))), 
      params.token_address,
      entry_point='transfer').open_some()

    sp.transfer(arg, sp.mutez(0), transferHandle)

  @sp.private_lambda(with_storage='read-only', with_operations=True, wrap_call=True)
  def transfer_tokens_from_datastore(self, params):
    sp.set_type(params, Types.TTransferTokensParam)
    c = sp.contract(Types.TTransferTokensParam, self.data.config.datastore_address, entry_point='admin_transfer_tokens').open_some()
    sp.transfer(params, sp.mutez(0), c)

  def get_turn_hero_uid(self, battle):
    turn_hero_uid = sp.local('turn_hero_uid', battle.challenger)
    sp.if battle.turn == battle.challenged:
      turn_hero_uid.value = battle.challenged
    return turn_hero_uid.value

  def get_none_turn_hero_uid(self, battle):
    none_turn_hero_uid = sp.local('none_turn_hero_uid', battle.challenger)
    sp.if battle.turn == battle.challenger:
      none_turn_hero_uid.value = battle.challenged
    return none_turn_hero_uid.value

  def get_battle_experience(self, battle):
    battle_experience = sp.local('battle_experience', 0)
    (quotient, remainder) = sp.match_pair(sp.ediv(battle.loot, self.data.config.minimum_loot).open_some())
    battle_experience.value = quotient
    sp.if quotient > self.data.config.battle_experience_max:
      battle_experience.value = self.data.config.battle_experience_max
    sp.if quotient < self.data.config.battle_experience_min:
      battle_experience.value = self.data.config.battle_experience_min
    return battle_experience.value

  ## Datastore Hero interaction
  #

  @sp.private_lambda(with_storage='read-only', with_operations=True, wrap_call=True)
  def add_hero(self, hero):
    c = sp.contract(Types.THero, self.data.config.datastore_address, entry_point='add_hero').open_some()
    sp.transfer(hero, sp.mutez(0), c)

  @sp.private_lambda(with_storage='read-only', with_operations=True, wrap_call=True)
  def set_hero(self, hero):
    c = sp.contract(Types.THero, self.data.config.datastore_address, entry_point='set_hero').open_some()
    sp.transfer(hero, sp.mutez(0), c)

  @sp.private_lambda(with_storage='read-only', with_operations=True, wrap_call=True)
  def get_hero(self, uid):
    hero = sp.view('get_hero', self.data.config.datastore_address, uid, Types.THero).open_some('Invalid view')
    sp.result(hero)

  ## Datastore Battle interaction
  #

  @sp.private_lambda(with_storage='read-only', with_operations=True, wrap_call=True)
  def add_battle(self, battle):
    c = sp.contract(Types.TBattle, self.data.config.datastore_address, entry_point='add_battle').open_some()
    sp.transfer(battle, sp.mutez(0), c)

  @sp.private_lambda(with_storage='read-only', with_operations=True, wrap_call=True)
  def set_battle(self, battle):
    c = sp.contract(Types.TBattle, self.data.config.datastore_address, entry_point='set_battle').open_some()
    sp.transfer(battle, sp.mutez(0), c)

  @sp.private_lambda(with_storage='read-only', with_operations=True, wrap_call=True)
  def del_battle(self, bid):
    c = sp.contract(sp.TString, self.data.config.datastore_address, entry_point='del_battle').open_some()
    sp.transfer(bid, sp.mutez(0), c)

  @sp.private_lambda(with_storage='read-only', with_operations=True, wrap_call=True)
  def get_battle(self, bid):
    battle = sp.view('get_battle', self.data.config.datastore_address, bid, Types.TBattle).open_some('Invalid view')
    sp.result(battle)

  ## Datastore earning interactions
  #

  @sp.private_lambda(with_storage='read-only', with_operations=True, wrap_call=True)
  def add_earnings(self, amount):
    c = sp.contract(sp.TMutez, self.data.config.datastore_address, entry_point='add_earnings').open_some()
    sp.transfer(amount, sp.mutez(0), c)

  def send_from_datastore(self, receiver, amount):
    c = sp.contract(sp.TRecord(receiver=sp.TAddress, amount=sp.TMutez), self.data.config.datastore_address, entry_point='send').open_some()
    sp.transfer(sp.record(receiver=receiver, amount=amount), sp.mutez(0), c)

  ## Checks
  #

  @sp.private_lambda(with_storage='read-only', wrap_call=True)
  def check_admin(self):
    sp.verify(self.data.admins.contains(sp.sender), 'Only admin can call this entrypoint')

  @sp.private_lambda(with_storage='read-only', wrap_call=True)
  def check_not_paused(self):
    sp.verify(self.data.config.paused != True, 'Game paused')

  @sp.private_lambda(with_storage='read-only', wrap_call=True)
  def check_amount(self, amount):
    sp.verify(sp.amount >= amount, 'Amount too low')

  @sp.private_lambda(with_storage='read-only', wrap_call=True)
  def check_collection(self, collection):
    sp.verify(self.data.collections.contains(collection), 'Collection not supported')

  ## Default
  #

  @sp.entry_point
  def default(self):
    pass

  ## Admin entrypoints
  #

  @sp.entry_point
  def send(self, receiver, amount):
    self.check_admin()
    sp.send(receiver, amount) 

  @sp.entry_point
  def admin_transfer_tokens(self, sender, receiver, token_address, token_ids, amount):
    self.check_admin()
    self.transfer_tokens(sp.record(
      sender=sender, 
      receiver=receiver, 
      token_address=token_address,
      token_ids=token_ids, 
      amount=amount
    ))

  @sp.entry_point
  def add_admin(self, admin):
    self.check_admin()
    self.data.admins.add(admin)

  @sp.entry_point
  def del_admin(self, admin):
    self.check_admin()
    self.data.admins.remove(admin)

  @sp.entry_point
  def add_collection(self, collection):
    self.check_admin()
    self.data.collections.add(collection)

  @sp.entry_point
  def del_collection(self, collection):
    self.check_admin()
    self.data.collections.remove(collection)

  @sp.entry_point
  def set_config(self, config):
    self.check_admin()
    self.data.config = config

  @sp.entry_point
  def payout_earnings(self, amount):
    self.check_admin()
    c = sp.contract(sp.TRecord(amount=sp.TMutez, owners=sp.TMap(sp.TAddress, sp.TNat)), self.data.config.datastore_address, entry_point='payout_earnings').open_some()
    sp.transfer(sp.record(amount=amount, owners=self.data.config.owners), sp.mutez(0), c)

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
      items=[],
      meta=sp.map({})
    )

    # Add Hero to datastore
    self.add_hero(hero)

    # Update earnings and send to datastore
    self.add_earnings(sp.amount)
    sp.send(self.data.config.datastore_address, sp.amount) 

  @sp.entry_point
  def update_hero_character(self, uid, character):
    self.check_not_paused()
    sp.set_type(uid, Types.THeroUid) 
    sp.set_type(character, Types.THeroCharacter) 
    hero = self.get_hero(uid) 
    sp.verify(hero.owner == sp.sender, 'Only owner can update hero')
    sp.verify(hero.suited, 'Hero not suited')
    sp.verify(hero.battling == False, 'Hero battling')
    local_hero = sp.local('local_hero', hero)
    local_hero.value.character = character
    self.set_hero(local_hero.value)

  @sp.entry_point
  def update_hero_attributes(self, uid, attribute, points):
    self.check_not_paused()
    sp.set_type(uid, Types.THeroUid) 
    sp.set_type(attribute, sp.TString)
    sp.set_type(points, sp.TNat)
    hero = self.get_hero(uid) 
    sp.verify(hero.owner == sp.sender, 'Only owner can update hero')
    sp.verify(hero.suited, 'Hero not suited')
    sp.verify(hero.battling == False, 'Hero battling')
    sp.verify(sp.set(['health', 'strength']).contains(attribute), 'Unsupported attribute')
    local_hero = sp.local('local_hero', hero)
    local_hero.value.attrs.experience = sp.as_nat(hero.attrs.experience - points, 'Not that many experience points available')
    sp.if attribute == 'health':
      local_hero.value.attrs.health += points
    sp.if attribute == 'strength':
      local_hero.value.attrs.strength += points
    self.set_hero(local_hero.value)

  @sp.entry_point
  def unsuit(self, uid):
    self.check_not_paused()
    sp.set_type(uid, Types.THeroUid) 
    hero = self.get_hero(uid) 
    sp.verify(hero.owner == sp.sender, 'Only owner can unsuit')
    sp.verify(hero.battling == False, 'Hero is battling')
    # Transfer token to owner
    transfer_param = sp.record(
      sender=self.data.config.datastore_address, 
      receiver=sp.sender, 
      token_address=hero.token_address,
      token_ids=[hero.token_id],
      amount=1
    )
    self.transfer_tokens_from_datastore(transfer_param)
    # Update Hero
    local_hero = sp.local('local_hero', hero)
    local_hero.value.suited = False
    self.set_hero(local_hero.value)

  @sp.entry_point
  def suit_up(self, uid):
    self.check_not_paused()
    sp.set_type(uid, Types.THeroUid) 
    hero = self.get_hero(uid) 
    # Transfer token to game (ensures ownership) 
    transfer_param = sp.record(
      sender=sp.sender, 
      receiver=self.data.config.datastore_address, 
      token_address=hero.token_address,
      token_ids=[hero.token_id],
      amount=1
    )
    self.transfer_tokens(transfer_param)
    # Update Hero
    local_hero = sp.local('local_hero', hero)
    local_hero.value.owner = sp.sender 
    local_hero.value.suited = True
    self.set_hero(local_hero.value)

  ## Battle
  #

  @sp.entry_point
  def challenge_hero(self, challenger, challenged, bid, mode, loot):
    self.check_not_paused()
    sp.set_type(bid, sp.TString)
    sp.set_type(mode, sp.TString)
    sp.set_type(loot, sp.TMutez)
    sp.set_type(challenger, Types.THeroUid) 
    sp.set_type(challenged, Types.THeroUid) 
    # TODO: bid constraints ? 8 chars?
    challenger_hero = self.get_hero(challenger) 
    challenged_hero = self.get_hero(challenged)
    sp.verify(challenger_hero.owner == sp.sender, 'Only owner can challenge')
    sp.verify(self.data.config.supported_game_modes.contains(mode), 'Unsupported game mode')

    # Check minimum loot & send to datastore
    sp.verify(loot >= self.data.config.minimum_loot, 'Not enough loot')
    self.check_amount(loot)
    sp.send(self.data.config.datastore_address, loot)

    # Check challenger status
    sp.verify(challenger_hero.character.battle_ready, 'Challenger is not battle-ready')

    # Check challenged status
    sp.verify(challenged_hero.character.battle_ready, 'Challenged is not battle-ready')
    sp.if challenged_hero.battles.contains(challenger):
      latest_pair_battle = challenged_hero.battles[challenger].latest
      diff = sp.now - latest_pair_battle 
      sp.if diff <= self.data.config.pair_battle_cooldown:
        sp.failwith('Cannot challenge same Hero so soon after last battle') 

    battle = sp.record(
      bid=bid,
      victor=sp.none,
      looser=sp.none,
      challenger=challenger,
      challenged=challenged,
      challenger_damage=0,
      challenged_damage=0,
      started=False,
      finished=False,
      resolved=False,
      mode=mode,
      loot=loot,
      turn=challenged,
      turns=sp.record(
        latest=sp.none,
        turns=sp.list([])
      ),
      challenge_time=sp.now,
      start_time=sp.none,
      finish_time=sp.none,
      experience_gained=0
    )
    sp.set_type(battle, Types.TBattle)
    self.add_battle(battle)

  @sp.entry_point
  def accept_challenge(self, bid):
    self.check_not_paused()
    sp.set_type(bid, sp.TString)
    battle = self.get_battle(bid)
    sp.verify(battle.started == False, 'Battle already started')
    sp.verify(battle.finished == False, 'Battle already finished')
    challenger = battle.challenger
    challenged = battle.challenged
    challenger_hero = self.get_hero(challenger)
    challenged_hero = self.get_hero(challenged)
    sp.verify(challenged_hero.owner == sp.sender, 'Caller is not owner of challenged Hero')
    sp.verify(challenged_hero.battling == False, 'Challenged Hero currently battling')
    sp.verify(challenged_hero.suited, 'Challenged Hero not suited')
    sp.verify(challenged_hero.character.battle_ready, 'Challenged Hero not battle-ready')
    sp.verify(challenger_hero.battling == False, 'Challenger currently battling')
    sp.verify(challenger_hero.suited, 'Challenger not suited')
    sp.verify(challenger_hero.character.battle_ready, 'Challenger not battle ready')

    # Check matched loot
    self.check_amount(battle.loot)
    sp.send(self.data.config.datastore_address, battle.loot)

    # Update Heroes
    local_challenger_hero = sp.local('local_challenger_hero', challenger_hero)
    local_challenged_hero = sp.local('local_challenged_hero', challenged_hero)
    local_challenger_hero.value.battling = True
    local_challenged_hero.value.battling = True 
    sp.if challenger_hero.battles.contains(challenged) == False:
      local_challenger_hero.value.battles[challenged] = sp.record(
        latest=sp.now,
        battles=sp.set([])
      )
    local_challenger_hero.value.battles[challenged].latest = sp.now
    local_challenger_hero.value.battles[challenged].battles.add(bid)
    sp.if challenged_hero.battles.contains(challenger) == False:
      local_challenged_hero.value.battles[challenger] = sp.record(
        latest=sp.now,
        battles=sp.set([])
      )
    local_challenged_hero.value.battles[challenger].latest = sp.now
    local_challenged_hero.value.battles[challenger].battles.add(bid)
    self.set_hero(local_challenger_hero.value)
    self.set_hero(local_challenged_hero.value)

    # Update Battle
    local_battle = sp.local('local_battle', battle)
    coinflip = sp.view('getRandomBetween', self.data.config.randomizer_address, sp.record(_from=sp.nat(0), _to=sp.nat(1)), sp.TNat).open_some('Invalid view getRandomBetween')
    sp.if coinflip == 0:
      local_battle.value.turn = challenger
    sp.else:
      local_battle.value.turn = challenged
    local_battle.value.start_time = sp.some(sp.now)
    local_battle.value.turns.latest = sp.some(sp.now) # Setting so battle can be resolved from inactivity if not turn is ever taken 
    local_battle.value.started = True 
    self.set_battle(local_battle.value)

  @sp.entry_point
  def cancel_challenge(self, bid):
    self.check_not_paused()
    sp.set_type(bid, sp.TString)
    battle = self.get_battle(bid)
    sp.verify(battle.started == False, 'Battle already started')
    sp.verify(battle.finished == False, 'Battle already finished')
    challenger = battle.challenger
    challenged = battle.challenged
    challenger_hero = self.get_hero(challenger)
    challenged_hero = self.get_hero(challenged)
    sp.verify(challenger_hero.owner == sp.sender, 'Only the owner of challenger Hero can cancel')

    # Return loot 
    self.send_from_datastore(sp.sender, battle.loot) 

    # Remove battle entry
    self.del_battle(bid)

  @sp.entry_point
  def execute_battle_turn(self, bid):
    self.check_not_paused()
    sp.set_type(bid, sp.TString)
    battle = self.get_battle(bid)
    sp.verify(battle.started == True, 'Battle not started')
    sp.verify(battle.finished == False, 'Battle is finished')
    challenger = battle.challenger
    challenged = battle.challenged
    challenger_hero = self.get_hero(challenger)
    challenged_hero = self.get_hero(challenged)

    turn_hero_uid = self.get_turn_hero_uid(battle) 
    turn_hero = self.get_hero(turn_hero_uid)
    sp.verify(turn_hero.owner == sp.sender, 'Not your turn')

    # Calculate damage 
    _min = sp.nat(0)
    _max = turn_hero.attrs.strength
    arg = sp.record(_from=_min, _to=_max)
    damage = sp.view('getRandomBetween', self.data.config.randomizer_address, arg, sp.TNat).open_some('Invalid view getRandomBetween')

    # Local mutable battle
    local_battle = sp.local('local_battle', battle)
    _battle = local_battle.value

    # Store turn 
    turn = sp.record(hero=turn_hero_uid, damage=damage, timestamp=sp.now)
    _battle.turns.latest = sp.some(sp.now)
    _battle.turns.turns.push(turn)

    # Handle turn outcome
    sp.if battle.turn == challenger:
      _battle.challenged_damage += damage
      sp.if _battle.challenged_damage >= challenged_hero.attrs.health:
        _battle.finish_time = sp.some(sp.now)
        _battle.finished = True
      _battle.turn = challenged
    sp.else:
      _battle.challenger_damage += damage
      sp.if _battle.challenger_damage >= challenger_hero.attrs.health:
        _battle.finish_time = sp.some(sp.now)
        _battle.finished = True
      _battle.turn = challenger

    # Update battle in datastore
    self.set_battle(_battle)

  @sp.entry_point
  def resolve_battle(self, bid):
    self.check_not_paused()
    sp.set_type(bid, sp.TString)
    battle = self.get_battle(bid) 
    sp.verify(battle.started == True, 'Battle not started')
    local_battle = sp.local('local_battle', battle)
    _battle = local_battle.value
    turn_hero_uid = self.get_turn_hero_uid(battle)
    none_turn_hero_uid = self.get_none_turn_hero_uid(battle)
    none_turn_hero = self.get_hero(none_turn_hero_uid)
    _battle.victor = sp.some(none_turn_hero_uid)
    _battle.looser = sp.some(turn_hero_uid)

    # If long time since last turn, we can resolve without battle.finish == True
    last_turn_timestamp = battle.turns.latest.open_some(message='Latest turn timestamp not set')
    diff = sp.now - last_turn_timestamp 
    sp.if diff <= self.data.config.battle_turn_timeout:
      sp.verify(battle.finished == True, 'Battle not finished')
    sp.else:
      sp.verify(none_turn_hero.owner == sp.sender, 'Only none-turn owner can end battle on timeout')

    sp.verify(battle.resolved == False, 'Battle already resolved')
    victor = _battle.victor.open_some(message='Victor not set')
    victor_hero = self.get_hero(victor)
    looser = _battle.looser.open_some(message='Looser not set')
    looser_hero = self.get_hero(looser)
    # NOTE: Anyone can resolve a battle - no need to check sp.sender

    # Init local mutable Heroes
    local_victor_hero = sp.local('local_victor_hero', victor_hero)
    local_looser_hero = sp.local('local_looser_hero', looser_hero)

    # Experience 
    #arg = sp.record(_from=self.data.config.battle_experience_min, _to=battle_experience_max)
    #xp_victor = sp.view('getRandomBetween', self.data.config.randomizer_address, arg, sp.TNat).open_some('Invalid view getRandomBetween')
    xp_victor = self.get_battle_experience(battle)
    xp_looser = xp_victor // 2

    # Calculate loot & earnings 
    loot_total = sp.mul(2, battle.loot)
    heroes_percentage = sp.as_nat(100 - self.data.config.platform_loot_percentage, 'Negative heroes_percentage not allowed')
    hero_amount = sp.split_tokens(battle.loot, heroes_percentage, 100)
    heroes_amount = sp.split_tokens(loot_total, heroes_percentage, 100)
    platform_amount = sp.split_tokens(loot_total, self.data.config.platform_loot_percentage, 100)

    # Handle loot mode
    sp.if battle.mode == 'loot':
      self.send_from_datastore(victor_hero.owner, heroes_amount)

    # Handle hero mode (this mode is currently disabled)
    #sp.if battle.mode == 'hero':
    #  self.send_from_datastore(looser_hero.owner, hero_amount)
    #  self.send_from_datastore(victor_hero.owner, hero_amount)
    #  local_looser_hero.value.owner = victor_hero.owner

    # Handle both mode
    sp.if battle.mode == 'both':
      self.send_from_datastore(victor_hero.owner, heroes_amount)
      local_looser_hero.value.owner = victor_hero.owner

    # Update heroes
    local_victor_hero.value.battling = False
    local_victor_hero.value.attrs.experience += xp_victor
    local_victor_hero.value.attrs.experience_total += xp_victor
    local_looser_hero.value.battling = False
    local_looser_hero.value.attrs.experience += xp_looser
    local_looser_hero.value.attrs.experience_total += xp_looser
    self.set_hero(local_victor_hero.value)
    self.set_hero(local_looser_hero.value)

    # Update battle
    _battle.finished = True # Setting finished in case resolve from inactivity
    _battle.resolved = True
    _battle.experience_gained = xp_victor
    self.set_battle(_battle)

    # Update earnings 
    self.add_earnings(platform_amount)

