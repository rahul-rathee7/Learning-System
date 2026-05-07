import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from 'lucide-react'
import quizService from '../../services/quizService'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error('Failed to fetch quiz results.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Spinner />
      </div>
    );
  }

  if (!results || !results.data) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <p className='text-neutral-700 text-lg'>Quiz results not found.</p>
        </div>
      </div>
    );
  }

  const { data: { quiz, results: detailedResults } } = results;
  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-black';
    if (score >= 60) return 'text-[#b45309]';
    return 'text-[#b91c1c]';
  }

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! ';
    if (score >= 80) return 'Great job! ';
    if (score >= 70) return 'Good work! ';
    if (score >= 60) return 'Not bad! ';
    return 'Keep practicing! ';
  }

  const printData = () => {
    console.log(score);
  }

  setTimeout(() => {
    console.log(detailedResults)
    printData()
  }, 2000);

  return (
    <div className='max-w-5xl mx-auto'>
      {/*Back Button*/}
      <div className='mb-6'>
        <Link
          to={`/documents/${quiz.document._id}`}
          className='group inline-flex items-center gap-2 text-sm font-medium text-black hover:underline transition-colors duration-150'
        >
          <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' strokeWidth={2} />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

      {/*Score Card*/}
      <div className='bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[4px_4px_0px_#000] p-8 mb-8'>
        <div className='text-center space-y-6'>
          <div className='inline-flex items-center justify-center w-15 h-15 rounded-sm bg-[#ffd400] border-2 border-black shadow-[3px_3px_0px_#000]'>
            <Trophy className='w-7 h-7 text-black' strokeWidth={2} />
          </div>

          <div>
            <p className='text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-2'>
              Your Score
            </p>
            <div className={`inline-block text-5xl font-bold ${getScoreColor(score)} mb-2`}>
              {score}%
            </div>
            <p className='text-lg font-medium text-neutral-700'>
              {getScoreMessage(score)}
            </p>
          </div>

          {/*Stats*/}
          <div className='flex items-center justify-center gap-4 pt-4'>
            <div className='flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-sm'>
              <Target className='w-4 h-4 text-black' strokeWidth={2} />
              <span className='text-sm font-semibold text-black'>
                {totalQuestions} Total
              </span>
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-[#ffd400] border-2 border-black rounded-sm'>
              <CheckCircle2 className='w-4 h-4 text-black' strokeWidth={2} />
              <span className='text-sm font-semibold text-black'>
                {correctAnswers} Correct
              </span>
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-[#ff5c5c] border-2 border-black rounded-sm'>
              <XCircle className='w-4 h-4 text-black' strokeWidth={2} />
              <span className='text-sm font-semibold text-black'>
                {incorrectAnswers} Incorrect
              </span>
            </div>
          </div>

        </div>
      </div>

      {/*Questions Review*/}
      <div className='space-y-6'>
        <div className='flex items-center gap-3 mb-2'>
          <BookOpen className='w-5 h-5 text-black' strokeWidth={2} />
          <h3 className='text-lg font-semibold text-black'>Detailed Review</h3>
        </div>

        {
          detailedResults?.map((result, index) => {
            const userAnswerIndex = result?.options?.findIndex(opt => opt === result.selectedAnswer);
            const correctAnswerIndex = result.options?.findIndex(opt => opt === result.correctAnswer);
            const isCorrect = result.isCorrect;

            return (
              <div
                key={index}
                className='bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[4px_4px_0px_#000] p-6'
              >
                <div className='flex items-start justify-between gap-4 mb-3'>
                  <div className='flex-1'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-sm mb-3'>
                      <span className='text-xs font-semibold text-black'>
                        Question {index + 1}
                      </span>
                    </div>
                    <h4 className='text-base font-semibold text-black leading-relaxed'>
                      {result.question}
                    </h4>
                  </div>
                  <div className={`shrink-0 w-10 h-10 rounded-sm flex items-center justify-center border-2 border-black ${isCorrect
                    ? 'bg-[#ffd400]'
                    : 'bg-[#ff5c5c]'
                    }`}>
                    {isCorrect ? (
                      <CheckCircle2 className='w-5 h-5 text-black' strokeWidth={2.5} />
                    ) : (
                      <XCircle className='w-5 h-5 text-black' strokeWidth={2.5} />
                    )}
                  </div>
                </div>
                <div className='space-y-3 mb-4'>
                  {result.options?.map((option, optIndex) => {
                    const isCorrectOption = optIndex === correctAnswerIndex;
                    const isUserAnswer = optIndex === userAnswerIndex;
                    const isWrongAnswer = isUserAnswer && !isCorrect;

                    return (
                      <div
                        key={optIndex}
                        className={`relative px-4 py-3 rounded-sm border-2 transition-all duration-150 ${isCorrectOption
                          ? 'bg-[#ffd400] border-black'
                          : isWrongAnswer
                            ? 'bg-[#ff5c5c] border-black'
                            : 'bg-white border-black'
                          }`}
                      >
                        <div className='flex items-center justify-between gap-3'>
                          <span className={`text-sm font-medium ${isCorrectOption
                            ? 'text-black'
                            : isWrongAnswer
                              ? 'text-black'
                              : 'text-black'
                            }`}>
                            {option}
                          </span>
                          <div className='flex items-center gap-2'>
                            {isCorrectOption && (
                              <span className='inline-flex items-center gap-1 px-2 py-1 bg-black border-2 border-black rouned-sm text-xs font-semibold text-[#f6f3ea]'>
                                <CheckCircle2 className='w-3 h-3' strokeWidth={2.5} />
                                Correct
                              </span>
                            )}
                            {isWrongAnswer && (
                              <span className='inline-flex items-center gap-1 px-2 py-1 bg-black border-2 border-black rounded-sm text-xs font-semibold text-[#f6f3ea]'>
                                <XCircle className='w-3 h-3' strokeWidth={2.5} />
                                Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/*Explanation*/}
                {result.explanation && (
                  <div className='p-4 bg-white border-2 border-black rounded-sm'>
                    <div className='flex items-start gap-3'>
                      <div className='shrink-0 w-8 h-8 rounded-sm bg-[#ffd400] border-2 border-black flex items-center justify-center mt-0.5'>
                        <BookOpen className='w-4 h-4 text-black' strokeWidth={2} />
                      </div>
                      <div className='flex-1'>
                        <p className='text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1'>
                          Explanation
                        </p>
                        <p className='text-sm text-neutral-700 leading-relaxed'>
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/*Action Button*/}
      <div className='mt-8 flex justify-center'>
        <Link to={`/documents/${quiz.document._id}`} >
          <button className='group relative px-8 h-12 bg-black text-[#f6f3ea] font-semibold text-sm rounded-sm border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5'>
            <span className='relative z-10 flex items-center gap-2'>
              <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' strokeWidth={2.5} />
              Return to Document
            </span>
          </button>
        </Link>
      </div>
    </div>
  )
}

export default QuizResultPage
