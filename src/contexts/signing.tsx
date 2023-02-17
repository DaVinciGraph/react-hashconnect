import {
    Client,
    PrivateKey,
    Transaction,
    AccountId,
    TransactionId,
    PublicKey
} from "@hashgraph/sdk";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

interface ISingingContext {
    signAndMakeBytes: Function,
    makeBytes: Function,
    signData: Function,
    verifyData: Function,
    acc: string,
    publicKey: string
}

export const SigningContext = createContext<ISingingContext>({
    signAndMakeBytes: () => { },
    makeBytes: () => { },
    signData: () => { },
    verifyData: () => { },
    acc: "",
    publicKey: ""
});


const SingingProvider = ({ children }: PropsWithChildren) => {
    const [client] = useState<Client>(Client.forTestnet());
    const pk = "e0aba899a78b1f64c8aceb6c68b8ce2b33040d0186584036806998e95a4732d6";
    const publicKey = "302a300506032b65700321006405caefdaef3c4a587cbe967586421eec6a6a2c3140cb6e3c9bfc596f953782";
    const acc = "0.0.3184365";

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        client.setOperator(acc, pk);
    }

    const signAndMakeBytes = async (trans: Transaction, signingAcctId: string) => {

        const privKey = PrivateKey.fromString(pk);
        const pubKey = privKey.publicKey;

        let nodeId = [new AccountId(3)];
        let transId = TransactionId.generate(signingAcctId)

        trans.setNodeAccountIds(nodeId);
        trans.setTransactionId(transId);

        trans = await trans.freeze();

        let transBytes = trans.toBytes();

        const sig = await privKey.signTransaction(Transaction.fromBytes(transBytes) as any);

        const out = trans.addSignature(pubKey, sig);

        const outBytes = out.toBytes();

        console.log("Transaction bytes", outBytes);

        return outBytes;
    }

    const makeBytes = async (trans: Transaction, signingAcctId: string) => {
        let transId = TransactionId.generate(signingAcctId)
        trans.setTransactionId(transId);
        trans.setNodeAccountIds([new AccountId(3)]);

        await trans.freeze();

        let transBytes = trans.toBytes();

        return transBytes;
    }

    const signData = (data: object): { signature: Uint8Array, serverSigningAccount: string } => {
        const privKey = PrivateKey.fromString(pk);
        const pubKey = privKey.publicKey;

        let bytes = new Uint8Array(Buffer.from(JSON.stringify(data)));

        let signature = privKey.sign(bytes);

        let verify = pubKey.verify(bytes, signature); //this will be true

        return { signature: signature, serverSigningAccount: acc }
    }

    const verifyData = (data: object, publicKey: string, signature: Uint8Array): boolean => {
        const pubKey = PublicKey.fromString(publicKey);

        let bytes = new Uint8Array(Buffer.from(JSON.stringify(data)));

        let verify = pubKey.verify(bytes, signature);

        return verify;
    }

    return <SigningContext.Provider value={{
        signAndMakeBytes,
        makeBytes,
        signData,
        verifyData,
        acc,
        publicKey
    }}>{children}</SigningContext.Provider>
};

export default SingingProvider;
export function useSigningContext() {
    return useContext(SigningContext);
}