import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import moment from 'moment';

const FlashcardSetCard = ({ flashcardSet }) => {

    const navigate = useNavigate();

    const handleStudyNow = () => {
        navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
    };

    const reviewedCount = flashcardSet.cards.filter(card => card.lastReviewed).length;
    const totalCards = flashcardSet.cards.length;
    const progressPercentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

    return <div
        className='group relative bg-[#f7f2e8] border-2 border-black rounded-sm p-6 cursor-pointer shadow-[4px_4px_0px_#000] transition-all duration-150 flex flex-col justify-between'
        onClick={handleStudyNow}
    >
        <div className='space-y-4'>
            {/*Icon and Title*/}
            <div className='flex items-start gap-4'>
                <div className='shrink-0 w-12 h-12 rounded-sm bg-[#ffd400] border-2 border-black flex items-center justify-center'>
                    <BookOpen className='w-6 h-6 text-black' strokeWidth={2} />
                </div>
                <div className='flex-1 min-w-0'>
                    <h3 className='text-base font-semibold text-black line-clamp-2 mb-1' title={flashcardSet?.documentId?.title}>
                        {flashcardSet?.documentId?.title}
                    </h3>
                    <p className='text-xs font-medium text-neutral-700 uppercase tracking-wide'>
                        Created {moment(flashcardSet.createdAt).fromNow()}
                    </p>
                </div>
            </div>

            {/*Stats*/}
            <div className='flex items-center gap-3 pt-2'>
                <div className='px-3 py-1.5 bg-white border-2 border-black rounded-sm'>
                    <span className='text-sm font-semibold text-black'>
                        {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
                    </span>
                </div>
                {reviewedCount > 0 && (
                    <div className='flex items-center gap-1.5 px-3 py-1.5 bg-black border-2 border-black rounded-sm'>
                        <TrendingUp className='w-3.5 h-3.5 text-[#f6f3ea]' strokeWidth={2.5} />
                        <span className='text-sm font-semibold text-[#f6f3ea]'>
                            {progressPercentage}%
                        </span>
                    </div>
                )}
            </div>

            {/*Progess Bar*/}
            {totalCards > 0 && (
                <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs font-medium text-neutral-700'>
                            Progress
                        </span>
                        <span className='text-xs font-semibold text-black'>
                            {reviewedCount}/{totalCards} reviewed
                        </span>
                    </div>
                    <div className='relative h-2 bg-white border-2 border-black rounded-sm overflow-hidden'>
                        <div
                            className='absolute inset-y-0 left-0 bg-black transition-all duration-500 ease-out'
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}
        </div>

        {/*Study Button*/}
        <div className='mt-6 pt-4 border-t-2 border-black'>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleStudyNow();
                }}
                className='group/btn relative w-full h-11 bg-[#ffd400] text-black font-semibold text-sm rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5'
            >
                <span className='relative z-10 flex items-center justify-center gap-2'>
                    <Sparkles className='w-4 h-4' strokeWidth={2.5} />
                    Study Now
                </span>
            </button>
        </div>
    </div>
};

export default FlashcardSetCard;