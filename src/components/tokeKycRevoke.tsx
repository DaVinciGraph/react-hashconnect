import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useSigningContext } from "../contexts/signing";
import { useHashConnectContext } from "../contexts/hashconnect";
import { TokenRevokeKycTransaction, TransactionReceipt } from "@hashgraph/sdk";

const TokenKycRevokeModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { makeBytes } = useSigningContext();
    const { sendTransaction, pairingData, showMessage } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');
    const [accountId, setAccountId] = useState('');
    const [tokenId, setTokenId] = useState('');

    const send = async () => {
        let trans = await new TokenRevokeKycTransaction()
            .setTokenId(tokenId)
            .setAccountId(accountId);

        let transBytes: Uint8Array = await makeBytes(trans, signingAcct);

        let res = await sendTransaction(transBytes, signingAcct);

        //handle response
        let responseData: any = {
            response: res,
            receipt: null
        }

        if (res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);

        showMessage(res);
    }

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="px-4 py-2 w-80">
                <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Revoke Token KYC</h3>
                </div>

                <section className="py-4">
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                        Account to sign (token KYC key account)
                    </label>
                    <select
                        id="accountId"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={signingAcct}
                        onChange={(event) => setSigningAcct(event.target.value)}
                    >
                        {pairingData?.accountIds.map(accountId => <option value={accountId} key={signingAcct}>{signingAcct}</option>)}
                    </select>
                </section>

                <section className="py-2">
                    <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700">
                        Token Id:
                    </label>
                    <div className="mt-1">
                        <input
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            type="text" name="" id="tokenId" value={tokenId} onChange={(event: any) => { setTokenId(event.target.value) }} />
                    </div>
                </section>

                <section className="py-2">
                    <label htmlFor="wipeAccount" className="block text-sm font-medium text-gray-700">
                        Account ID:
                    </label>
                    <div className="mt-1">
                        <input
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            type="text" name="" id="wipeAccount" value={accountId} onChange={(event: any) => { setAccountId(event.target.value) }} />
                    </div>
                </section>

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

export default TokenKycRevokeModal;