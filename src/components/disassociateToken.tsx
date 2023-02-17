import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useSigningContext } from "../contexts/signing";
import { useHashConnectContext } from "../contexts/hashconnect";
import { TokenDissociateTransaction, TransactionReceipt } from "@hashgraph/sdk";

const DisassociateTokenModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { makeBytes } = useSigningContext();
    const { sendTransaction, pairingData, showMessage } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');
    const [tokenIds, setTokenIds] = useState<string[]>(['']);

    const send = async () => {
        let trans = await new TokenDissociateTransaction();
        let tokenIds: string[] = [];

        tokenIds.forEach(tokenId => {
            tokenIds.push(tokenId);
        })

        trans.setTokenIds(tokenIds);
        trans.setAccountId(signingAcct);

        let transBytes: Uint8Array = await makeBytes(trans, signingAcct);

        let res = await sendTransaction(transBytes, signingAcct);

        //handle response
        let responseData: any = {
            response: res,
            receipt: null
        }

        if (res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);

        showMessage(responseData);
    }

    const onAddTokenId = (event: any) => {
        setTokenIds(current => {
            const newTokenIds = [...current];
            newTokenIds[event.target.dataset.index] = event.target.value;
            return newTokenIds;
        });
    }

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="p-6 w-80">
                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Disassociate Token</h3>
                </div>

                <div className="py-2">
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                        Account to associate token to
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

                <div>
                    {tokenIds.map((tokenId, index) => <div key={index} className="py-2">
                        <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700">
                            Token ID:
                        </label>

                        <div className="mt-1">
                            <input
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text" name="" id="tokenId" data-index={index} value={tokenId} onChange={onAddTokenId} />
                        </div>
                    </div>)}

                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm m-1 py-1 px-2 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                        onClick={() => setTokenIds([...tokenIds, ""])} > Add Token Transaction</button >
                </div>

                <br />
                <br />

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

export default DisassociateTokenModal;