import smartpy as sp
import json
import os
from datetime import datetime, timezone
env = os.environ

cwd = os.getcwd()
Data = sp.io.import_script_from_url("file://%s/datastore.py" % cwd)
Game = sp.io.import_script_from_url("file://%s/controller.py" % cwd)

admin = sp.address(env['CHAINBORN_ADMIN'])

chainborn_data_metadata = {
  "name": "Chainborn Datastore",
  "description": "Chainborn Datastore",
  "version": "1.0.0",
  "homepage": "https://chainborn.xyz",
  "authors": ["asbjornenge <asbjorn@tezid.net>"],
  "interfaces": ["TZIP-016"]
}

chainborn_game_metadata = {
  "name": "Chainborn Game",
  "description": "Chainborn Game [BETA]",
  "version": "1.2.0",
  "homepage": "https://chainborn.xyz",
  "authors": ["asbjornenge <asbjorn@tezid.net>"],
  "interfaces": ["TZIP-016"]
}

sp.add_compilation_target("data", Data.ChainBornData(
    sp.set([admin]),
    sp.big_map(
      {
        "": sp.utils.bytes_of_string("tezos-storage:content"),
        "content": sp.utils.bytes_of_string(json.dumps(chainborn_data_metadata))
      }
    )
  )
)

sp.add_compilation_target("game", Game.ChainBornGame(
    sp.set([admin]),
    admin,
    admin,
    sp.big_map(
      {
        "": sp.utils.bytes_of_string("tezos-storage:content"),
        "content": sp.utils.bytes_of_string(json.dumps(chainborn_game_metadata))
      }
    )
  )
)
