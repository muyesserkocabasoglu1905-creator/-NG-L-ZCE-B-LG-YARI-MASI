import React, { useState, useEffect } from 'react';
import { HighScore } from '../types';
import { getHighScores, clearHighScores } from '../utils/highScores';

interface HighScoresScreenProps {
  onBack: () => void;
}

const HighScoresScreen: React.FC<HighScoresScreenProps> = ({ onBack }) => {
  const [scores, setScores] = useState<HighScore[]>([]);

  useEffect(() => {
    setScores(getHighScores());
  }, []);

  const handleClearScores = () => {
    if (window.confirm('Are you sure you want to delete all high scores? This action cannot be undone.')) {
        clearHighScores();
        // Re-fetch from the source of truth (localStorage) to ensure UI consistency.
        setScores(getHighScores());
    }
  }

  return (
    <div className="p-4 sm:p-8 bg-slate-800 rounded-2xl shadow-2xl animate-fade-in w-full max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          High Scores
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 transition-colors"
        >
          &larr; Back
        </button>
      </div>

      {scores.length === 0 ? (
        <p className="text-center text-slate-400 py-12">No high scores yet. Play a quiz to get on the board!</p>
      ) : (
        <>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {scores.map((score, index) => (
              <div key={score.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-purple-400 w-6 text-center">{index + 1}</span>
                  <div>
                    <p className="font-semibold text-slate-200 text-lg">{score.name}</p>
                    <p className="text-sm text-slate-400">
                      Topic: {score.topic} | Grade {score.grade} - {score.difficulty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{score.score.toLocaleString()} pts</p>
                  <p className="text-sm text-slate-400">{score.correctAnswers}/{score.totalQuestions} ({score.percentage}%)</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={handleClearScores}
              className="px-6 py-2 bg-red-800 text-white font-bold rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 transition-colors"
            >
              Clear High Scores
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HighScoresScreen;