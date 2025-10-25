// Fix: Implemented the StartScreen component to provide a UI for quiz configuration.
import React, { useState, useEffect } from 'react';
import { Grade, Difficulty, grades, difficulties, quizTopics, questionTypes } from '../data/topics';
import { QuestionType } from '../types';

interface StartScreenProps {
  onStartQuiz: (grade: string, topic: string, difficulty: string, questionType: QuestionType, count: number) => void;
  error: string | null;
  onBack: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartQuiz, error, onBack }) => {
  const [grade, setGrade] = useState<Grade>('5');
  const [topic, setTopic] = useState<string>(quizTopics['5'][0]);
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice');
  const [questionCount, setQuestionCount] = useState(5);

  useEffect(() => {
    // When grade changes, reset topic to the first one for that grade
    setTopic(quizTopics[grade][0]);
  }, [grade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz(grade, topic, difficulty, questionType, questionCount);
  };
  
  const CustomSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: string, label: string}[] }) => (
    <div>
        <label className="block mb-2 text-sm font-medium text-slate-300">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="bg-slate-700 border border-slate-600 text-white text-md rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
  );

  return (
    <div className="p-8 bg-slate-800 rounded-2xl shadow-2xl animate-fade-in w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Create Your Quiz
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 transition-colors"
        >
          &larr; Back
        </button>
      </div>
      
      {error && <p className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <CustomSelect
            label="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value as Grade)}
            options={grades.map(g => ({value: g, label: `Grade ${g}`}))}
        />

        <CustomSelect
            label="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            options={quizTopics[grade].map(t => ({value: t, label: t}))}
        />
        
        <CustomSelect
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            options={difficulties.map(d => ({value: d, label: d}))}
        />

        <CustomSelect
            label="Question Type"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as QuestionType)}
            options={questionTypes}
        />

        <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Number of Questions: <span className='font-bold text-purple-400'>{questionCount}</span></label>
            <input
                type="range"
                min="1"
                max="10"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
        </div>

        <button
          type="submit"
          className="w-full px-8 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform duration-200 transform hover:scale-105"
        >
          Generate Quiz
        </button>
      </form>
    </div>
  );
};

export default StartScreen;
