## Preqrequisites

### 1. Use Proposal Builder to generate Core Eval files

See [inter-protocol/scripts/add-STARS.js](https://github.com/Agoric/agoric-sdk/blob/5a00ae14aedb7d4a5f1e60c4bc9d79814089c99b/packages/inter-protocol/scripts/add-STARS.js) and this npm [script](https://github.com/Agoric/agoric-sdk/blob/5a00ae14aedb7d4a5f1e60c4bc9d79814089c99b/packages/inter-protocol/package.json#L13) for more details.

I have checked in the generated files here for reference.

### 2. Setup wallet

```zsh
# list current keys
agd keys list
# add a new key, with auto-generated mnemonic
agd keys add [dev-local]
# add a new key, with custom mnemonic
agd keys add [dev-local] --interactive
# prints address
agd keys show [dev-local] -a
```

### 3. Request faucet funds

Setup a smart-wallet and request funds here: https://devnet.faucet.agoric.net/, using the address from the previous step.

## Proposal Steps

### 1. Deploy bundles

```zsh
NODE=https://devnet.rpc.agoric.net:443
WALLET=dev-local
CHAIN_ID=agoricdev-20
B1=bundles/b1-3cf6f8499883ff9edc294bf784cb0a93af68829da3b469b6c4a53f33c785c416cdb398169a757cf448a1635a3a6b21ac7881d07f9dd184ff3d6579905f44cb5e.json
B2=bundles/b1-5da781b83f8a3e4e173184e0641a9b95f66aad7c4225a364ef081fd1c124e3c33fc4a04a3dd59eebcf537b3e7944f38429fdbe3713c660b9d272ff4532cf540a.json
B3=bundles/b1-5e23d485ee30dadc1cc78c4df6009466e710bf53d63204f99da96decc50a2997d6afc25df3c0a479e41c7ff46aaa806eb0aaf94c9509c9f4860640ce8b271774.json
B4=bundles/b1-0571491fc026ed1e3ed4346c0a8f6b2d818e5614b8bfe6b4ed6ce9caa5eb9729d21cd7f10f4638c9f3b07ebe8d077678afe023a9e6e4f762dd6159b076310e63.json
agd tx swingset install-bundle $B1 --node $NODE --from $WALLET --chain-id $CHAIN_ID
agd tx swingset install-bundle $B2 --node $NODE --from $WALLET --chain-id $CHAIN_ID
agd tx swingset install-bundle $B3 --node $NODE --from $WALLET --chain-id $CHAIN_ID
agd tx swingset install-bundle $B4 --node $NODE --from $WALLET --chain-id $CHAIN_ID
```

### 2. Submit Vault / Asset Proposal

```zsh
NODE=https://devnet.rpc.agoric.net:443
WALLET=dev-local
CHAIN_ID=agoricdev-20
agd tx gov submit-proposal swingset-core-eval add-stATOM-permit.json add-stATOM.js \
  --title="Enable stATOM Vault" --description="Evaluate add-stATOM.js" --deposit=1000000ubld \
  --gas=auto --gas-adjustment=1.2 \
  --node $NODE --from $WALLET --chain-id $CHAIN_ID
```

### 3. Submit Oracle Proposal

```zsh
NODE=https://devnet.rpc.agoric.net:443
WALLET=dev-local
CHAIN_ID=agoricdev-20
agd tx gov submit-proposal swingset-core-eval add-stATOM-oracles-permit.json add-stATOM-oracles.js \
  --title="Enable stATOM Oracle" --description="Evaluate add-stATOM-oracles.js" --deposit=1000000ubld \
  --gas=auto --gas-adjustment=1.2 \
  --node $NODE --from $WALLET --chain-id $CHAIN_ID
```

### 4. Query Gov Proposals

```zsh
NODE=https://devnet.rpc.agoric.net:443
WALLET=dev-local
CHAIN_ID=agoricdev-20
agd query gov proposals --node $NODE --chain-id $CHAIN_ID --output json | \
  jq -c '.proposals[] | [.proposal_id,.voting_end_time,.status]';
```

### 5. Vote on Gov Proposals

```zsh
NODE=https://devnet.rpc.agoric.net:443
WALLET=dev-local
CHAIN_ID=agoricdev-20
agd tx gov vote 1 yes --node $NODE --from $WALLET --chain-id $CHAIN_ID
agd tx gov vote 2 yes --node $NODE --from $WALLET --chain-id $CHAIN_ID
```
