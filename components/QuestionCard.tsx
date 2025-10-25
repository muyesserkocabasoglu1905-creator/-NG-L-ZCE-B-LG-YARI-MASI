import React, { useState, useEffect, useMemo } from 'react';
import { QuizQuestion } from '../types';
import { playCorrectSound, playIncorrectSound, playTimeoutSound } from '../services/soundService';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean, timeLeft: number) => void;
  onFinishQuiz: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const TIMER_DURATION = 40;

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onFinishQuiz,
}) => {
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);

  // Reset state when question changes
  useEffect(() => {
    setFeedback(null);
    setSelectedAnswer(null);
    setSubmitted(false);
    setTimeLeft(TIMER_DURATION);
  }, [question]);
  
  // Timer logic
  useEffect(() => {
    if (submitted) {
      return;
    }
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      // Time is up
      handleAnswerSubmit(false, { isTimeout: true });
    }
  }, [timeLeft, submitted]);

  const handleAnswerSubmit = (isCorrect: boolean, options: { isTimeout?: boolean } = {}) => {
    const { isTimeout = false } = options;
    if (submitted) return;
    setSubmitted(true);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isTimeout) {
      playTimeoutSound();
    } else {
      isCorrect ? playCorrectSound() : playIncorrectSound();
    }
    
    setTimeout(() => {
      onAnswer(isCorrect, isTimeout ? 0 : timeLeft);
    }, 1500); // Wait 1.5 seconds before moving to the next question
  };

  const renderMultipleChoice = () => {
    const { options, correctAnswer } = question as import('../types').MultipleChoiceQuestion;
    
    const getButtonClass = (option: string) => {
        if (!submitted) {
            return 'bg-slate-700 hover:bg-purple-600';
        }
        if (option === correctAnswer) {
            return 'bg-green-600';
        }
        if (option === selectedAnswer) {
            return 'bg-red-600';
        }
        return 'bg-slate-700 opacity-50';
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {options.map((option) => (
            <button
                key={option}
                onClick={() => {
                    setSelectedAnswer(option);
                    handleAnswerSubmit(option === correctAnswer);
                }}
                disabled={submitted}
                className={`w-full p-6 text-white text-xl font-bold rounded-lg text-left transition-all duration-300 transform disabled:cursor-not-allowed ${getButtonClass(option)}`}
            >
                {option}
            </button>
            ))}
      </div>
    );
  };

  const renderFillInTheBlank = () => {
    const { correctAnswer } = question as import('../types').FillInTheBlankQuestion;
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedAnswer) {
            const isCorrect = selectedAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
            handleAnswerSubmit(isCorrect);
        }
    }

    const getInputBorderClass = () => {
        if (!submitted) return 'border-slate-600 focus:border-purple-500 focus:ring-purple-500';
        return feedback === 'correct' ? 'border-green-500 ring-green-500' : 'border-red-500 ring-red-500';
    }

    return (
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          value={selectedAnswer || ''}
          onChange={(e) => setSelectedAnswer(e.target.value)}
          disabled={submitted}
          className={`bg-slate-700 border text-white text-2xl rounded-lg block w-full p-4 transition-colors ${getInputBorderClass()}`}
          placeholder="Your answer here..."
        />
        <button
          type="submit"
          disabled={submitted || !selectedAnswer}
          className="w-full px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      </form>
    );
  };
  
  const renderMatching = () => {
      const { pairs } = question as import('../types').MatchingQuestion;
      const terms = useMemo(() => pairs.map(p => p.term), [pairs]);
      const shuffledDefinitions = useMemo(() => shuffleArray(pairs.map(p => p.definition)), [pairs]);
      
      const [matches, setMatches] = useState<Record<string, string>>({});
      
      // Reset matches when question changes
      useEffect(() => {
        setMatches({});
      }, [question]);

      const handleSelect = (term: string, definition: string) => {
        setMatches(prev => ({...prev, [term]: definition}));
      };

      const handleSubmit = () => {
        let correctCount = 0;
        pairs.forEach(pair => {
            if (matches[pair.term] === pair.definition) {
                correctCount++;
            }
        });
        handleAnswerSubmit(correctCount === pairs.length);
      };

      const isCorrectMatch = (term: string) => {
        const correctDef = pairs.find(p => p.term === term)?.definition;
        return matches[term] === correctDef;
      };

      return (
          <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {terms.map((term) => (
                    <div key={term} className="flex items-center gap-3 bg-slate-700 p-3 rounded-lg">
                      <div className="flex-1 font-semibold text-slate-200">{term}</div>
                      <select 
                        value={matches[term] || ""}
                        onChange={(e) => handleSelect(term, e.target.value)}
                        disabled={submitted}
                        className={`bg-slate-800 border text-white text-sm rounded-lg p-2 flex-1
                            ${submitted && isCorrectMatch(term) && 'border-green-500'}
                            ${submitted && !isCorrectMatch(term) && 'border-red-500'}
                            ${!submitted && 'border-slate-600'}`
                        }
                      >
                        <option value="">Select a match...</option>
                        {shuffledDefinitions.map(def => <option key={def} value={def}>{def}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleSubmit} disabled={submitted || Object.keys(matches).length !== pairs.length}
                className="w-full mt-4 px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed">
                Submit Matches
              </button>
          </div>
      );
  }

  // Fix: Replaced unsafe `as any` cast with type-safe logic to correctly display the answer for all question types.
  const renderFeedbackMessage = () => {
    if (!feedback) return null;
    if (feedback === 'correct') {
      return <div className="mt-4 text-center text-green-400 font-bold text-2xl">Correct! 🎉</div>;
    }
    
    let answerText: string;
    if (question.type === 'multiple-choice' || question.type === 'fill-in-the-blank') {
        answerText = question.correctAnswer;
    } else if (question.type === 'matching') {
        answerText = question.pairs.map(p => `${p.term}: ${p.definition}`).join(', ');
    } else {
        answerText = "N/A";
    }
    
    const message = timeLeft === 0 ? "Time's up!" : "Incorrect.";

    return (
        <div className="mt-4 text-center text-red-400 font-bold text-2xl">
            {message} The correct answer is: <span className='text-red-300 font-normal block mt-1'>{answerText}</span>
        </div>
    );
  };
  
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / TIMER_DURATION) * circumference;

  return (
    <div className="relative p-8 md:p-12 animate-fade-in w-full h-full flex flex-col justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
              <h2 className="text-2xl font-bold text-purple-400">Question {questionNumber} of {totalQuestions}</h2>
              <p className="text-md text-slate-400 capitalize">{question.type.replace('-', ' ')}</p>
          </div>

          <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
                  <circle className="text-slate-700" strokeWidth="6" stroke="currentColor" fill="transparent" r={radius} cx="35" cy="35" />
                  <circle className="text-purple-500" strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="35" cy="35" style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <span className="absolute text-3xl font-bold text-white">{timeLeft}</span>
          </div>
        </div>

        <div className="w-full bg-slate-700 h-2 rounded-full mb-6">
          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(questionNumber / totalQuestions) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>

        <p className="text-4xl font-bold text-slate-200 mb-8">
          {question.question}
        </p>

        {question.type === 'multiple-choice' && renderMultipleChoice()}
        {question.type === 'fill-in-the-blank' && renderFillInTheBlank()}
        {question.type === 'matching' && renderMatching()}

        {submitted && renderFeedbackMessage()}
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to end the quiz? Your current score will be saved.')) {
              onFinishQuiz();
            }
          }}
          className="px-6 py-3 bg-red-800 text-white font-bold rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 transition-colors text-lg"
        >
          Finish Quiz
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;