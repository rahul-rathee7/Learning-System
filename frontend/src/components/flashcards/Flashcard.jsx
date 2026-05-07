import { useState } from "react";
import { Star, RotateCcw } from 'lucide-react'

const Flashcard = ({ flashcard, onToggleStar }) => {

    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return <div className="relative w-full h-72" style={{ perspective: '1000px' }}>
        <div
            className={`relative w-full h-full transform transition-transform duration-500 transform-gpu cursor-pointer`}
            style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
            onClick={handleFlip}
        >
            {/*Front of the card(Question)*/}
            <div
                className="absolute inset-0 w-full h-full bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[4px_4px_0px_#000] p-8 flex flex-col justify-between"
                style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                }}
            >
                {/*Star Button*/}
                <div className="flex items-start justify-between">
                    <div className='bg-black text-[10px] text-[#f6f3ea] border-2 border-black rounded-sm px-4 py-1 uppercase'>{flashcard?.difficulty}</div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStar(flashcard._id);
                        }}
                        className={`w-9 h-9 rounded-sm border-2 border-black flex items-center justify-center transition-all duration-150 ${flashcard.isStarred
                            ? 'bg-[#ffd400] text-black shadow-[3px_3px_0px_#000]'
                            : 'bg-white text-black hover:bg-[#ffd400]'
                            }`}
                    >
                        <Star
                            className="w-4 h-4"
                            strokeWidth={2}
                            fill={flashcard.isStarred ? 'currentColor' : 'none'}
                        />
                    </button>
                </div>

                {/*Question Content*/}
                <div className="flex-1 flex items-center justify-center px-4 py-6">
                    <p className="text-lg font-semibold text-black text-center leading-relaxed">
                        {flashcard.questions}
                    </p>
                </div>

                {/*Flip Indicator*/}
                <div className="flex items-center justify-center gap-2 text-xs text-neutral-700 font-medium">
                    <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Click to reveal answer</span>
                </div>
            </div>

            {/*Back of the card(Answer)*/}
            <div
                className="absolute inset-0 w-full h-full bg-black border-2 border-black rounded-sm shadow-[4px_4px_0px_#000] p-8 flex flex-col justify-between"
                style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                }}
            >
                {/*Star Button*/}
                <div className="flex justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStar(flashcard._id);
                        }}
                        className={`w-9 h-9 rounded-sm border-2 border-[#f6f3ea] flex items-center justify-center transition-all duration-150 ${flashcard.isStarred
                            ? 'bg-[#ffd400] text-black'
                            : 'bg-transparent text-[#f6f3ea] hover:bg-[#ffd400] hover:text-black'
                            }`}
                    >
                        <Star
                            className="w-4 h-4"
                            strokeWidth={2}
                            fill={flashcard.isStarred ? 'currentColor' : 'none'}
                        />
                    </button>
                </div>

                {/*Answer Content*/}
                <div className="flex-1 flex items-center justify-center px-4 py-6">
                    <p className="text-base text-[#f6f3ea] text-center leading-relaxed font-medium">
                        {flashcard.answers}
                    </p>
                </div>

                {/*Flip Indicator*/}
                <div className="flex items-center justify-center gap-2 text-xs text-[#f6f3ea] font-medium">
                    <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Click to see question</span>
                </div>
            </div>
        </div>
    </div>
}

export default Flashcard