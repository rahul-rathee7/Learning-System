import React from "react";
import { useNavigate } from 'react-router-dom'
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return 'N/A';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({
    document, onDelete
}) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(document);
    };

    return <div
        className="group relative bg-[#f7f2e8] border-2 border-black rounded-sm p-5 shadow-[4px_4px_0px_#000] transition-all duration-150 flex flex-col justify-between cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5"
        onClick={handleNavigate}
    >
        <div>
            <div className="flex flex-start justify-between gap-3 mb-4">
                <div className="shrink-0 w-12 h-12 bg-[#ffd400] border-2 border-black rounded-sm flex items-center justify-center shadow-[3px_3px_0px_#000]">
                    <FileText className="w-6 h-6 text-black" strokeWidth={2} />
                </div>
                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-black hover:bg-[#ff5c5c] border-2 border-black rounded-sm transition-opacity duration-150"
                >
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                </button>
            </div>
            <h3 className="text-base font-semibold text-black truncate mb-2" title={document.title}>
                {document.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-neutral-700 mb-3">
                {document.fileSize !== undefined && (
                    <>
                        <span className="font-medium">{formatFileSize(document.fileSize)}</span>
                    </>
                )}
            </div>

            <div className="flex items-center gap-3">
                {document.flashcardCount !== undefined && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black text-[#f6f3ea] border-2 border-black rounded-sm">
                        <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="text-xs font-semibold">{document.flashcardCount}</span>
                    </div>
                )}
                {document.quizCount !== undefined && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#ffd400] border-2 border-black rounded-sm">
                        <BrainCircuit className="w-3.5 h-3.5 text-black" strokeWidth={2} />
                        <span className="text-xs font-semibold text-black">{document.quizCount}</span>
                    </div>
                )}
            </div>
        </div>
        <div className="mt-5 pt-4 border-t-2 border-black">
            <div className="flex items-center gap-1.5 text-xs text-neutral-700">
                <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                <span>Uploaded {moment(document.createdAt).fromNow()}</span>
            </div>

        </div>
    </div>
}

export default DocumentCard