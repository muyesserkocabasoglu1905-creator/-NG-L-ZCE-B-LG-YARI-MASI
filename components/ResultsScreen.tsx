import React from 'react';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, correctAnswers, onPlayAgain, onGoHome }) => {
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const getFeedback = () => {
    if (percentage === 100) return "Perfect Score! You're an English wizard! ✨";
    if (percentage >= 80) return "Excellent work! You really know your stuff. 🎉";
    if (percentage >= 60) return "Good job! A little more practice and you'll be an expert. 👍";
    if (percentage >= 40) return "Nice try! Keep practicing. You're getting there. 😊";
    return "Keep learning and try again! You can do it. 💪";
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800 rounded-2xl shadow-2xl animate-fade-in w-full max-w-2xl">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
        Quiz Complete!
      </h2>
      <p className="text-xl text-slate-300 mb-6">Your final score is</p>
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-slate-700"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className="text-purple-500"
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={(2 * Math.PI * 45) * (1 - percentage / 100)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white">{score}</span>
            <span className="text-slate-400">points</span>
        </div>
      </div>
      <p className="text-lg text-slate-300 mb-2">
        You answered <span className="font-bold text-purple-400">{correctAnswers}</span> out of <span className="font-bold text-purple-400">{totalQuestions}</span> questions correctly ({percentage}%).
      </p>
      <p className="text-lg text-slate-300 mb-8">{getFeedback()}</p>
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={onPlayAgain}
          className="w-full px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform duration-200 transform hover:scale-105"
        >
          Play Again
        </button>
        <button
          onClick={onGoHome}
          className="w-full px-6 py-3 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-transform duration-200 transform hover:scale-105"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;