// Fix: Implemented the PostGenerationScreen component to display generated questions before starting the quiz.
import React from 'react';
import { QuizQuestion } from '../types';

interface PostGenerationScreenProps {
  questions: QuizQuestion[];
  onStart: () => void;
  onReGenerate: () => void;
  onGoHome: () => void;
}

const PostGenerationScreen: React.FC<PostGenerationScreenProps> = ({ questions, onStart, onReGenerate, onGoHome }) => {
  if (!questions || questions.length === 0) {
    return (
        <div className="text-center p-8 bg-slate-800 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Generation Failed</h2>
            <p className="text-slate-300 mb-6">We couldn't create your quiz. Please try again with different settings.</p>
            <button
                onClick={onReGenerate}
                className="w-full sm:w-auto px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700"
            >
                Try Again
            </button>
        </div>
    );
  }

  return (
    <div className="text-center p-8 bg-slate-800 rounded-2xl shadow-2xl animate-fade-in w-full">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
        Your Quiz is Ready!
      </h2>
      <p className="text-lg text-slate-300 mb-6">
        We've generated <span className="font-bold text-purple-400">{questions.length}</span> questions for you.
      </p>
      
      <div className="text-left bg-slate-900/50 p-4 rounded-lg max-h-60 overflow-y-auto mb-8 border border-slate-700">
        <h3 className="font-bold text-slate-200 mb-2">Generated Questions:</h3>
        <ul className="list-decimal list-inside space-y-2 text-slate-400">
          {questions.map((q, index) => (
            <li key={index} className="truncate">{q.question}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={onStart}
          className="w-full px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform duration-200 transform hover:scale-105"
        >
          Start Quiz
        </button>
        <button
          onClick={onReGenerate}
          className="w-full px-6 py-3 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-transform duration-200 transform hover:scale-105"
        >
          Create New Quiz
        </button>
        <button
          onClick={onGoHome}
          className="w-full px-6 py-3 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-transform duration-200 transform hover:scale-105"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default PostGenerationScreen;
