import React, { useState } from 'react';

interface NameInputScreenProps {
  onSubmit: (name: string) => void;
  onBack: () => void;
}

const NameInputScreen: React.FC<NameInputScreenProps> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="p-8 bg-slate-800 rounded-2xl shadow-2xl animate-fade-in w-full max-w-lg text-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Enter Your Name
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 transition-colors"
        >
          &larr; Back
        </button>
      </div>
      <p className="text-slate-300 mb-8">Your name will be saved with your high score.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="playerName" className="sr-only">Player Name</label>
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white text-lg rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-4 text-center"
            placeholder="e.g., Alex"
            maxLength={20}
            required
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full px-8 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform duration-200 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default NameInputScreen;
