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

~ The ChainBorn Team.
