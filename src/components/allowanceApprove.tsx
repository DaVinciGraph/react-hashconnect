import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useHashConnectContext } from "../contexts/hashconnect";
import { AccountAllowanceApproveTransaction, NftId, TokenId, TransactionReceipt } from "@hashgraph/sdk";
import { useSigningContext } from "../contexts/signing";
import mapTree from "../modules/mapTree";
import { toast } from "react-hot-toast";

const AllowanceApproveModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { makeBytes } = useSigningContext();
    const { pairingData, showMessage, sendTransaction } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');
    const spenderId = "0.0.3184365";

    const [data, setData] = useState({
        hbarAllowance: false,
        hbarAllowances: [{
            ownerAccountId: signingAcct,
            spenderAccountId: spenderId,
            amount: 0
        }],
        nftAllowance: false,
        nftAllowances: [{
            tokenId: "",
            serial: 0,
            ownerAccountId: signingAcct,
            spenderAccountId: spenderId
        }],
        tokenAllowance: false,
        tokenAllowances: [{
            tokenId: "",
            ownerAccountId: signingAcct,
            spenderAccountId: spenderId,
            amount: 0
        }]
    });

    const send = async () => {
        try {
            let trans = new AccountAllowanceApproveTransaction();

            console.log(data)
            if (data.hbarAllowance) {
                data.hbarAllowances.forEach(allowance => {
                    trans.approveHbarAllowance(allowance.ownerAccountId!, allowance.spenderAccountId!, allowance.amount!);
                })
            }

            if (data.nftAllowance) {
                data.nftAllowances.forEach(allowance => {
                    let raw = allowance.tokenId.split('.');
                    let tokenId: TokenId = new TokenId(parseInt(raw[0]), parseInt(raw[1]), parseInt(raw[2]));
                    let nftId = new NftId(tokenId, allowance.serial);
                    trans.approveTokenNftAllowance(nftId, allowance.ownerAccountId, allowance.spenderAccountId);
                })
            }

            if (data.tokenAllowance) {
                data.tokenAllowances.forEach(allowance => {
                    trans.approveTokenAllowance(allowance.tokenId, allowance.ownerAccountId!, allowance.spenderAccountId!, allowance.amount!);
                })
            }

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
            toast.error(err.message)
        }
    }

    const addHbarAllowance = () => {
        changeState("hbarAllowances", { spenderAccountId: spenderId, ownerAccountId: signingAcct, amount: 0 })
    }

    const addNFTAllowance = () => {
        changeState("nftAllowances", { tokenId: "", serial: 0, ownerAccountId: signingAcct, spenderAccountId: spenderId })
    }

    const addTokenAllowance = () => {
        changeState("tokenAllowances", { tokenId: "", ownerAccountId: signingAcct, spenderAccountId: spenderId, amount: 0 })
    }

    const changeState = (path: string, value: any) => {
        setData(mapTree(data, path, value));
    };

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="py-6 px-4">
                <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Allowance Approve</h3>
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

                <hr />

                <section className="my-2">
                    <input type="checkbox" name="" id="hbarAllowance" checked={data.hbarAllowance} onChange={(event: any) => changeState("hbarAllowance", (event.target as HTMLInputElement).checked)} />
                    <label htmlFor="hbarAllowance" className="px-3">HBAR Allowance</label>
                </section>

                {data.hbarAllowance && <section>
                    {data.hbarAllowances.map((allowance, index) => <div key={index} className="py-2">
                        <label htmlFor={`amount_${index}`} className="block text-sm font-medium text-gray-700">
                            Amount:
                        </label>

                        <div className="mt-1">
                            <input
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text" name="" id={`amount_${index}`} value={allowance.amount} onChange={(event: any) => { changeState(`hbarAllowances[${index}].amount`, (event.target as HTMLInputElement).value) }} />
                        </div>
                    </div>)}

                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm m-1 py-1 px-2 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                        onClick={() => addHbarAllowance()} > Add HBAR Allowance</button >
                </section>}

                <hr />

                <section className="my-2">
                    <input type="checkbox" name="" id="nftAllowance" checked={data.nftAllowance} onChange={(event: any) => changeState("nftAllowance", (event.target as HTMLInputElement).checked)} />
                    <label htmlFor="nftAllowance" className="px-3">NFT Allowance</label>
                </section>

                {data.nftAllowance && <div>
                    {data.nftAllowances.map((allowance, index) => <div key={index} className="flex">
                        <section className="p-2 w-1/2">
                            <label htmlFor={`nftId_${index}`} className="block text-sm font-medium text-gray-700">
                                Token ID:
                            </label>

                            <div className="mt-1">
                                <input
                                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text" name="" id={`nftId_${index}`} value={allowance.tokenId} onChange={(event: any) => { changeState(`nftAllowances[${index}].tokenId`, event.target.value) }} />
                            </div>
                        </section>

                        <section className="p-2 w-1/2">
                            <label htmlFor={`nftSerial_${index}`} className="block text-sm font-medium text-gray-700">
                                Serial:
                            </label>

                            <div className="mt-1">
                                <input
                                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="number" name="" id={`nftSerial_${index}`} value={allowance.serial} onChange={(event: any) => { changeState(`nftAllowances[${index}].serial`, event.target.value) }} max="5" min="-5" />
                            </div>
                        </section>
                    </div>)}

                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm m-1 py-1 px-2 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                        onClick={() => addNFTAllowance()} > Add NFT Allowance</button >
                </div >}

                <hr />

                <section className="my-2">
                    <input type="checkbox" name="" id="tokenAllowance" checked={data.tokenAllowance} onChange={(event: any) => changeState("tokenAllowance", Boolean(event.target.checked))} />
                    <label className="px-3" htmlFor="tokenAllowance">Token Allowance</label>
                </section>

                {data.tokenAllowance && <div>
                    {data.tokenAllowances.map((allowance, index) => <div key={index} className="flex">
                        <section className="p-2 w-1/2">
                            <label htmlFor={`tokeId_${index}`} className="block text-sm font-medium text-gray-700">
                                Token ID:
                            </label>

                            <div className="mt-1">
                                <input
                                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text" name="" id={`tokeId_${index}`} value={allowance.tokenId} onChange={(event: any) => { changeState(`tokenAllowances[${index}].tokenId`, event.target.value) }} />
                            </div>
                        </section>

                        <section className="p-2 w-1/2">
                            <label htmlFor={`tokenAmount_${index}`} className="block text-sm font-medium text-gray-700">
                                Amount:
                            </label>

                            <div className="mt-1">
                                <input
                                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text" name="" id={`tokenAmount_${index}`} value={allowance.amount} onChange={(event: any) => { changeState(`tokenAllowances[${index}].amount`, event.target.value) }} />
                            </div>
                        </section>
                    </div>)}

                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm m-1 py-1 px-2 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                        onClick={() => addTokenAllowance()} > Add Token Allowance</button >
                </div >}

                <button
                    onClick={() => send()}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                >
                    Send
                </button>
            </article>
        </Modal >
    );
}

export default AllowanceApproveModal;