import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useSigningContext } from "../contexts/signing";
import { useHashConnectContext } from "../contexts/hashconnect";

const AuthenticationModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { signData, verifyData, publicKey } = useSigningContext();
    const { hashconnect, topic, pairingData, showMessage } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');

    const send = async () => {
        //!!!!!!!!!! DO NOT DO THIS ON THE CLIENT SIDE - YOU MUST SIGN THE PAYLOAD IN YOUR BACKEND
        // after verified on the server, generate some sort of auth token to use with your backend
        let payload = { url: "test.com", data: { token: "fufhr9e84hf9w8fehw9e8fhwo9e8fw938fw3o98fhjw3of" } };

        let signing_data = signData(payload);

        //this line you should do client side, after generating the signed payload on the server
        //@ts-ignore
        let res = await hashconnect.authenticate(topic, signingAcct, signing_data.serverSigningAccount, signing_data.signature, payload);

        if (!res.success) {
            showMessage(res);
            return;
        }

        let url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${signingAcct}`;

        fetch(url, { method: "GET" }).then(async accountInfoResponse => {
            if (accountInfoResponse.ok) {
                let data = await accountInfoResponse.json();
                console.warn("Got account info", data);

                if (!res.signedPayload) return;

                let server_key_verified = verifyData(res.signedPayload.originalPayload, publicKey, res.signedPayload.serverSignature as Uint8Array);
                let user_key_verified = verifyData(res.signedPayload, data.key.key, res.userSignature as Uint8Array);

                if (server_key_verified && user_key_verified)
                    showMessage("Authenticated: true");
                else
                    showMessage("Authenticated: false");
            } else {
                alert("Error getting public key")
            }
        })
        //!!!!!!!!!! DO NOT DO THIS ON THE CLIENT SIDE - YOU MUST PASS THE TRANSACTION BYTES TO THE SERVER AND VERIFY THERE

    }

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="p-6 w-80">
                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Authenticate User</h3>
                </div>

                <div className="py-4">
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                        Account to authenticate
                    </label>
                    <select
                        id="accountId"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={signingAcct}
                        onChange={(event) => setSigningAcct((event.target as HTMLSelectElement)?.value)}
                    >
                        {pairingData?.accountIds.map(accountId => <option value={accountId} key={signingAcct}>{signingAcct}</option>)}
                    </select>
                </div>

                <button
                    onClick={() => send()}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                >
                    Send
                </button>
            </article >
        </Modal >
    );
}

export default AuthenticationModal;