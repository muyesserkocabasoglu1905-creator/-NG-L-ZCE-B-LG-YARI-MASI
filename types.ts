export type QuestionType = 'multiple-choice' | 'fill-in-the-blank' | 'matching';

interface BaseQuestion {
  type: QuestionType;
  question: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

export interface FillInTheBlankQuestion extends BaseQuestion {
  type: 'fill-in-the-blank';
  correctAnswer: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: { term: string; definition: string }[];
}

export type QuizQuestion = MultipleChoiceQuestion | FillInTheBlankQuestion | MatchingQuestion;

export interface StoredQuestion {
    id: string;
    question: QuizQuestion;
    grade: string;
    topic: string;
    difficulty: string;
    timestamp: number;
}

export interface HighScore {
  id: string;
  name: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  grade: string;
  topic: string;
  difficulty: string;
  timestamp: number;
}