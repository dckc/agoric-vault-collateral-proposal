NODE=${NODE:-https://devnet.rpc.agoric.net:443}
WALLET=${WALLET:-dev-local}
CHAIN_ID=${CHAIN_ID:-agoricdev-20}

install_bundle() {
  bfile=$1
  bid=$(echo $bfile | sed -e 's,^bundles/,,' | sed -e 's,.json$,,')
  found=$(agd --node=$NODE query vstorage data swingStore.bundle.$bid -o json | jq -r .value)
  if [[ -n "$found" ]]; then
    echo "bundle $bid already installed"
    return
  fi
  agd tx swingset install-bundle "@$1" \
    --node $NODE \
    --from $WALLET --keyring-backend=test --gas=auto \
    --chain-id=$CHAIN_ID -bblock --yes -o json
}

for b in bundles/b1-*; do
  install_bundle $b
done
