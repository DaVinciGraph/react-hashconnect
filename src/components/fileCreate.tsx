import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useSigningContext } from "../contexts/signing";
import { useHashConnectContext } from "../contexts/hashconnect";
import { FileCreateTransaction, TransactionReceipt } from "@hashgraph/sdk";

const FileCreateModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { signAndMakeBytes } = useSigningContext();
    const { sendTransaction, pairingData, showMessage } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');
    const [fileContent, setFileContent] = useState('608060405234801561001057600080fd5b50604051620007403803806200074083398181016040528101906100349190610212565b8060008360405161004591906102b5565b90815260200160405180910390208190555050506102cc565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6100c58261007c565b810181811067ffffffffffffffff821117156100e4576100e361008d565b5b80604052505050565b60006100f761005e565b905061010382826100bc565b919050565b600067ffffffffffffffff8211156101235761012261008d565b5b61012c8261007c565b9050602081019050919050565b60005b8381101561015757808201518184015260208101905061013c565b83811115610166576000848401525b50505050565b600061017f61017a84610108565b6100ed565b90508281526020810184848401111561019b5761019a610077565b5b6101a6848285610139565b509392505050565b600082601f8301126101c3576101c2610072565b5b81516101d384826020860161016c565b91505092915050565b6000819050919050565b6101ef816101dc565b81146101fa57600080fd5b50565b60008151905061020c816101e6565b92915050565b6000806040838503121561022957610228610068565b5b600083015167ffffffffffffffff8111156102475761024661006d565b5b610253858286016101ae565b9250506020610264858286016101fd565b9150509250929050565b600081519050919050565b600081905092915050565b600061028f8261026e565b6102998185610279565b93506102a9818560208601610139565b80840191505092915050565b60006102c18284610284565b915081905092915050565b61046480620002dc6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806314b3ee68146100465780639f11592114610076578063fd8111e914610092575b600080fd5b610060600480360381019061005b9190610298565b6100c2565b60405161006d91906102fa565b60405180910390f35b610090600480360381019061008b9190610341565b6100e9565b005b6100ac60048036038101906100a79190610298565b610110565b6040516100b991906102fa565b60405180910390f35b600080826040516100d39190610417565b9081526020016040518091039020549050919050565b806000836040516100fa9190610417565b9081526020016040518091039020819055505050565b6000818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6101a58261015c565b810181811067ffffffffffffffff821117156101c4576101c361016d565b5b80604052505050565b60006101d761013e565b90506101e3828261019c565b919050565b600067ffffffffffffffff8211156102035761020261016d565b5b61020c8261015c565b9050602081019050919050565b82818337600083830152505050565b600061023b610236846101e8565b6101cd565b90508281526020810184848401111561025757610256610157565b5b610262848285610219565b509392505050565b600082601f83011261027f5761027e610152565b5b813561028f848260208601610228565b91505092915050565b6000602082840312156102ae576102ad610148565b5b600082013567ffffffffffffffff8111156102cc576102cb61014d565b5b6102d88482850161026a565b91505092915050565b6000819050919050565b6102f4816102e1565b82525050565b600060208201905061030f60008301846102eb565b92915050565b61031e816102e1565b811461032957600080fd5b50565b60008135905061033b81610315565b92915050565b6000806040838503121561035857610357610148565b5b600083013567ffffffffffffffff8111156103765761037561014d565b5b6103828582860161026a565b92505060206103938582860161032c565b9150509250929050565b600081519050919050565b600081905092915050565b60005b838110156103d15780820151818401526020810190506103b6565b838111156103e0576000848401525b50505050565b60006103f18261039d565b6103fb81856103a8565b935061040b8185602086016103b3565b80840191505092915050565b600061042382846103e6565b91508190509291505056fea264697066735822122049e6ca88d0242a5a423ce392b61870ac108ba49ce39c259ea7620a60ac3c6b3664736f6c634300080b0033');

    const send = async () => {
        //this is the example contract from https://hedera.com/blog/how-to-deploy-smart-contracts-on-hedera-part-1-a-simple-getter-and-setter-contract
        let trans = new FileCreateTransaction()
            .setContents(fileContent);

        let transactionBytes: Uint8Array = await signAndMakeBytes(trans, signingAcct);

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
                    <h3 className="text-lg font-medium leading-6 text-gray-900">File Create</h3>
                </div>

                <p>The default file content is the contract code from the <a href="https://hedera.com/blog/how-to-deploy-smart-contracts-on-hedera-part-1-a-simple-getter-and-setter-contract" className="underline" rel="noreferrer" target="_blank">Hedera smart contract tutorial</a></p>

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
                    <label htmlFor="fileContent" className="block text-sm font-medium text-gray-700">
                        Content:
                    </label>
                    <div className="mt-1">
                        <input
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            type="text" name="" id="fileContent" value={fileContent} onChange={(event: any) => { setFileContent(event.target.value) }} />
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

export default FileCreateModal;