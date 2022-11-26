import { Blockfrost, Lucid, WalletApi, UTxO, Script, Address, Data, PlutusData, Constr } from "lucid-cardano"
import { SupportedWallets } from "types/types"

export const getApi = async (walletName: SupportedWallets) => (await window.cardano[walletName].enable())


export const getLucid = async (walletName: SupportedWallets) => {
  const api: WalletApi = await getApi(walletName)
  const lucid = await Lucid.new(
    new Blockfrost("/api/blockfrost/0", ""),  // project-id header will be set by redirect
    "Preprod"
  )
  lucid.selectWallet(api)
  return lucid
}

// Aim is to get the utxo with least number of assets and most lovelaces.
export const getDesiredUtxo = async (lucid: Lucid) => {
  const playerAAdress = await lucid.wallet.address()
  const aUtxos = await lucid.utxosAt(playerAAdress)
  if (aUtxos.length === 0) {
    throw "Wallet is empty!"
  } else {
    let desiredUtxo: UTxO = aUtxos[0]
    let currentDesiredAssetsLen = Object.keys(desiredUtxo.assets).length
    for (let i = 1; i < aUtxos.length; i++) {
      let currentAssetsLen = Object.keys(aUtxos[i].assets).length
      if (currentAssetsLen > currentDesiredAssetsLen) continue;
      if (currentAssetsLen === currentDesiredAssetsLen && aUtxos[i].assets['lovelace'] > desiredUtxo.assets['lovelace']) {
        desiredUtxo = aUtxos[i]
        continue
      } else if (currentAssetsLen < currentDesiredAssetsLen) {
        currentDesiredAssetsLen = currentAssetsLen
        desiredUtxo = aUtxos[i]
      }
    }
    return desiredUtxo
  }
}

export const addScript = async (lucid: Lucid, address: Address, script: Script) => {
  const tx = await lucid
    .newTx()
    .payToContract(address, { asHash: Data.empty(), scriptRef: script}, {})
    .complete()
  const signedTx = await tx.sign().complete()
  return (await signedTx.submit())  // returning txHash
}

export const getConstr = (data: PlutusData): Constr<PlutusData>  => {
  if (data instanceof Constr<PlutusData>) {
    return data
  } else {
    throw "Not of type Constr<PlutusData>"
  }
}
