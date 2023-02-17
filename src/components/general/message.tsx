import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const Message = (props: any) => {
    const releaseButtonRef = useRef(null);

    return (
        <Transition.Root show={true} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={releaseButtonRef} onClose={() => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className={`relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all p-4`}>
                                <div className='max-w-md max-h-full overflow-auto p-4'>
                                    <div className='text-sm text-start'>{props.children}</div>
                                    <button
                                        type="button"
                                        ref={releaseButtonRef}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mt-4 border-b-4 border-indigo-800 hover:border-indigo-1000 rounded"
                                        onClick={() => props.setMessage('')}
                                    >
                                        OK
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Message;