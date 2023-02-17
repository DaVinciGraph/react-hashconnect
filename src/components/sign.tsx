import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useHashConnectContext } from "../contexts/hashconnect";

const SignModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { hashconnect, topic, pairingData, showMessage } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');

    const send = async () => {
        //@ts-ignore
        let res = await hashconnect.sign(topic, signingAcct, { test: "ABC" });

        showMessage(res);
    }

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="p-6 w-80">
                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Sign</h3>
                </div>

                <div className="py-4">
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

export default SignModal;