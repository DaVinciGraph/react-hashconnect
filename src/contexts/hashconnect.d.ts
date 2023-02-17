import { HashConnect, HashConnectTypes } from "hashconnect"
import { HashConnectConnectionState } from "hashconnect/dist/esm/types"
import { Dispatch, SetStateAction } from "react"

export type HashConnectContent = {
    hcData: object,
    topic: string,
    setTopic: Function,
    clearPairings: Function,
    pairingString: string,
    pairingData: HashConnectTypes.SavedPairingData | null,
    availableExtension: HashConnectTypes.WalletMetadata | null,
    state: HashConnectConnectionState,
    hashconnect: HashConnect | null
    connectToExtension: Function,
    clearPairings: Function,
    disconnect: Function,
    sendTransaction: Function,
    showMessage: Function
}