import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useHashConnectContext } from "../contexts/hashconnect";
import { ContractCallQuery, ContractFunctionParameters, Hbar } from "@hashgraph/sdk";

const SmartContractCallModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { sendTransaction, pairingData, showMessage } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');
    const [contractId, setContractId] = useState('0.0.30863001');

    const send = async () => {
        //this is the example contract from https://hedera.com/blog/how-to-deploy-smart-contracts-on-hedera-part-1-a-simple-getter-and-setter-contract
        let trans = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(100000)
            .setFunction("getMobileNumber", new ContractFunctionParameters().addString("Alice"))
            .setMaxQueryPayment(new Hbar(0.00000001));

        let transactionBytes: Uint8Array = await trans.toBytes();

        let res = await sendTransaction(transactionBytes, signingAcct, false, false, true);

        //handle response
        // let responseData: any = {
        //     response: res,
        //     receipt: null
        // }

        //todo: how to change query bytes back to query?
        // if(res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);

        showMessage(res);
    }

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="px-4 py-2 w-80">
                <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Smart Contract Call</h3>
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
                    <label htmlFor="contractId" className="block text-sm font-medium text-gray-700">
                        Contract ID:
                    </label>
                    <div className="mt-1">
                        <input
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            type="text" name="" id="contractId" value={contractId} onChange={(event: any) => { setContractId(event.target.value) }} />
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

export default SmartContractCallModal;