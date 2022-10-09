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

~ The ChainBorn Team.
