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
B1=bundles/b1-1c8e93cc80b28b2cf6b1252e9b6edb0253a1f962889f8a255397b43984950a263dd9c9efd82aee5744b46e7bd57ff1c733030e9f4dc8da9b355b185a59687862.json
B2=bundles/b1-8fb229296073327ed26d2a1ac56eda2bdc70c99d68621895a88f6cc09bce2defa3bd0894e97950e5a0696388193279c8f6b9399809611f8fec3ef5aeed355ba5.json
B3=bundles/b1-938304530ab413804ba64aa99a73cccb6f2068c285631463f5bd7e6e42dda81bc27fc81a6976ab7907d19d5d0e31ee5a1eaa05bc7234c7d102cc0a0f3a34ff60.json
B4=bundles/b1-e4ba9cb60b5b59d4d4618710991fe8a503dd4a07c7f17029a342ccb41893bc961ae63bcb0e2c20e4bc2415c9755f090f7761751cdd00b85762902b357a48c5cf.json
agd tx swingset install-bundle $B1 --node $NODE --from $WALLET --chain-id $CHAIN_ID
agd tx swingset install-bundle $B2 --node $NODE --from $WALLET --chain-id $CHAIN_ID
agd tx swingset install-bundle $B3 --node $NODE --from $WALLET --chain-id $CHAIN_ID
agd tx swingset install-bundle $B4 --node $NODE --from $WALLET --chain-id $CHAIN_ID
```

### 2. Submit Governance Proposals

```zsh
NODE=https://devnet.rpc.agoric.net:443
WALLET=dev-local
CHAIN_ID=agoricdev-20
agd tx gov submit-proposal swingset-core-eval \
  add-stATOM-permit.json add-stATOM.js \
  add-stATOM-oracles-permit.json add-stATOM-oracles.js \
  --title="Enable stATOM1 Vault" --description="Evaluate add-stATOM.js add-stATOM-oracles" --deposit=1000000ubld \
  --gas=auto --gas-adjustment=1.2 \
  --node $NODE --from $WALLET --chain-id $CHAIN_ID
```

### 3. Query Gov Proposals

```zsh
NODE=https://devnet.rpc.agoric.net:443
WALLET=dev-local
CHAIN_ID=agoricdev-20
agd query gov proposals --node $NODE --chain-id $CHAIN_ID --output json | \
  jq -c '.proposals[] | [.proposal_id,.voting_end_time,.status]';
```

### 4. Vote on Gov Proposal

```zsh
NODE=https://devnet.rpc.agoric.net:443
WALLET=dev-local
CHAIN_ID=agoricdev-20
agd tx gov vote 1 yes --node $NODE --from $WALLET --chain-id $CHAIN_ID
```


## Oracle Steps

Before, ensure an address you control is listed in `oracleAddresses`.

```zsh
cd ~/agoric-sdk
WALLET=dev-local
NODE=https://localhost:26657
WALLET=dev-local
CHAIN_ID=agoriclocal
alias oracle="yarn run --silent agops oracle"

# accept the offer to submit a price
oracle accept --offerId 1 --pair STATOM1.USD > offer-1.json
agoric wallet send --from $WALLET --offer offer-1.json

# push a price
oracle pushPriceRound --price 10 --roundId 1 --oracleAdminAcceptOfferId 1 > price-offer-1.json
agoric wallet send --from $WALLET --offer price-offer-1.json
```


## REPL Validation

```js
// request a loan for 5m uist (the minimum)
E(E(home.agoricNames).lookup('issuer', 'IST')).getBrand()
istBrand = history[n]
fiveMillionUistAmount = { brand: istBrand, value: 5_000_000n}

// find the vault factory instance
E(home.agoricNames).lookup('instance', 'VaultFactory')
vfi = history[n]

// open an ATOM vault
E(E(home.agoricNames).lookup('issuer', 'ATOM')).getBrand()
atomBrand = history[n]
atomPurse = E(home.wallet).getPurse("ATOM")
oneMillionUatomAmount = { brand: atomBrand, value: 1_000_000n}
proposal = { give: { Collateral: oneMillionUatomAmount }, want: { Minted: fiveMillionUistAmount } }
E(atomPurse).withdraw(oneMillionUatomAmount)
pmt = { Collateral: history[n] }
E(E(E(home.zoe).getPublicFacet(vfi)).getCollateralManager(atomBrand)).makeVaultInvitation()
inv = history[n]
E(home.zoe).offer(inv, proposal, pmt)
E(history[n]).getOfferResult() // should provide a VaultSeatKit, or show an error

// open an stATOM vault
E(E(home.agoricNames).lookup('issuer', 'STATOM1')).getBrand()
stAtomBrand = history[n]
stAtomPurse = E(home.wallet).getPurse("stATOM1")
oneMillionUstAtomAmount = { brand: stAtomBrand, value: 1_000_000n}
proposal = { give: { Collateral: oneMillionUstAtomAmount }, want: { Minted: fiveMillionUistAmount } }
E(stAtomPurse).withdraw(oneMillionUstAtomAmount)
pmt = { Collateral: history[n] }
E(E(E(home.zoe).getPublicFacet(vfi)).getCollateralManager(stAtomBrand)).makeVaultInvitation()
inv = history[n]
E(home.zoe).offer(inv, proposal, pmt)
E(history[n]).getOfferResult() // should provide a VaultSeatKit, or show an error
```

## REPL Oracle Validation

```js
E(home.agoricNames).lookup('oracleBrand', 'STATOM1')
E(home.agoricNames).lookup('oracleBrand', 'USD')
stAtomOracleBrand = history[n]
E(home.priceAuthority).makeQuoteNotifier({ value: 10n * 10n ** 6n, brand: stAtomOracleBrand }, usdOracleBrand)
E(qn).getUpdateSince()
```