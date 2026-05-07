import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, BookOpen, Lightbulb, Book } from 'lucide-react';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';
import MarkDownRenderer from '../common/MarkDownRenderer';
import Modal from '../common/Modal'

const AIActions = () => {

    const { id: documentId } = useParams();
    const [loadingAction, setLoadingAction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [concept, setConcept] = useState("");

    const handleGenerateSummary = async () => {
        setLoadingAction("summary");
        try {
            const res = await aiService.generateSummary(documentId);
            setModalTitle("Generated Summary");
            setModalContent(res.data.summary);
            setIsModalOpen(true);
        } catch (error) {
            toast.error('Failed to generate summary.', error);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleExplainConcept = async (e) => {
        e.preventDefault();
        if (!concept.trim()) {
            toast.error("Please enter a concept to explain.");
            return;
        }
        setLoadingAction("explanation");
        try {
            const res = await aiService.explainConcept(documentId, concept);
            setModalTitle(`Explanation of "${res.data.concept}"`);
            setModalContent(res.data.explanation);
            setIsModalOpen(true);
            setConcept("");
        } catch (error) {
            toast.error('Failed to explain concept.', error);
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <>
            <div className='bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[4px_4px_0px_#000] overflow-hidden'>
                {/*Header*/}
                <div className='px-6 py-5 border-b-2 border-black bg-[#f6f3ea]'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-sm bg-black shadow-[3px_3px_0px_#000] flex items-center justify-center'>
                            <Sparkles className='w-5 h-5 text-[#f6f3ea]' strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold text-black'>
                                AI Assistant
                            </h3>
                            <p className='text-xs text-neutral-700'>Powered by advanced AI</p>
                        </div>
                    </div>
                </div>

                <div className='p-6 space-y-6'>
                    {/*Generate Summary*/}
                    <div className='group p-5 bg-[#f6f3ea] rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150'>
                        <div className='flex items-start justify-between gap-4'>
                            <div className='flex-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <div className='w-8 h-8 rounded-sm bg-[#ffd400] border-2 border-black flex items-center justify-center'>
                                        <BookOpen className='w-4 h-4 text-black' strokeWidth={2} />
                                    </div>
                                    <h4 className='font-semibold text-black'>
                                        Generate Summary
                                    </h4>
                                </div>
                                <p className='text-sm text-neutral-700 leading-relaxed'>
                                    Get a concise summary of the entire document.
                                </p>
                            </div>
                            <button
                                onClick={handleGenerateSummary}
                                disabled={loadingAction === "summary"}
                                className='shrink-0 h-10 px-5 bg-[#ffd400] text-black text-sm font-semibold rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loadingAction === "summary" ? (
                                    <span className='flex items-center gap-2'>
                                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                                        Loading...
                                    </span>
                                ) : (
                                    "Summarize"
                                )}
                            </button>
                        </div>
                    </div>

                    {/*Explain Concept*/}
                    <div className='group p-5 bg-[#f6f3ea] rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150'>
                        <form onSubmit={handleExplainConcept}>
                            <div className='flex items-center gap-2 mb-3'>
                                <div className='w-10 h-10 rounded-sm bg-[#ffd400] border-2 border-black flex items-center justify-center'>
                                    <Lightbulb className='w-4 h-4 text-black' strokeWidth={2} />
                                </div>
                                <h4 className='font-semibold text-black'>
                                    Explain a concept
                                </h4>
                            </div>
                            <p className='text-sm text-neutral-700 leading-relaxed mb-4'>
                                Enter a topic or concept from the document to get a detailed explanation.
                            </p>
                            <div className='flex items-center gap-3'>
                                <input
                                    type='text'
                                    value={concept}
                                    onChange={(e) => setConcept(e.target.value)}
                                    placeholder="e.g., 'React Hooks'"
                                    className='flex-1 h-11 px-4 border-2 border-black rounded-sm bg-white text-black placeholder-neutral-500 text-sm font-medium transition-all duration-150 focus:outline-none focus:border-black'
                                    disabled={loadingAction === "explain"}
                                />
                                <button
                                    type='submit'
                                    disabled={loadingAction === "explain" || !concept.trim()}
                                    className='shrink-0 h-11 px-5 bg-black text-[#f6f3ea] text-sm font-semibold rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {loadingAction === "explain" ? (
                                        <span className='flex items-center gap-2'>
                                            <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                                            Loading...
                                        </span>
                                    ) : (
                                        "Explain"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/*Result Modal*/}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
            >
                <div className='max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate'>
                    <MarkDownRenderer content={modalContent} />
                </div>
            </Modal>
        </>
    )
}

export default AIActions;