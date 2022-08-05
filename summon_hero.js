export async function summonHero({ dappAddress, walletAddress, tokenAddress, tokenId, name, cost }) {
  const tokenContract = await Tezos.wallet.at(tokenAddress)
  const dappContract = await Tezos.wallet.at(dappAddress)

  const batchOp = await Tezos.wallet.batch([
    {
      kind: OpKind.TRANSACTION,
      ...tokenContract.methods.update_operators([
        {
          add_operator: {
            owner: walletAddress,
            operator: dappAddress,
            token_id: tokenId
          }
        }
      ]).toTransferParams()
    },
    {
      kind: OpKind.TRANSACTION,
      ...dappContract.methods.summon_hero(
        name,
        tokenAddress,
        tokenId
      ).toTransferParams(),
      amount: cost
    },
    {
      kind: OpKind.TRANSACTION,
      ...tokenContract.methods.update_operators([
        {
          remove_operator: {
            owner: walletAddress,
            operator: dappAddress,
            token_id: tokenId
          }
        }
      ]).toTransferParams()
    },
  ])
  const batch = await batchOp.send()
  await batch.confirmation()
}