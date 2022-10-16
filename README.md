# Creating ChainBorn

This is the repository accompanying the blogpost [Creating ChainBorn](https://medium.com/chainborn/creating-chainborn-fce259fde45d) with all the example code and scripts.

These examples and the accompanying blogpost have been submitted against the ["Hello world" Reference Game](https://tezos.foundation/bounty-program/) bounty from the Tezos Foundation.

We really hope you enjoy the article and sample code and hope you find it useful!

# Install SmartPy

We start the process my installing SmartPy using the `init-env.sh` script.

```
./init-env.sh
```

Activate the vritualenv and check that the `spy` (smartpy) command exists.

```
source bin/activate
spy --version
```

# Run the tests

Let's verify all our tests are passing.

```
spy kind all tests.py output --html --stop-on-error
```

Give it some time to finish. If we get noe output that means all tests are passing and we are ready to compile the contracts. 

# Compile the contracts

First, edit the `compile.py` file replacing `admin` with your Tezos address.

```
spy compile compile.py compiled
```

# Originate the contracts (on ghostnet)

We can now originate the contracts on [ghostnet](https://teztnets.xyz/).

```
spy originate-contract --code compiled/datastore/step_000_cont_0_contract.tz --storage compiled/datastore/step_000_cont_0_storage.tz --rpc https://ghostnet.smartpy.io
[INFO] - Using RPC https://ghostnet.smartpy.io...
[INFO] - Contract KT1J5wddYxtFehL7iNgYGE1sSEzptbXBUoch originated!!!
spy originate-contract --code compiled/controller/step_000_cont_0_contract.tz --storage compiled/controller/step_000_cont_0_storage.tz --rpc https://ghostnet.smartpy.io
[INFO] - Using RPC https://ghostnet.smartpy.io...
[INFO] - Contract KT1Vope8at5KLwtJrzgLBmRYnSzfdLu3w63w originated!!!
```

Your contract addresses will differ. Now you can head over to [Better Call Dev](https://better-call.dev/) and you can administer them from there. Copy the address from the cli and paste on BCD to find them.

# Prepare the contracts

## Set the controller as admin on the datastore

On BCD for the datastore contract, find the "interact" tab, select the `add_admin` entrypoint to set the controller as an admin.

![Add Admin](screenshots/add_admin.png?raw=true "Add Admin")

## Update controller config 

We need to set the correct `datastore_address` and `randomizer_address` on the controller. It's perhaps better to make a script for this since the config has many variable and we need to set the all in one go, but for now we can do this also via BCD. For the `datastore_address` use the address for the datastore contract you originated above. For the `randomizer_address` use `KT1Ls4XzMgz59Z2UxRroAtrQ8gN8c5AWeV9B`. Make sure all the other config options are the same as they are currently (or modify to your liking).

![Set Config](screenshots/set_config.png?raw=true "Set Config")

Now we could actually play the game via BCD, just calling entrypoints with parameters, but a nice user interface is what we want.

# Index the contract data

To drive our user interface we want a good way to fetch all the relevant data we want, in a format suitable for the frontend. To achieve this we create what we call an "index". We put all the on-chain data in a database in a format we can better use to drive our UI. We will be using [PostgreSQL](https://www.postgresql.org/) as our database and [Hasura](https://hasura.io/) as our API layer.

## Prepare the database

First let's start the postgresql database and prepare the database.

```
# Start postgres (see file for password)
./startPostgresql.sh

# Create the database
psql -h localhost -U postgres
postgres=# create database chainborn;
CREATE DATABASE

# Load the schema
psql -h localhost -U postgres -d chainborn < schema.sql
```

## Start the game indexer

The indexer is a small [node.js](https://nodejs.org/en/) application that reads the data from [tzkt](https://tzkt.io/) and indexes data into your local database.
**NB!!** Edit config.js and replace CHAINBORN_CONTRACT and CHAINBORN_DATASTORE with your respective contract addresses.

```
cd indexer
npm install 
npm start
> chainborn-indexer@1.0.0 start
> node index.js

-------
Updated config and contract storage for ghostnet
Heroes updates 0
Cancelled Battles 0
New Battles 0
Update Battles 0
```

This application runs on an interval and will continouly index any data it finds.

## Start the collection indexer

In addition to tracking the game data, we also need to keep track of the NFT collections our game will support. We need to track ownership and index their metadata. The indexer already supports this if we set the COLLECTION_INDEXER environment variable. Creating an NFT collection on ghostnet is a bit out of scope for this tutorial. But I have created one that you can use; KT1T2uj45Usw7iyrfu7wfsvFhr9VN8ZHCyb8. Feel free to reach out if you want me to mint a few NFTs for you here. 

So in a new terminal do this:

```
cd indexer
export COLLECTION_INDEXER=KT1T2uj45Usw7iyrfu7wfsvFhr9VN8ZHCyb8
npm start
> chainborn-indexer@1.0.0 start
> node index.js

-------
Total amount of tokens to update: 20. Processing 1000...
Synced collection KT1T2uj45Usw7iyrfu7wfsvFhr9VN8ZHCyb8; 20 updates, 1 batches
```

This will index NFTs and their metadata into the `heroes` table.

## Start Hasura

Our indexed data is still only in the database. Now we need to expose it via an API.

```
./startHasura.sh
```

Now you can open http://localhost:8081/console in your favourite browser.

Navigate to DATA, select the "public" schema on the default database. Tap "Track" for all our tables.

![Hasura](screenshots/hasura.png?raw=true "Hasura")

# Start the app

Finally we are ready to have all these pieces culminate into an application.

```
cd app
npm install
npm start
```

Navigate to http://localhost:3000 and see the applications live! Connect your wallent and see you can summon a Hero.

![App](screenshots/app.png?raw=true "App")

Before you can actually summon a Hero, your contract is missing one last piece. Can you figure out what that is? TIP: See the error message when trying to summon.

The ghostnet version of the game is also available online here: https://ghost.chainborn.xyz

The mainnet version of the game (more advanced version) is available here: https://chainborn.xyz

You can find a playing tutorial here: https://medium.com/chainborn/getting-started-3453635a1c27
FAQ: https://ghost.chainborn.xyz/faq

Enjoy! :sparkling_heart:

~ The ChainBorn Team.
