import smartpy as sp

FA2 = sp.io.import_script_from_url("https://smartpy.io/dev/templates/FA2.py")

class NFT(FA2.FA2):
  pass

NFT_config = FA2.FA2_config(
  debug_mode                         = False,
  single_asset                       = False,
  non_fungible                       = True,
  add_mutez_transfer                 = False,
  readable                           = True,
  force_layouts                      = True,
  support_operator                   = True,
  assume_consecutive_token_ids       = False,
  store_total_supply                 = True,
  lazy_entry_points                  = False,
  allow_self_transfer                = False,
  use_token_metadata_offchain_view   = False
)

TOKEN_config = FA2.FA2_config(
  debug_mode                         = False,
  single_asset                       = True,
  non_fungible                       = False,
  add_mutez_transfer                 = False,
  readable                           = True,
  force_layouts                      = True,
  support_operator                   = True,
  assume_consecutive_token_ids       = False,
  store_total_supply                 = True,
  lazy_entry_points                  = False,
  allow_self_transfer                = False,
  use_token_metadata_offchain_view   = False
)
