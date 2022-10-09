import smartpy as sp
import os

cwd = os.getcwd()
Types = sp.io.import_script_from_url("file://%s/types.py" % cwd)

class ChainBornData(sp.Contract):
  def __init__(
    self,
    admins,
    metadata
  ):
    self.init(
      admins=admins,
      heroes=sp.big_map({}),
      battles=sp.big_map({}),
      earnings=sp.tez(0),
      metadata=metadata,
    )
    self.init_type(sp.TRecord(
      admins=sp.TSet(sp.TAddress),
      heroes=sp.TBigMap(Types.THeroUid, Types.THero),
      battles=sp.TBigMap(sp.TString, Types.TBattle),
      earnings=sp.TMutez,
      metadata=sp.TBigMap(sp.TString, sp.TBytes)
    ))

  ## Utilities
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

  ## Checks
  #

  @sp.private_lambda(with_storage='read-only', wrap_call=True)
  def check_admin(self):
    sp.verify(self.data.admins.contains(sp.sender), 'Only admin can call this entrypoint')

  ## Default
  #

  @sp.entry_point
  def default(self):
    pass

  ## Admin
  #

  @sp.entry_point
  def send(self, receiver, amount):
    self.check_admin()
    sp.send(receiver, amount) 

  @sp.entry_point
  def add_admin(self, admin):
    self.check_admin()
    self.data.admins.add(admin)

  @sp.entry_point
  def del_admin(self, admin):
    self.check_admin()
    self.data.admins.remove(admin)

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

  ## Heroes
  #

  @sp.entry_point
  def add_hero(self, hero):
    self.check_admin()
    sp.set_type(hero, Types.THero)
    uid = sp.pair(hero.token_address, hero.token_id)
    sp.verify(self.data.heroes.contains(uid) == False, 'Hero already exists')
    self.data.heroes[uid] = hero

  @sp.entry_point
  def set_hero(self, hero):
    self.check_admin()
    sp.set_type(hero, Types.THero)
    uid = sp.pair(hero.token_address, hero.token_id)
    self.data.heroes[uid] = hero

  @sp.entry_point
  def del_hero(self, uid):
    self.check_admin()
    sp.set_type(uid, Types.THeroUid)
    del self.data.heroes[uid]

  @sp.onchain_view()
  def get_hero(self, uid):
    sp.set_type(uid, Types.THeroUid)
    sp.verify(self.data.heroes.contains(uid), 'Hero does not exist')
    hero = self.data.heroes[uid] 
    sp.result(hero)

  ## Battles 
  #

  @sp.entry_point
  def add_battle(self, battle):
    self.check_admin()
    sp.set_type(battle, Types.TBattle)
    sp.verify(self.data.battles.contains(battle.bid) == False, 'Battle ID already exists')
    self.data.battles[battle.bid] = battle

  @sp.entry_point
  def set_battle(self, battle):
    self.check_admin()
    sp.set_type(battle, Types.TBattle)
    self.data.battles[battle.bid] = battle

  @sp.entry_point
  def del_battle(self, bid):
    self.check_admin()
    sp.set_type(bid, sp.TString)
    del self.data.battles[bid]

  @sp.onchain_view()
  def get_battle(self, bid):
    sp.set_type(bid, sp.TString)
    sp.verify(self.data.battles.contains(bid), 'No such battle')
    battle = self.data.battles[bid] 
    sp.result(battle)

  ## Earnings
  #

  @sp.entry_point
  def add_earnings(self, earnings):
    self.check_admin()
    self.data.earnings += earnings

  @sp.entry_point
  def set_earnings(self, earnings):
    self.check_admin()
    self.data.earnings = earnings

  @sp.entry_point
  def payout_earnings(self, amount, owners):
    self.check_admin()
    sp.verify(amount <= self.data.earnings, 'Cannot payout more than total earnings')
    sp.set_type(amount, sp.TMutez)
    sp.set_type(owners, sp.TMap(sp.TAddress, sp.TNat))
    sp.for owner in owners.items():
      sp.send(owner.key, sp.split_tokens(amount, owner.value, 100))
    self.data.earnings = self.data.earnings - amount
