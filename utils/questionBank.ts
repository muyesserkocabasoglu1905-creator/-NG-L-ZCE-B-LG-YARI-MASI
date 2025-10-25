import { QuizQuestion, StoredQuestion } from '../types';

const QUESTION_BANK_KEY = 'englishQuizQuestionBank';

// Function to retrieve all questions from the bank
export const getQuestionsFromBank = (): StoredQuestion[] => {
  try {
    const storedQuestions = localStorage.getItem(QUESTION_BANK_KEY);
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  } catch (error) {
    console.error('Error retrieving questions from localStorage:', error);
    return [];
  }
};

// Function to save new questions to the bank
export const saveQuestionsToBank = (
  newQuestions: QuizQuestion[],
  grade: string,
  topic: string,
  difficulty: string
) => {
  try {
    const existingQuestions = getQuestionsFromBank();
    const existingQuestionTexts = new Set(existingQuestions.map(q => q.question.question));

    const questionsToAdd = newQuestions
      .filter(q => !existingQuestionTexts.has(q.question)) // Avoid duplicates
      .map((question): StoredQuestion => ({
        id: crypto.randomUUID(),
        question,
        grade,
        topic,
        difficulty,
        timestamp: Date.now(),
      }));

    if (questionsToAdd.length > 0) {
      const updatedBank = [...existingQuestions, ...questionsToAdd];
      localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(updatedBank));
    }
  } catch (error) {
    console.error('Error saving questions to localStorage:', error);
  }
};

// Function to clear questions for a specific grade and difficulty
export const clearQuestionsFromBank = (grade: string, difficulty: string): void => {
    try {
        const allQuestions = getQuestionsFromBank();
        // Keep questions that DO NOT match both the specified grade and difficulty.
        const remainingQuestions = allQuestions.filter(
            q => !(q.grade === grade && q.difficulty === difficulty)
        );
        localStorage.setItem(QUESTION_BANK_KEY, JSON.stringify(remainingQuestions));
    } catch (error) {
        console.error(`Error clearing questions for grade ${grade}, difficulty ${difficulty} from localStorage:`, error);
    }
};

// Function to clear the entire question bank
export const clearAllQuestionsFromBank = (): void => {
    try {
        localStorage.removeItem(QUESTION_BANK_KEY);
    } catch (error) {
        console.error('Error clearing all questions from localStorage:', error);
    }
};