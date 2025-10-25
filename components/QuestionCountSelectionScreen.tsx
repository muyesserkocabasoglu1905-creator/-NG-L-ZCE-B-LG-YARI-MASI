import React, { useState } from 'react';

interface QuestionCountSelectionScreenProps {
  availableQuestions: number;
  onStart: (count: number) => void;
  onBack: () => void;
}

const QuestionCountSelectionScreen: React.FC<QuestionCountSelectionScreenProps> = ({
  availableQuestions,
  onStart,
  onBack,
}) => {
  const maxQuestions = Math.min(availableQuestions, 10);
  const [questionCount, setQuestionCount] = useState(Math.min(maxQuestions, 5));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(questionCount);
  };

  return (
    <div className="p-8 bg-slate-800 rounded-2xl shadow-2xl animate-fade-in w-full max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Start Quiz from Bank
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 transition-colors"
        >
          &larr; Back
        </button>
      </div>

      <p className="text-center text-slate-300 mb-6">
        There are <span className="font-bold text-purple-400">{availableQuestions}</span> questions available in the bank for your selected criteria.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            How many questions would you like? <span className='font-bold text-purple-400'>{questionCount}</span>
          </label>
          <input
            type="range"
            min="1"
            max={maxQuestions > 0 ? maxQuestions : 1}
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            disabled={maxQuestions === 0}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1</span>
            <span>{maxQuestions > 0 ? maxQuestions : 1}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-8 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform duration-200 transform hover:scale-105"
          disabled={maxQuestions === 0}
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
};

export default QuestionCountSelectionScreen;