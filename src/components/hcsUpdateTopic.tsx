import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useSigningContext } from "../contexts/signing";
import { useHashConnectContext } from "../contexts/hashconnect";
import { TopicUpdateTransaction, TransactionReceipt } from "@hashgraph/sdk";

const HcsUpdateTopicModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { makeBytes } = useSigningContext();
    const { sendTransaction, pairingData, showMessage } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');
    const [topicId, setTopicId] = useState('0.0.30890260');
    const [topicMemo, setTopicMemo] = useState('Updated topic memo');
    const [memo, setMemo] = useState('test memo');

    const send = async () => {
        let trans = new TopicUpdateTransaction()
            .setTopicId(topicId)
            .setTopicMemo(topicMemo)
            .setTransactionMemo(memo);

        let transactionBytes: Uint8Array = await makeBytes(trans, signingAcct);

        let res = await sendTransaction(transactionBytes, signingAcct, false);

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
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Update Topic</h3>
                </div>

                <section className="py-4">
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                        From:
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
                    <label htmlFor="topicId" className="block text-sm font-medium text-gray-700">
                        Topic ID:
                    </label>
                    <div className="mt-1">
                        <input
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            type="text" name="" id="topicId" value={topicId} onChange={(event: any) => { setTopicId(event.target.value) }} />
                    </div>
                </section>

                <section className="py-2">
                    <label htmlFor="newTopicMemo" className="block text-sm font-medium text-gray-700">
                        New Topic Memo:
                    </label>
                    <div className="mt-1">
                        <input
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            type="text" name="" id="newTopicMemo" value={topicMemo} onChange={(event: any) => { setTopicMemo(event.target.value) }} />
                    </div>
                </section>

                <section className="py-2">
                    <label htmlFor="transactionMemo" className="block text-sm font-medium text-gray-700">
                        Transaction Memo:
                    </label>
                    <div className="mt-1">
                        <input
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            type="text" name="" id="transactionMemo" value={memo} onChange={(event: any) => { setMemo(event.target.value) }} />
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

export default HcsUpdateTopicModal;