import React, { useState, useEffect } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import DocumentCard from "../../components/documents/DocumentCard";
import Button from "../../components/common/Button";

const DocumentListPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploading, setUploading] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const fetchDocuments = async () => {
        try {
            const data = await documentService.getDocuments();
            setDocuments(data.data);
        } catch (error) {
            toast.error('Failed to fetch documents.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            setUploadFile(file);
            setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile || !uploadTitle) {
            toast.error('Please provide a title and select a file.');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('title', uploadTitle);

        try {
            await documentService.uploadDocument(formData);
            toast.success('Document uploaded successfully.');
            setIsUploadModalOpen(false);
            setUploadFile(null);
            setUploadTitle('');
            setLoading(true);
            fetchDocuments();
        } catch (error) {
            toast.error(error.message || "Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteRequest = (doc) => {
        setSelectedDoc(doc);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedDoc) return;
        setDeleting(true);
        try {
            await documentService.deleteDocument(selectedDoc._id);
            toast.success(`'${selectedDoc.title}' deleted.`);
            setIsDeleteModalOpen(false);
            setSelectedDoc(null);
        } catch (error) {
            toast.error(error.message || 'Failed to delete document.');
        } finally {
            setDeleting(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Spinner />
                </div>
            );
        }

        if (documents.length === 0) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-sm bg-[#ffd400] border-2 border-black shadow-[4px_4px_0px_#000] mb-6">
                            <FileText
                                className="w-10 h-10 text-black"
                                strokeWidth={2.5}
                            />
                        </div>
                        <h3 className="text-xl font-medium text-black tracking-tight mb-2">
                            No Documents Yet
                        </h3>
                        <p className="text-sm text-neutral-700 mb-6">
                            Get started by uploading your first PDF document to begin learning.
                        </p>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffd400] text-black text-sm font-semibold rounded-sm border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Upload Document
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {documents?.map((doc) => (
                    <DocumentCard
                        key={doc._id}
                        document={doc}
                        onDelete={handleDeleteRequest}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="h-full relative w-full">
            {/*Sublte Background Pattern*/}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#111_1px,transparent_1px)] bg-[size:18px_18px] opacity-15" />

            <div className="relative p-10 mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 mb-10">
                    <div>
                        <h1 className="text-2xl font-medium text-black tracking-tight mb-2">
                            My Documents
                        </h1>
                        <p className="text-neutral-700 text-sm">
                            Manage and organize your learning materials
                        </p>
                    </div>
                    {documents.length > 0 && (
                        <Button onClick={() => setIsUploadModalOpen(true)}>
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Upload Document
                        </Button>
                    )}
                </div>
                {renderContent()}
            </div>

            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="relative w-full max-w-lg bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[6px_6px_0px_#000] p-6">
                        <button
                            onClick={() => setIsUploadModalOpen(false)}
                            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-black border-2 border-black rounded-sm hover:bg-[#ffd400] transition-all duration-150"
                        >
                            <X className="w-5 h-5" strokeWidth={2} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-medium text-black tracking-tight">
                                Upload New Document
                            </h2>
                            <p className="text-sm text-neutral-700 mt-1">
                                Add a PDF document to your library
                            </p>
                        </div>
                        <form onSubmit={handleUpload} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-black tracking-wide uppercase">
                                    Document Title
                                </label>
                                <input type="text"
                                    value={uploadTitle}
                                    onChange={(e) => setUploadTitle(e.target.value)}
                                    required
                                    className="w-full h-12 px-4 border-2 border-black rounded-sm bg-white text-black placeholder-neutral-500 text-sm font-medium transition-all duration-150 focus:outline-none focus:border-black"
                                    placeholder="e.g., React Interview Prep" />
                            </div>
                            <div className="space-y-2" >
                                <label className="block text-xs font-semibold text-black tracking-wide uppercase">
                                    PDF File
                                </label>
                                <div className="relative border-2 border-dashed border-black rounded-sm bg-white hover:bg-[#ffd400] transition-all duration-150">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        name="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center justify-center px-10 py-6">
                                        <div className="w-14 h-14 rounded-sm bg-black border-2 border-black flex items-center justify-center mb-4">
                                            <Upload className="w-7 h-7 text-[#f6f3ea]" strokeWidth={2} />
                                        </div>
                                        <p className="text-sm font-medium text-black mb-1">
                                            {uploadFile ? (
                                                <span className="text-black">
                                                    {uploadFile.name}
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="text-black">Click to upload</span>{""}
                                                    or drag and drop
                                                </>
                                            )}
                                        </p>
                                        <p className="text-xs text-neutral-700">PDF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    disabled={uploading}
                                    className="flex-1 h-11 px-4 border-2 border-black rounded-sm bg-white text-black text-sm font-semibold hover:bg-[#f6f3ea] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 h-11 px-4 bg-black text-[#f6f3ea] text-sm font-semibold rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5">
                                    {uploading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Uploading...
                                        </span>
                                    ) : (
                                        "Upload"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="relative w-full max-w-md bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[6px_6px_0px_#000] p-8">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-sm text-black border-2 border-black hover:bg-[#ffd400] transition-all duration-150"
                    >
                        <X className="w-5 h-5" strokeWidth={2}></X>
                    </button>

                    <div className="mb-6">
                        <div className="w-12 h-12 rounded-sm bg-[#ff5c5c] border-2 border-black flex items-center justify-center mb-4">
                            <Trash2 className="w-6 h-6 text-black" strokeWidth={2}></Trash2>
                        </div>
                        <h2 className="text-xl font-medium text-black tracking-tight">
                            Confirm Deletion
                        </h2>
                    </div>

                    <p className="text-sm text-neutral-700 mb-6">
                        Are you sure you want to delete this document:{""}
                        <span className="font-semibold text-black">
                            {selectedDoc.title}
                        </span>
                        ? This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleting}
                            className="flex-1 h-11 px-4 border-2 border-black rounded-sm bg-white text-black text-sm font-semibold hover:bg-[#f6f3ea] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            className="flex-1 h-11 px-4 bg-black text-[#f6f3ea] text-sm font-semibold rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5"
                        >
                            {deleting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Deleting...
                                </span>
                            ) : (
                                "Delete"
                            )}
                        </button>
                    </div>
                </div>
            </div>)}
        </div>
    )
}

export default DocumentListPage
