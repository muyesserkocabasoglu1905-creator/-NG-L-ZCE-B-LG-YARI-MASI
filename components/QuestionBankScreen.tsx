import React, { useState, useEffect } from 'react';
import { getQuestionsFromBank, clearQuestionsFromBank } from '../utils/questionBank';
import { StoredQuestion, QuizQuestion } from '../types';
import { Grade, Difficulty } from '../data/topics';

interface QuestionBankScreenProps {
  onBack: () => void;
  grade: Grade;
  difficulty: Difficulty;
}

const QuestionBankScreen: React.FC<QuestionBankScreenProps> = ({ onBack, grade, difficulty }) => {
  const [questions, setQuestions] = useState<StoredQuestion[]>([]);

  const fetchQuestions = () => {
    const allStoredQuestions = getQuestionsFromBank();
    const filteredQuestions = allStoredQuestions.filter(
      q => q.grade === grade && q.difficulty === difficulty
    );
    filteredQuestions.sort((a, b) => b.timestamp - a.timestamp);
    setQuestions(filteredQuestions);
  };

  useEffect(() => {
    fetchQuestions();
  }, [grade, difficulty]);

  const handleClearBank = () => {
    if (window.confirm(`Are you sure you want to delete all ${questions.length} questions for Grade ${grade} (${difficulty})? This action cannot be undone.`)) {
      clearQuestionsFromBank(grade, difficulty);
      // Re-fetch from the source of truth (localStorage) to ensure the UI is in sync.
      fetchQuestions();
    }
  };

  const renderAnswer = (question: QuizQuestion) => {
    switch (question.type) {
      case 'multiple-choice':
      case 'fill-in-the-blank':
        return <p className="text-green-400">{question.correctAnswer}</p>;
      case 'matching':
        return (
          <ul className="list-disc list-inside text-left">
            {question.pairs.map(p => <li key={p.term}>{p.term} &rarr; {p.definition}</li>)}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-800 rounded-2xl shadow-2xl animate-fade-in w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Grade {grade} - {difficulty}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 transition-colors"
        >
          &larr; Back
        </button>
      </div>

      {questions.length === 0 ? (
        <p className="text-center text-slate-400 py-12">
          Your question bank for Grade {grade} ({difficulty}) is empty. Create a quiz with these settings to add questions!
        </p>
      ) : (
        <>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
            {questions.map(storedQuestion => (
              <div key={storedQuestion.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <p className="text-lg font-semibold text-slate-200 mb-2">{storedQuestion.question.question}</p>
                <div className="text-sm text-slate-400 mb-3 flex flex-wrap gap-x-4">
                  <span>Topic: {storedQuestion.topic}</span>
                  <span>Type: {storedQuestion.question.type}</span>
                </div>
                <div className="bg-slate-800 p-3 rounded">
                  <p className="font-bold text-slate-300 mb-1">Correct Answer:</p>
                  {renderAnswer(storedQuestion.question)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={handleClearBank}
              className="px-6 py-2 bg-red-800 text-white font-bold rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 transition-colors"
            >
              Clear These Questions
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionBankScreen;