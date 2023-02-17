import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useSigningContext } from "../contexts/signing";
import { useHashConnectContext } from "../contexts/hashconnect";
import { AccountUpdateTransaction, PublicKey, TransactionReceipt } from "@hashgraph/sdk";
import { toast } from "react-hot-toast";

const AccountUpdateModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { makeBytes } = useSigningContext();
    const { sendTransaction, pairingData, showMessage } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');
    const [data, setData] = useState({
        newPublicKey: "",
        maxAutomaticTokenAssociations: 0,
        accountMemo: "",
        transMemo: ""
    });

    const onChangeInput = (event: any) => {
        console.log(event.target.name)
        setData({ ...data, [event.target.name]: event.target.value });
    }

    const send = async () => {
        try {
            let trans = await new AccountUpdateTransaction();

            trans.setAccountId(signingAcct);
            trans.setMaxAutomaticTokenAssociations(Number(data.maxAutomaticTokenAssociations));
            trans.setAccountMemo(data.accountMemo);
            trans.setTransactionMemo(data.transMemo);

            if (data.newPublicKey !== "")
                trans.setKey(PublicKey.fromString(data.newPublicKey))


            let transBytes: Uint8Array = await makeBytes(trans, signingAcct);

            let res = await sendTransaction(transBytes, signingAcct);

            //handle response
            let responseData: any = {
                response: res,
                receipt: null
            }

            if (res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);

            showMessage(responseData);
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="p-6 w-80">
                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Account Update</h3>
                </div>

                <div className="py-2">
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                        Account to sign
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

                <div className="py-2">
                    <label htmlFor="newPublicKey" className="block text-sm font-medium text-gray-700">
                        New Public Key - WARNING BE CAREFUL WITH THIS ONE
                    </label>
                    <input type="text"
                        id="newPublicKey"
                        name="newPublicKey"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={data.newPublicKey}
                        onChange={onChangeInput} />
                </div>

                <div className="py-2">
                    <label htmlFor="maxAutomaticTokenAssociations" className="block text-sm font-medium text-gray-700">
                        Automatic Token Associations
                    </label>
                    <input type="number"
                        id="maxAutomaticTokenAssociations"
                        name="maxAutomaticTokenAssociations"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        min="0" max="1000"
                        value={data.maxAutomaticTokenAssociations}
                        onChange={onChangeInput} />
                </div>

                <div className="py-2">
                    <label htmlFor="accountMemo" className="block text-sm font-medium text-gray-700">
                        Account Memo
                    </label>
                    <input type="text"
                        id="accountMemo"
                        name="accountMemo"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={data.accountMemo}
                        onChange={onChangeInput} />
                </div>

                <div className="py-2">
                    <label htmlFor="transMemo" className="block text-sm font-medium text-gray-700">
                        Transaction Memo
                    </label>
                    <input type="text"
                        id="transMemo"
                        name="transMemo"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={data.transMemo}
                        onChange={onChangeInput} />
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

export default AccountUpdateModal;