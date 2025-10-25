// components/DifficultySelectionScreen.tsx
import React from 'react';
import { Grade, Difficulty, difficulties } from '../data/topics';

interface DifficultySelectionScreenProps {
  grade: Grade;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const DifficultySelectionScreen: React.FC<DifficultySelectionScreenProps> = ({ grade, onSelectDifficulty, onBack }) => {
  return (
    <div className="p-8 bg-slate-800 rounded-2xl shadow-2xl animate-fade-in w-full max-w-2xl text-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Grade {grade}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 transition-colors"
        >
          &larr; Back
        </button>
      </div>
      <p className="text-slate-300 mb-8">Now, select a difficulty level.</p>
      <div className="flex flex-col gap-4">
        {difficulties.map(difficulty => (
          <button
            key={difficulty}
            onClick={() => onSelectDifficulty(difficulty)}
            className="p-4 bg-slate-700 text-white font-bold text-lg rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200 transform hover:scale-105"
          >
            {difficulty}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelectionScreen;