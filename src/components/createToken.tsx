import Modal, { IModalProps } from "./general/modal";
import { FC, useState } from "react";
import { useSigningContext } from "../contexts/signing";
import { useHashConnectContext } from "../contexts/hashconnect";
import { CustomFee, CustomFixedFee, CustomFractionalFee, CustomRoyaltyFee, Hbar, HbarUnit, PublicKey, Timestamp, TokenCreateTransaction, TokenSupplyType, TokenType, TransactionReceipt } from "@hashgraph/sdk";
import mapTree from "../modules/mapTree";

const CreateTokenModal: FC<IModalProps> = ({ setLoadModal }) => {
    const { makeBytes } = useSigningContext();
    const { sendTransaction, pairingData, showMessage } = useHashConnectContext();

    const [signingAcct, setSigningAcct] = useState(pairingData?.accountIds[0] || '');

    const RandomNumber = (Math.random() * 1000).toFixed();
    const [tokenData, setTokenData] = useState({
        name: `DVG-${RandomNumber}`,
        symbol: `DVG-${RandomNumber}`,
        type: TokenType.FungibleCommon,
        supplyType: TokenSupplyType.Infinite,
        initialSupply: 0,
        maxSupply: 0,
        includeRoyalty: false,
        includeFixedFee: false,
        includeFractionalFee: false,
        royaltyPercent: 1,
        fixedFee: 0,
        fixedTokenId: "",
        fractionalFee: {
            percent: 0,
            max: 0,
            min: 0
        },
        fallbackFee: 0,
        decimals: 0
    })

    const send = async () => {
        console.warn('hi', tokenData)
        let accountInfo: any = await window.fetch("https://testnet.mirrornode.hedera.com/api/v1/accounts/" + signingAcct, { method: "GET" });
        // let accountInfo:any = await window.fetch("https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/" + signingAcct, { method: "GET" });
        accountInfo = await accountInfo.json();
        let customFees: CustomFee[] = [];

        let key = await PublicKey.fromString(accountInfo.key.key)

        let trans = await new TokenCreateTransaction()
            .setTokenName(tokenData.name)
            .setTokenSymbol(tokenData.symbol)
            .setTokenType(tokenData.type)
            .setDecimals(0)
            .setSupplyType(tokenData.supplyType)
            .setInitialSupply(tokenData.initialSupply)
            .setTreasuryAccountId(signingAcct)
            .setAdminKey(key)
            .setSupplyKey(key)
            .setWipeKey(key)
            .setAutoRenewAccountId(signingAcct)

        if (tokenData.supplyType !== TokenSupplyType.Infinite) {
            trans.setMaxSupply(tokenData.maxSupply);
        }

        if (tokenData.type === TokenType.FungibleCommon) {
            trans.setDecimals(tokenData.decimals);
        }

        if (tokenData.includeRoyalty) {
            let fallback = await new CustomFixedFee()
                .setFeeCollectorAccountId(signingAcct)
                .setHbarAmount(Hbar.from(tokenData.fallbackFee, HbarUnit.Hbar));

            let royaltyInfo = await new CustomRoyaltyFee()
                .setNumerator(tokenData.royaltyPercent)
                .setDenominator(100)
                .setFeeCollectorAccountId(signingAcct)
                .setFallbackFee(fallback);

            customFees.push(royaltyInfo);
        }

        if (tokenData.includeFractionalFee) {
            let fractional = await new CustomFractionalFee()
                .setFeeCollectorAccountId(signingAcct)
                .setNumerator(tokenData.fractionalFee.percent)
                .setDenominator(100)
                .setMax(tokenData.fractionalFee.max)
                .setMin(tokenData.fractionalFee.min)

            customFees.push(fractional);
        }

        if (tokenData.includeFixedFee) {
            let fixedFee = await new CustomFixedFee()
                .setFeeCollectorAccountId(signingAcct);

            if (tokenData.fixedTokenId && tokenData.fixedTokenId !== "") {
                fixedFee.setDenominatingTokenId(tokenData.fixedTokenId);
                fixedFee.setAmount(tokenData.fixedFee);
            }
            else
                fixedFee.setHbarAmount(Hbar.from(tokenData.fixedFee, HbarUnit.Hbar))

            customFees.push(fixedFee);
        }

        trans.setCustomFees(customFees);

        // Set expiry in 90 days

        const ninetyDaysSeconds = 60 * 60 * 24 * 90
        const secondsNow = Math.round(Date.now() / 1000)
        const timestamp = secondsNow + ninetyDaysSeconds
        const timestampObj = new Timestamp(timestamp, 0)
        console.log({ timestamp })
        console.log({ timestampObj })
        trans.setExpirationTime(timestampObj)
        trans.setAutoRenewPeriod(ninetyDaysSeconds)

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

    const changeType = (evt: string) => {
        changeState("type", evt === "Fungible" ? TokenType.FungibleCommon : TokenType.NonFungibleUnique);
    }

    const changeSupplyType = (evt: string) => {
        changeState("supplyType", evt === "Infinite" ? TokenSupplyType.Infinite : TokenSupplyType.Finite);
    }

    const changeState = (path: string, value: any) => {
        setTokenData(mapTree(tokenData, path, value));
    };

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="p-4">
                <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 text-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Create a token</h3>
                </div>

                <section className="py-4">
                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                        Owner
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

                <article className="flex">
                    <section className="p-2 pl-0">
                        <label htmlFor="tokenName" className="block text-sm font-medium text-gray-700">
                            Token Name:
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text" name="" id="tokenName" value={tokenData.name} onChange={(event: any) => { changeState("name", event.target.value) }} max="5" min="-5" />
                        </div>
                    </section>

                    <section className="p-2">
                        <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-700">
                            Token Symbol:
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text" name="" id="tokenSymbol" value={tokenData.symbol} onChange={(event: any) => { changeState("symbol", event.target.value) }} max="5" min="-5" />
                        </div>
                    </section>

                    <section className="py-2 pr-0">
                        <label htmlFor="tokenType" className="block text-sm font-medium text-gray-700">
                            Token Type:
                        </label>
                        <select
                            id="tokenType"
                            className="mt-1 block w-40 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            value={tokenData.type === TokenType.FungibleCommon ? 'Fungible' : "NFT"}
                            onChange={(event) => changeType(event.target.value)}
                        >
                            <option value="Fungible">Fungible</option>
                            <option value="NFT">Non-Fungible</option>
                        </select>
                    </section>
                </article>

                <div className="py-4">
                    <label htmlFor="tokenSupplyType" className="block text-sm font-medium text-gray-700">
                        Token Supply Type:
                    </label>
                    <select
                        id="tokenSupplyType"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        value={tokenData.supplyType === TokenSupplyType.Finite ? 'Finite' : "Infinite"}
                        onChange={(event) => changeSupplyType(event.target.value)}
                    >
                        <option value="Infinite">Infinite</option>
                        <option value="Finite">Finite</option>
                    </select>
                </div>

                <article className="flex">
                    <section className="p-2 pl-0">
                        <label htmlFor="initialSupply" className="block text-sm font-medium text-gray-700">
                            Initial Supply:
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="number" name="" id="initialSupply" value={tokenData.initialSupply} onChange={(event: any) => { changeState("initialSupply", Number(event.target.value)) }} min={0} />
                        </div>
                    </section>

                    {tokenData.supplyType === TokenSupplyType.Finite && <section className="p-2">
                        <label htmlFor="maxSupply" className="block text-sm font-medium text-gray-700">
                            Max Supply:
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="number" name="" id="maxSupply" value={tokenData.maxSupply} onChange={(event: any) => { changeState("maxSupply", Number(event.target.value)) }} min={0} />
                        </div>
                    </section>}

                    {tokenData.type === TokenType.FungibleCommon && <section className="p-2 pr-0">
                        <label htmlFor="decimals" className="block text-sm font-medium text-gray-700">
                            Decimals:
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="number" name="" id="decimals" min={0} value={tokenData.decimals} onChange={(event: any) => { changeState("decimals", Number(event.target.value)) }} />
                        </div>
                    </section>}
                </article>

                <hr />

                <section className="my-2">
                    <input type="checkbox" name="" id="includeRoyalty" checked={tokenData.includeRoyalty} onChange={(event: any) => changeState("includeRoyalty", event.target.checked)} />
                    <label htmlFor="includeRoyalty" className="px-3">Include Royalty</label>
                </section>

                {tokenData.includeRoyalty && <article className="flex">
                    <section className="p-2 pl-0">
                        <label htmlFor="royaltyPercent" className="block text-sm font-medium text-gray-700">
                            Royalty Percentage:
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="number" name="" id="royaltyPercent" min={1} max={100} value={tokenData.royaltyPercent} onChange={(event: any) => { changeState("royaltyPercent", Number(event.target.value)) }} />
                        </div>
                    </section>
                    <section className="p-2 pr-0">
                        <label htmlFor="fallbackFee" className="block text-sm font-medium text-gray-700">
                            Royalty Fallback (receiver pays if fungible exchanged is 0)
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="number" name="" id="fallbackFee" min={1} max={100} value={tokenData.fallbackFee} onChange={(event: any) => { changeState("fallbackFee", Number(event.target.value)) }} />
                        </div>
                    </section>
                </article>}

                <hr />

                <section className="my-2">
                    <input type="checkbox" name="" id="includeFixedFee" checked={tokenData.includeFixedFee} onChange={(event: any) => changeState("includeFixedFee", event.target.checked)} />
                    <label htmlFor="includeFixedFee" className="px-3">Include Fixed Fee</label>
                </section>

                {tokenData.includeFixedFee && <article className="flex">
                    <section className="p-2 pl-0">
                        <label htmlFor="fixedFee" className="block text-sm font-medium text-gray-700">
                            Fixed Fee:
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-60 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="number" name="" id="fixedFee" min={1} max={100} value={tokenData.fixedFee} onChange={(event: any) => { changeState("fixedFee", Number(event.target.value)) }} />
                        </div>
                    </section>
                    <section className="p-2 pr-0">
                        <label htmlFor="fixedTokenId" className="block text-sm font-medium text-gray-700">
                            Fixed Fee Token ID
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text" name="" id="fixedTokenId" value={tokenData.fixedTokenId} onChange={(event: any) => { changeState("fixedTokenId", event.target.value) }} />
                        </div>
                    </section>
                </article>}

                <hr />

                <section className="my-2">
                    <input type="checkbox" name="" id="includeFractionalFee" checked={tokenData.includeFractionalFee} onChange={(event: any) => changeState("includeFractionalFee", event.target.checked)} />
                    <label htmlFor="includeFractionalFee" className="px-3">Include Fractional Fee</label>
                </section>

                {tokenData.includeFractionalFee && <article className="flex">
                    <section className="p-2 pl-0">
                        <label htmlFor="fractionalFeePercent" className="block text-sm font-medium text-gray-700">
                            Fractional Fee Percent:
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="number" name="" id="fractionalFeePercent" min={1} max={100} value={tokenData.fractionalFee.percent} onChange={(event: any) => { changeState("fractionalFee.percent", Number(event.target.value)) }} />
                        </div>
                    </section>

                    <section className="p-2">
                        <label htmlFor="fractionalFeeMax" className="block text-sm font-medium text-gray-700">
                            Fractional Fee Max
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="number" name="" id="fractionalFeeMax" min={0} max={100} value={tokenData.fractionalFee.max} onChange={(event: any) => { changeState("fractionalFee.max", Number(event.target.value)) }} />
                        </div>
                    </section>

                    <section className="p-2 pr-0">
                        <label htmlFor="fractionalFeeMin" className="block text-sm font-medium text-gray-700">
                            Fractional Fee Min
                        </label>
                        <div className="mt-1">
                            <input
                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="number" name="" id="fractionalFeeMin" min={0} max={100} value={tokenData.fractionalFee.min} onChange={(event: any) => { changeState("fractionalFee.min", Number(event.target.value)) }} />
                        </div>
                    </section>
                </article>}

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

export default CreateTokenModal;