import smartpy as sp
import os

cwd = os.getcwd()
Types = sp.io.import_script_from_url("file://%s/types.py" % cwd)

class ChainBornDatastore(sp.Contract):
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

  ## Checks
  #

  @sp.private_lambda(with_storage='read-only', wrap_call=True)
  def check_admin(self):
    sp.verify(self.data.admins.contains(sp.sender), 'Only admin can call this entrypoint')

  ## Heroes
  #

  @sp.entry_point
  def set_hero(self, hero):
    self.check_admin()
    sp.set_type(hero, Types.THero)
    uid = sp.pair(hero.token_address, hero.token_id)
    self.data.heroes[uid] = hero
