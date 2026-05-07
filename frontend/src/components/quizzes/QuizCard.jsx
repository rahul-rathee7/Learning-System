import React from "react";
import { Trash2, Award, Play, BarChart2 } from "lucide-react";
import { Link } from 'react-router-dom'
import moment from "moment";

const QuizCard = ({ quiz, onDelete }) => {
    return (
        <div className="group relative bg-[#f7f2e8] border-2 border-black rounded-sm p-4 shadow-[4px_4px_0px_#000] transition-all duration-150 flex flex-col justify-between">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(quiz);
                }}
                className="absolute top-4 right-4 p-2 text-black hover:bg-[#ff5c5c] border-2 border-black rounded-sm transition-all duration-150 opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
            </button>

            <div className="space-y-4">
                {/*Status Badge*/}
                <div className="inline-flex items-center gap-1.5 py-1 rounded-sm text-xs font-semibold">
                    <div className="flex items-center gap-1.5 bg-[#ffd400] border-2 border-black rounded-sm px-3 py-1">
                        <Award className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                        <span className="text-black">Score: {quiz?.score}</span>
                    </div>
                </div>

                <div>
                    <h3
                        className="text-base font-semibold text-black mb-1 line-clamp-2"
                        title={quiz.title}
                    >
                        {quiz.title ||
                            `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
                    </h3>
                    <p className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
                        Created {moment(quiz.createdAt).format("MMM D, YYYY")}
                    </p>
                </div>

                {/*Quiz Info*/}
                <div className="flex items-center gap-3 pt-2 border-t-2 border-black">
                    <div className="px-3 py-1.5 bg-white border-2 border-black rounded-sm">
                        <span className="text-sm font-semibold text-black">
                            {quiz.questions.length}{" "}
                            {quiz.questions.length === 1 ? "Question" : "Questions"}
                        </span>
                    </div>
                </div>
            </div>

            {/*Action Button*/}
            <div className="mt-2 pt-4 border-t-2 border-black">
                {quiz?.userAnswers?.length > 0 ? (
                    <Link to={`/quizzes/${quiz._id}/results`}>
                        <button className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 bg-white text-black font-semibold text-sm rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer">
                            <BarChart2 className="w-4 h-4" strokeWidth={2.5} />
                            View Results
                        </button>
                    </Link>
                ) : (
                    <Link to={`/quizzes/${quiz._id}`}>
                        <button className="group/btn relative w-full h-11 bg-black text-[#f6f3ea] font-semibold text-sm rounded-sm border-2 border-black shadow-[3px_3px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Play className="w-4 h-4" strokeWidth={2.5} />
                                Start Quiz
                            </span>
                        </button>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default QuizCard