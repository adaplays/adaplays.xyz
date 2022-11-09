import { Blockfrost, Lucid, WalletApi } from "lucid-cardano"
import { SupportedWallets } from "types/types"

export const getApi = async (walletName: SupportedWallets) => {
  let api: WalletApi | null = null
  switch (walletName) {
    case "nami": {
      api = await window.cardano.nami.enable();
      break;
    }
    case "eternl": {
      api = await window.cardano.eternl.enable();
      break;
    }
  }
  return api
}

export const getLucid = async (walletName: SupportedWallets) => {
  const api: WalletApi = await getApi(walletName)
  const lucid = await Lucid.new(
    new Blockfrost("/api/blockfrost/0", ""),  // project-id header will be set by redirect
    "Preprod"
  )
  lucid.selectWallet(api)
  return lucid
}
