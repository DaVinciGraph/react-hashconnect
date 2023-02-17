import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/types";
import { HashConnectContent } from "./hashconnect.d";
import Message from "../components/general/message";


const HashConnectContext = createContext<HashConnectContent>({
    hcData: {},
    topic: '',
    setTopic: () => { },
    pairingString: "",
    pairingData: null,
    availableExtension: null,
    hashconnect: null,
    state: HashConnectConnectionState.Disconnected,
    sendTransaction: () => { },
    connectToExtension: () => { },
    clearPairings: () => { },
    disconnect: () => { },
    showMessage: () => { }
});

const hashconnect = new HashConnect(true);

export default function HashConnectProvider({ children }: PropsWithChildren) {

    const [hcData, setHcData] = useState<object>(hashconnect.hcData);
    const [topic, setTopic] = useState('');
    const [pairingString, setPairingString] = useState("");
    const [pairingData, setPairingData] = useState<HashConnectTypes.SavedPairingData | null>(null);
    const [availableExtension, setAvailableExtension] = useState<HashConnectTypes.WalletMetadata>({
        name: "",
        description: "",
        icon: ""
    });
    const appMetadata: HashConnectTypes.AppMetadata = {
        name: "dApp Example",
        description: "An example hedera dApp",
        icon: "https://www.hashpack.app/img/logo.svg",
        url: "http://localhost:3000"
    }

    const [state, setState] = useState(HashConnectConnectionState.Disconnected);

    const [message, setMessage] = useState('');

    useEffect(() => {
        init();
    }, []);

    hashconnect.connectionStatusChangeEvent.on((data: any) => {
        setState(data);
        setHcData(hashconnect.hcData);
    });

    const init = async () => {
        //register events
        setUpHashConnectEvents();

        //initialize and use returned data
        let initData = await hashconnect.init(appMetadata, "testnet", false);

        setTopic(initData.topic);
        setPairingString(initData.pairingString);

        //Saved pairings will return here, generally you will only have one unless you are doing something advanced
        setPairingData(initData.savedPairings[0]);
    }

    const setUpHashConnectEvents = () => {
        //This is fired when a extension is found
        hashconnect.foundExtensionEvent.on((data) => {
            console.log("Found extension", data);
            setAvailableExtension(data);
        })

        //This is fired when a wallet approves a pairing
        hashconnect.pairingEvent.on((data) => {
            console.log("Paired with wallet", data);

            setPairingData(data.pairingData!);
        });

        //This is fired when HashConnect loses connection, pairs successfully, or is starting connection
        hashconnect.connectionStatusChangeEvent.on((state) => {
            console.log("hashconnect state change event", state);
            setState(state);
        })
    }

    const connectToExtension = async () => {
        //this will automatically pop up a pairing request in the HashConnect extension
        hashconnect.connectToLocalWallet();
    }


    const sendTransaction = async (trans: Uint8Array, acctToSign: string, return_trans: boolean = false, hideNfts: boolean = false) => {
        const transaction: MessageTypes.Transaction = {
            topic: topic,
            byteArray: trans,

            metadata: {
                accountToSign: acctToSign,
                returnTransaction: return_trans,
                hideNft: hideNfts
            }
        }

        return await hashconnect.sendTransaction(topic, transaction)
    }

    const requestAccountInfo = async () => {
        let request: MessageTypes.AdditionalAccountRequest = {
            topic: topic,
            network: "testnet",
            multiAccount: true
        }

        await hashconnect.requestAdditionalAccounts(topic, request);
    }

    const disconnect = () => {
        hashconnect.disconnect(pairingData!.topic)
        setPairingData(null);
    }

    const clearPairings = () => {
        hashconnect.clearConnectionsAndData();
        setPairingData(null);
    }

    const showMessage = (message: any) => {
        return setMessage(message);
    }

    return <HashConnectContext.Provider value={{
        hcData,
        hashconnect,
        topic,
        setTopic,
        pairingString,
        pairingData,
        availableExtension,
        state,
        connectToExtension,
        clearPairings,
        disconnect,
        sendTransaction,
        showMessage
    }}>
        {children}
        {message && <Message setMessage={setMessage}>{typeof message === 'object' ? <pre>{JSON.stringify(message, null, 2)}</pre> : message}</Message>}
    </HashConnectContext.Provider>
}

export function useHashConnectContext() {
    return useContext(HashConnectContext);
}