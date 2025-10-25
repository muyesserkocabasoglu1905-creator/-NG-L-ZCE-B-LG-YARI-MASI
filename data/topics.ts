import { QuestionType } from '../types';

export type Grade = '5' | '6' | '7' | '8';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export const quizTopics: Record<Grade, string[]> = {
  '5': ['Greetings & Meeting People', 'My Town', 'Games & Hobbies', 'My Daily Routine', 'Health'],
  '6': ['Life', 'Yummy Breakfast', 'A Day in My City', 'Weather & Emotions', 'At the Fair'],
  '7': ['Appearance & Personality', 'Biographies', 'Sports', 'Wild Animals', 'Television'],
  '8': ['Friendship', 'Teen Life', 'In the Kitchen', 'On the Phone', 'The Internet'],
};

export const grades: Grade[] = ['5', '6', '7', '8'];
export const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const questionTypes: { value: QuestionType, label: string }[] = [
    { value: 'multiple-choice', label: 'Multiple Choice'},
    { value: 'fill-in-the-blank', label: 'Fill in the Blank'},
    { value: 'matching', label: 'Matching'},
];
