import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useHashConnectContext } from "../contexts/hashconnect";
import { Hbar, HbarUnit, TransactionReceipt, TransferTransaction } from "@hashgraph/sdk";
import { useSigningContext } from "../contexts/signing";
import mapTree from "../modules/mapTree";
import { toast } from "react-hot-toast";

const SendTransactionModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { signAndMakeBytes, acc } = useSigningContext();
    const { pairingData, showMessage, sendTransaction } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(acc);
    const [data, setData] = useState({
        transfer: {
            include_hbar: true,
            to_hbar_amount: 1,
            from_hbar_amount: -1,
            toAcc: "0.0.3183101",
            include_token: false,
            return_transaction: false,
            tokenTransfers: [
                {
                    tokenId: "0.0.3184799",
                    accountId: "",
                    amount: 1
                }
            ],
            include_nft: false,
            hideNfts: false,
            nftTransfers: [
                {
                    tokenId: "0.0.14658561",
                    serialNumber: 0,
                    sender: "",
                    receiver: ""
                }
            ]
        },
        tokenAssociate: {}
    });
    const [memo, setMemo] = useState('');

    const buildTransaction = async () => {
        try {
            let trans = new TransferTransaction()
                .setTransactionMemo(memo);

            if (data.transfer.include_hbar) {
                trans.addHbarTransfer(data.transfer.toAcc, Hbar.from(data.transfer.to_hbar_amount, HbarUnit.Hbar))
                    .addHbarTransfer(signingAcct, Hbar.from(data.transfer.from_hbar_amount, HbarUnit.Hbar))
            }

            if (data.transfer.include_token) {
                data.transfer.tokenTransfers.forEach(tokenTrans => {
                    console.log(tokenTrans)

                    trans.addTokenTransfer(tokenTrans.tokenId, tokenTrans.accountId, tokenTrans.amount)
                })
            }

            if (data.transfer.include_nft) {
                data.transfer.nftTransfers.forEach(nftTrans => {
                    trans.addNftTransfer(nftTrans.tokenId, nftTrans.serialNumber, nftTrans.sender, nftTrans.receiver);
                })
            }

            let transactionBytes: Uint8Array = await signAndMakeBytes(trans, signingAcct);

            let res = await sendTransaction(transactionBytes, signingAcct, data.transfer.return_transaction, data.transfer.hideNfts);

            //handle response
            let responseData: any = {
                response: res,
                receipt: null
            }

            if (res.success && !data.transfer.return_transaction) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);

            showMessage(responseData);
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const addTokenTransfer = () => {
        changeState("transfer.tokenTransfers", {
            tokenId: "0.0.3184799",
            accountId: "",
            amount: 1
        })
    }

    const addNFTTransfer = () => {
        changeState("transfer.nftTransfers", {
            tokenId: "0.0.14658561",
            serialNumber: 0,
            sender: "",
            receiver: ""
        })
    }

    const changeState = (path: string, value: any) => {
        setData(mapTree(data, path, value));
    };

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="py-6 px-4">
                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Send Transaction</h3>
                </div>

                <div className="flex py-2">
                    <section className="p-2 w-1/2">
                        <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700">
                            To:
                        </label>
                        {data.transfer.toAcc}
                    </section>

                    <section className="p-2 w-1/2">
                        <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700">
                            From:
                        </label>

                        <div className="mt-1">
                            <select
                                id="fromAccount"
                                className="w-full mt-1 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                value={signingAcct} onChange={(event: any) => setSigningAcct((event.target as HTMLSelectElement).value)}>
                                {pairingData?.accountIds.map((accountId) => <option value={accountId} key={accountId} >{accountId}</option>)}
                            </select>
                        </div>
                    </section>
                </div>

                <hr />

                <section className="my-2">
                    <input type="checkbox" name="" id="include_hbar" checked={data.transfer.include_hbar} onChange={(event: any) => changeState("transfer.include_hbar", (event.target as HTMLInputElement).checked)} />
                    <label htmlFor="include_hbar" className="px-3">HBAR Transfer</label>
                </section>

                {data.transfer.include_hbar && <div className="flex">
                    <section className="p-2 w-1/2">
                        <label htmlFor="to_hbar_amount" className="block text-sm font-medium text-gray-700">
                            To HBAR Amount:
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="number" name="" id="to_hbar_amount" value={data.transfer.to_hbar_amount} onChange={(event: any) => {
                                    changeState("transfer.to_hbar_amount", Number((event.target as HTMLInputElement).value))
                                }} max="5" min="-5" />
                        </div>
                    </section>
                    <section className="p-2 w-1/2">
                        <label htmlFor="from_hbar_amount" className="block text-sm font-medium text-gray-700">
                            From HBAR Amount:
                        </label>

                        <div className="mt-1">
                            <input type="number"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                name="" id="from_hbar_amount" value={data.transfer.from_hbar_amount} onChange={(event: any) => {
                                    changeState("transfer.from_hbar_amount", Number((event.target as HTMLInputElement).value))
                                }} max="5" min="-5" />
                        </div>
                    </section>
                </div>}

                <hr />

                <section className="my-2">
                    <input type="checkbox" name="" id="include_toke" checked={data.transfer.include_token} onChange={(event: any) => changeState("transfer.include_token", (event.target as HTMLInputElement).checked)} />
                    <label htmlFor="include_toke" className="px-3">Token Transfer</label>
                </section>

                {data.transfer.include_token && <div>
                    {data.transfer.tokenTransfers.map((tokenTrans, index) => <div key={index} className="flex">

                        <section className="p-2">
                            <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700">
                                Token ID:
                            </label>

                            <div className="mt-1">
                                <input
                                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text" name="" id="tokenId" value={tokenTrans.tokenId} onChange={(event: any) => {
                                        changeState(`transfer.tokenTransfers[${index}].tokenId`, (event.target as HTMLInputElement).value)
                                    }} />
                            </div>
                        </section>

                        <section className="p-2">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Token Amount:
                            </label>

                            <div className="mt-1">
                                <input
                                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="number" name="" id="amount" value={tokenTrans.amount} onChange={(event: any) => {
                                        changeState(`transfer.tokenTransfers[${index}].amount`, (event.target as HTMLInputElement).value)
                                    }} max="5" min="-5" />
                            </div>
                        </section>

                        <section className="p-2">
                            <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                                Sender ID:
                            </label>

                            <div className="mt-1">
                                <input
                                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text" name="" id="accountId" value={tokenTrans.accountId} onChange={(event: any) => {
                                        changeState(`transfer.tokenTransfers[${index}].accountId`, (event.target as HTMLInputElement).value)
                                    }} />
                            </div>
                        </section>
                    </div>)}

                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm m-1 py-1 px-2 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                        onClick={() => addTokenTransfer()} > Add Token Transaction</button >
                </div >}

                <hr />

                <section className="my-2">
                    <input type="checkbox" name="" id="include_nft" checked={data.transfer.include_nft} onChange={(event: any) => changeState("transfer.include_nft", Boolean((event.target as HTMLInputElement).checked))} />
                    <label className="px-3" htmlFor="include_nft">NFT Transfer</label>
                </section>

                {data.transfer.include_nft && <section>
                    <div>
                        {data.transfer.nftTransfers.map((nftTrans, index) => <div key={index} className="flex">

                            <section className="p-2">
                                <label htmlFor={`nftTokenId_${index}`} className="block text-sm font-medium text-gray-700">
                                    Token ID:
                                </label>

                                <div className="mt-1">
                                    <input type="text"
                                        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        name="" id={`nftTokenId_${index}`} value={nftTrans.tokenId} onChange={(event: any) => {
                                            changeState(`transfer.nftTransfers[${index}].tokenId`, (event.target as HTMLInputElement).value)
                                        }} />
                                </div>
                            </section>

                            <section className="p-2">
                                <label htmlFor={`nftSerial_${index}`} className="block text-sm font-medium text-gray-700">
                                    Serial Number:
                                </label>

                                <div className="mt-1">
                                    <input type="number"
                                        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        name="" id={`nftSerial_${index}`} value={nftTrans.serialNumber} onChange={(event: any) => {
                                            changeState(`transfer.nftTransfers[${index}].serialNumber`, (event.target as HTMLInputElement).value)
                                        }} max="9999999" min="0" />
                                </div>
                            </section>

                            <section className="p-2">
                                <label htmlFor={`nftSender_${index}`} className="block text-sm font-medium text-gray-700">
                                    Sender ID:
                                </label>

                                <div className="mt-1">
                                    <input type="text"
                                        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        name="" id={`nftSender_${index}`} value={nftTrans.sender} onChange={(event: any) => {
                                            changeState(`transfer.nftTransfers[${index}].sender`, (event.target as HTMLInputElement).value)
                                        }} />
                                </div>
                            </section>


                            <section className="p-2">
                                <label htmlFor={`nftReceiver_${index}`} className="block text-sm font-medium text-gray-700">
                                    Receiver ID:
                                </label>

                                <div className="mt-1">
                                    <input type="text"
                                        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        name="" id={`nftReceiver_${index}`} value={nftTrans.receiver} onChange={(event: any) => {
                                            changeState(`transfer.nftTransfers[${index}].receiver`, (event.target as HTMLInputElement).value)
                                        }} />
                                </div>
                            </section>
                        </div>)}

                        <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm m-1 py-1 px-2 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                            onClick={() => addNFTTransfer()} > Add NFT Transfer</button >
                    </div>
                    <div className="my-2">
                        <input type="checkbox" name="" id="" checked={data.transfer.hideNfts} onChange={(event: any) =>
                            changeState("transfer.hideNfts", Boolean((event.target as HTMLInputElement).checked))
                        } />
                        <label htmlFor="include_toke" className="px-3">Hide NFT Info</label>
                    </div>
                </section>}

                <hr />

                <section className="py-2">
                    <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
                        Memo:
                    </label>
                    <div className="mt-1">
                        <input type="text"
                            id="memo"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={memo} onChange={(event: any) => setMemo((event.target as HTMLInputElement).value)} />
                    </div>
                </section>

                <hr />

                <section className="py-2">
                    <input type="checkbox" name="" id="return_transaction" checked={data.transfer.return_transaction} onChange={(event: any) =>
                        changeState("transfer.return_transaction", Boolean((event.target as HTMLInputElement).checked))
                    } />
                    <label htmlFor="return_transaction" className="px-3">Return transaction instead of execute</label>
                </section>

                <button
                    onClick={() => buildTransaction()}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                >
                    Send
                </button>
            </article>
        </Modal >
    );
}

export default SendTransactionModal;