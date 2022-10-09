import smartpy as sp
import json
import os
from datetime import datetime, timezone
env = os.environ

cwd = os.getcwd()
Datastore = sp.io.import_script_from_url("file://%s/datastore.py" % cwd)
Controller = sp.io.import_script_from_url("file://%s/controller.py" % cwd)

admin = sp.address('tz1UZZnrre9H7KzAufFVm7ubuJh5cCfjGwam')

chainborn_datastore_metadata = {
  "name": "Chainborn Datastore",
  "description": "Chainborn Datastore",
  "version": "1.0.0",
  "homepage": "https://chainborn.xyz",
  "authors": ["asbjornenge <asbjorn@tezid.net>"],
  "interfaces": ["TZIP-016"]
}

chainborn_controller_metadata = {
  "name": "Chainborn Game",
  "description": "Chainborn Game",
  "version": "1.0.0",
  "homepage": "https://chainborn.xyz",
  "authors": ["asbjornenge <asbjorn@tezid.net>"],
  "interfaces": ["TZIP-016"]
}

sp.add_compilation_target("datastore", Datastore.ChainBornData(
    sp.set([admin]),
    sp.big_map(
      {
        "": sp.utils.bytes_of_string("tezos-storage:content"),
        "content": sp.utils.bytes_of_string(json.dumps(chainborn_datastore_metadata))
      }
    )
  )
)

sp.add_compilation_target("controller", Controller.ChainBornGame(
    sp.set([admin]),
    sp.map({
      admin: 100
    }),
    admin,
    admin, 
    sp.big_map(
      {
        "": sp.utils.bytes_of_string("tezos-storage:content"),
        "content": sp.utils.bytes_of_string(json.dumps(chainborn_controller_metadata))
      }
    )
  )
)
