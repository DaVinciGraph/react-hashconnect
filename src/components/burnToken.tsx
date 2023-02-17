import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useSigningContext } from "../contexts/signing";
import { useHashConnectContext } from "../contexts/hashconnect";
import { TokenBurnTransaction, TransactionReceipt } from "@hashgraph/sdk";

const BurnTokenModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { makeBytes } = useSigningContext();
    const { sendTransaction, pairingData, showMessage } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');
    const [tokenId, setTokenId] = useState('')
    const [amount, setAmount] = useState(1)
    const [isNft, setIsNFT] = useState(false)
    const [serials, setSerials] = useState([1]);

    const send = async () => {
        let trans = new TokenBurnTransaction()
            .setTokenId(tokenId);

        if (!isNft)
            trans.setAmount(amount);
        else if (isNft) {
            trans.setSerials(serials);
        }

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

    const changeSerial = (index: number, value: number) => {
        const previousSerials = [...serials];
        previousSerials[index] = value;
        setSerials(previousSerials);
    }

    const addSerial = () => {
        setSerials([...serials, serials.length + 1]);
    }

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="px-4 py-2 w-80">
                <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Burn token</h3>
                </div>

                <section className="py-4">
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                        Account to sign (token supply account)
                    </label>
                    <select
                        id="accountId"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={signingAcct}
                        onChange={(event) => setSigningAcct((event.target as HTMLSelectElement)?.value)}
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

                <section className="my-2">
                    <input type="checkbox" name="" id="isNFT" checked={isNft} onChange={(event: any) => setIsNFT(event.target.checked)} />
                    <label htmlFor="isNFT" className="px-3">Is it an NFT?</label>
                </section>

                {!isNft && <section className="py-2">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount:
                    </label>
                    <div className="mt-1">
                        <input
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            type="text" name="" id="amount" value={amount} onChange={(event: any) => { setAmount(Number(event.target.value)) }} />
                    </div>
                </section>}

                {isNft && <section className="py-2">
                    <label htmlFor="serials" className="block text-sm font-medium text-gray-700">
                        Serial #:
                    </label>
                    {serials.map((serial, index) => <div className="mt-1" key={serial}>
                        <input
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            type="text" name="" id="serials" value={serial} onChange={(event: any) => { changeSerial(index, event.target.value) }} />
                    </div>)}

                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm m-1 py-1 px-2 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                        onClick={() => addSerial()} > Add Serial</button >
                </section>}

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

export default BurnTokenModal;