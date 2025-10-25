// components/GradeSelectionScreen.tsx
import React from 'react';
import { Grade, grades } from '../data/topics';

interface GradeSelectionScreenProps {
  onSelectGrade: (grade: Grade) => void;
  onBack: () => void;
}

const GradeSelectionScreen: React.FC<GradeSelectionScreenProps> = ({ onSelectGrade, onBack }) => {
  return (
    <div className="p-8 bg-slate-800 rounded-2xl shadow-2xl animate-fade-in w-full max-w-2xl text-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Select a Grade
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 transition-colors"
        >
          &larr; Back
        </button>
      </div>
      <p className="text-slate-300 mb-8">Choose a grade level to view its saved questions in the Question Bank.</p>
      <div className="grid grid-cols-2 gap-4">
        {grades.map(grade => (
          <button
            key={grade}
            onClick={() => onSelectGrade(grade)}
            className="p-6 bg-slate-700 text-white font-bold text-xl rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200 transform hover:scale-105"
          >
            Grade {grade}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GradeSelectionScreen;