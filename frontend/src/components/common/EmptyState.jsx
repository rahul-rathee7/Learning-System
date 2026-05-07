import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({ onActionClick, title, description, buttonText }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[4px_4px_0px_#000]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-[#ffd400] border-2 border-black shadow-[3px_3px_0px_#000] mb-6">
                <FileText className="w-8 h-8 text-black" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
            <p className="text-sm text-neutral-700 mb-8 max-w-sm leading-relaxed">{description}</p>
            {buttonText && onActionClick && (
                <button
                    onClick={onActionClick}
                    className="group relative inline-flex items-center gap-2 px-6 h-11 bg-[#ffd400] text-black font-semibold text-sm rounded-sm border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        {buttonText}
                    </span>
                </button>
            )}
        </div>
    )
}

export default EmptyState