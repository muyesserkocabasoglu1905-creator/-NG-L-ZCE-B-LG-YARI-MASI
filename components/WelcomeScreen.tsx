import React from 'react';

interface WelcomeScreenProps {
  onStartNewQuiz: () => void;
  onStartFromBank: () => void;
  onViewQuestionBank: () => void;
  onViewHighScores: () => void;
  error: string | null;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartNewQuiz, onStartFromBank, onViewQuestionBank, onViewHighScores, error }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in w-full h-full">
      <div className="w-full max-w-3xl">
        <h1 className="text-6xl sm:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-12">
          ÇINARPROJECT
        </h1>
        
        {error && <p className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</p>}

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={onStartNewQuiz}
            className="w-full px-8 py-6 bg-purple-600 text-white text-2xl font-bold rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform duration-200 transform hover:scale-105"
          >
            New Quiz
          </button>
          <button
            onClick={onStartFromBank}
            className="w-full px-6 py-4 bg-teal-600 text-white text-xl font-bold rounded-full hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500 transition-transform duration-200 transform hover:scale-105"
          >
            Start Quiz from Bank
          </button>
          <button
            onClick={onViewQuestionBank}
            className="w-full px-6 py-4 bg-slate-700 text-white text-xl font-bold rounded-full hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-transform duration-200 transform hover:scale-105"
          >
            Question Bank
          </button>
          <button
            onClick={onViewHighScores}
            className="w-full px-6 py-4 bg-slate-700 text-white text-xl font-bold rounded-full hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-transform duration-200 transform hover:scale-105"
          >
            High Scores
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;