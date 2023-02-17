import { PropsWithChildren, FC } from "react";


const Break: FC<PropsWithChildren> = ({ children }) => {
    return <div className="relative pt-4 pb-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">{children}</span>
        </div>
    </div>
}

export default Break;