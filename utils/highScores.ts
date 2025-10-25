import { HighScore } from '../types';
import { Grade, Difficulty } from '../data/topics';

const HIGH_SCORES_KEY = 'englishQuizHighScores';
const MAX_HIGH_SCORES = 10;

export const getHighScores = (): HighScore[] => {
  try {
    const storedScores = localStorage.getItem(HIGH_SCORES_KEY);
    return storedScores ? JSON.parse(storedScores) : [];
  } catch (error) {
    console.error('Error retrieving high scores from localStorage:', error);
    return [];
  }
};

export const saveHighScore = (
  score: number,
  correctAnswers: number,
  totalQuestions: number,
  grade: Grade,
  topic: string,
  difficulty: Difficulty,
  name: string,
) => {
  if (totalQuestions === 0) return;
  try {
    const newScore: HighScore = {
      id: crypto.randomUUID(),
      name,
      score,
      correctAnswers,
      totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100),
      grade,
      topic,
      difficulty,
      timestamp: Date.now(),
    };

    const highScores = getHighScores();
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score || b.timestamp - a.timestamp);
    const updatedHighScores = highScores.slice(0, MAX_HIGH_SCORES);
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updatedHighScores));
  } catch (error) {
    console.error('Error saving high score to localStorage:', error);
  }
};

export const clearHighScores = (): void => {
    try {
        localStorage.removeItem(HIGH_SCORES_KEY);
    } catch (error) {
        console.error('Error clearing high scores from localStorage:', error);
    }
};