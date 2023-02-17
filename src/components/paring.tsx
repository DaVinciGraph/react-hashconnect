import { useQRCode } from "next-qrcode";
import Break from "./general/break";
import Modal, { IModalProps } from "./general/modal";
import ParingStringBox from "./general/paringStringBox";
import { FC, useEffect } from "react";
import { useHashConnectContext } from "../contexts/hashconnect";

const ParingModal: FC<IModalProps> = ({ setLoadModal }) => {

    const { Canvas } = useQRCode();
    const { state, pairingString, connectToExtension } = useHashConnectContext();

    useEffect(() => {
        setLoadModal(state !== 'Paired');
    }, [state])

    return (
        <Modal width="sm:max-w-2xl" setShow={setLoadModal}>
            <article className="p-6">
                <h1 style={{ fontSize: "14pt" }}>
                    <strong>Paring to wallet:</strong>
                </h1>
                <Break> Using Hashconnect </Break>
                <div>
                    <button
                        onClick={() => {
                            connectToExtension();
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                    >
                        Pair to Hashconnect
                    </button>
                </div>
                <Break> Using Code </Break>
                <div>
                    <ParingStringBox string={pairingString} />
                    <br />
                    <div className="text-slate-500 text-xs w-64 text-center"> {`Copy this code, go to your hashpack wallet, find "connect to dapp" and paste it there and connect.`}</div>
                </div>
                <Break> Using QR Code </Break>
                <div className="flex justify-center">
                    {pairingString ? (
                        <Canvas
                            text={pairingString}
                            options={{
                                type: "image/jpeg",
                                quality: 0.3,
                                level: "M",
                                margin: 3,
                                scale: 4,
                                width: 200,
                            }}
                        />
                    ) : (
                        <span>No Qr code</span>
                    )}
                </div>
            </article>
        </Modal>
    );
}

export default ParingModal;