import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

export default function ParingStringBox(props: any) {
    const [noteVisible, setNoteVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const onClickCopy = () => {
        const input = inputRef.current;

        if (input) {
            input.select();
            navigator.clipboard.writeText(input.value);
            setNoteVisible(true);

            setTimeout(function () {
                setNoteVisible(false);
            }, 1500);
        }
    }

    return (
        <div>
            <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10 border-solid border border-neutral-400 rounded-l-lg">
                    <input
                        type="text"
                        name="string"
                        id="string"
                        ref={inputRef}
                        value={props?.string}
                        className="block w-full rounded-none rounded-l-md pl-2 pr-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        disabled={true}
                    />
                </div>
                <button
                    type="button"
                    onClick={onClickCopy}
                    className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <DocumentDuplicateIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <div hidden={!noteVisible} className="absolute top-[-34px] left-[-12px] pointer-events-none">
                        <span className="block relative bg-slate-100 p-1 shadow-sm shadow-slate-400 rounded-md arrow-down">Copied!</span>
                    </div>
                </button>
            </div>
        </div>
    )
}