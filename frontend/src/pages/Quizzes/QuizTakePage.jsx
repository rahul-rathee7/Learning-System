import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import quizService from '../../services/quizService'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import { option } from 'framer-motion/client'

const QuizTakePage = () => {

  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        toast.error('Failed to fetch quiz.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, questionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: questionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };


  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.keys(selectedAnswers).map(questionId => {
        const question = quiz.questions.find(q => q._id === questionId)
        const questionIndex = quiz.questions.findIndex(q => q._id === questionId)
        const optionIndex = selectedAnswers[questionId]
        const selectedAnswer = question.options[optionIndex]
        return { questionIndex, selectedAnswer }
      })

      await quizService.submitQuiz(quizId, formattedAnswers)
      toast.success('Quiz submitted successfully!')
      navigate(`/quizzes/${quizId}/results`)
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Spinner />
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <p className='text-neutral-700 text-lg'>Quiz not found or has no questions.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = Object.prototype.hasOwnProperty.call(selectedAnswers, currentQuestion._id);
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className='max-w-4xl mx-auto'>
      <PageHeader title={quiz.title || 'Take Quiz'} />

      {/*Progess bar*/}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-semibold text-black'>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className='text-sm font-medium text-neutral-700'>
            {answeredCount} answered
          </span>
        </div>
        <div className='relative h-2 bg-white border-2 border-black rounded-sm overflow-hidden'>
          <div
            className='absolute inset-y-0 left-0 bg-black transition-all duration-500 ease-out'
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/*Question Card*/}
      <div className='bg-[#f7f2e8] border-2 border-black rounded-sm shadow-[4px_4px_0px_#000] p-6 mb-8'>
        <div className='inline-flex items-center gap-2 px-4 py-2 bg-[#ffd400] border-2 border-black rounded-sm mb-6'>
          <div className='w-2 h-2 bg-black rounded-full animate-pulse' />
          <span className='text-sm font-semibold text-black'>
            Question {currentQuestionIndex + 1}
          </span>
        </div>

        <h3 className='text-lg font-semibold text-black mb-6 leading-relaxed'>
          {currentQuestion.question}
        </h3>

        {/*Options*/}
        <div className='space-y-3'>{currentQuestion?.options?.map((option, index) => {
          const isSelected = selectedAnswers[currentQuestion._id] === index;

          return (
            <label
              key={index}
              className={`group relative flex items-center p-3 border-2 rounded-sm cursor-pointer transition-all duration-150 ${isSelected
                ? 'border-black bg-[#ffd400]'
                : 'border-black bg-white hover:bg-[#f6f3ea]'
                }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion._id}`}
                value={index}
                checked={isSelected}
                onChange={() =>
                  handleOptionChange(currentQuestion._id, index)
                }
                className="sr-only"
              />

              <div
                className={`shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-150 ${isSelected
                  ? 'bg-black border-black'
                  : 'bg-white border-black'
                  }`}
              >
                {isSelected && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Option Text */}
              <span
                className={`ml-4 text-sm font-medium transition-colors duration-150 ${isSelected
                  ? 'text-black'
                  : 'text-black'
                  }`}
              >
                {option}
              </span>

              {/* Checkmark */}
              {isSelected && (
                <CheckCircle2
                  className="ml-auto w-5 h-5 text-black"
                  strokeWidth={2.5}
                />
              )}
            </label>
          );
        })}
        </div>
      </div>

      {/*Navigation Buttons*/}
      <div className='flex items-center justify-between gap-4'>
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || submitting}
          variant='secondary'
        >
          <ChevronLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200' strokeWidth={2.5} />
          Previous
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className='group relative px-8 h-12 bg-black text-[#f6f3ea] font-semibold text-sm rounded-sm border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <span className='relative z-10 flex items-center justify-center gap-2'>
              {submitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Sumbitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className='w-4 h-4' strokeWidth={2.5} />
                  Submit Quiz
                </>
              )}
            </span>
          </button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={!isAnswered || submitting}
          >
            Next
            <ChevronRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200' strokeWidth={2.5} />
          </Button>
        )}
      </div>

      {/*Question Navigation Dots*/}
      <div className='mt-0 flex items-center justify-center gap-2 flex-wrap'>
        {quiz.questions.map((_, index) => {
          const isAnsweredQuestion = selectedAnswers.hasOwnProperty(quiz.questions[index]._id);
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={submitting}
              className={`w-8 h-8 rounded-sm border-2 border-black font-semibold text-xs transition-all duration-150 ${isCurrent
                ? 'bg-black text-[#f6f3ea] scale-110'
                : isAnsweredQuestion
                  ? 'bg-[#ffd400] text-black'
                  : 'bg-white text-black'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  )
}

export default QuizTakePage
