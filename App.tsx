import React, { useState, useCallback, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import StartScreen from './components/StartScreen';
import Loader from './components/Loader';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';
import PostGenerationScreen from './components/PostGenerationScreen';
import GradeSelectionScreen from './components/GradeSelectionScreen';
import DifficultySelectionScreen from './components/DifficultySelectionScreen';
import QuestionBankScreen from './components/QuestionBankScreen';
import HighScoresScreen from './components/HighScoresScreen';
import QuestionCountSelectionScreen from './components/QuestionCountSelectionScreen';
import NameInputScreen from './components/NameInputScreen';
import ApiKeyScreen from './components/ApiKeyScreen';


import { generateQuizQuestions } from './services/geminiService';
import { QuizQuestion, QuestionType, StoredQuestion } from './types';
import { Grade, Difficulty } from './data/topics';
import { getQuestionsFromBank, saveQuestionsToBank, clearAllQuestionsFromBank } from './utils/questionBank';
import { saveHighScore, clearHighScores } from './utils/highScores';

type GameState = 'welcome' | 'start' | 'loading' | 'post-generation' | 'name-input' | 'quiz' | 'results' | 'grade-selection' | 'difficulty-selection' | 'question-bank' | 'high-scores' | 'question-count-selection';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');

  const [quizSettings, setQuizSettings] = useState<{ grade: string, topic: string, difficulty: string, count: number } | null>(null);
  
  const [selectedGrade, setSelectedGrade] = useState<Grade>('5');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Easy');
  
  const [bankFlowIntent, setBankFlowIntent] = useState<'view' | 'play' | null>(null);
  const [candidateQuestions, setCandidateQuestions] = useState<QuizQuestion[]>([]);

  const [apiKeyIsReady, setApiKeyIsReady] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setApiKeyIsReady(hasKey);
        } catch (e) {
          console.error("Error checking for API key:", e);
          setApiKeyIsReady(false); // Assume no key if check fails
        }
      } else {
        console.warn('aistudio API not found. Assuming API key is set via environment variables.');
        setApiKeyIsReady(true);
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    const clearData = () => {
      clearAllQuestionsFromBank();
      clearHighScores();
    };

    // Clear data on application start
    clearData();

    // Clear data on application exit (e.g., closing tab, navigating away)
    window.addEventListener('beforeunload', clearData);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', clearData);
    };
  }, []); // Empty dependency array ensures this runs only once on mount and unmount

  useEffect(() => {
    if (gameState === 'results' && quizSettings && questions.length > 0) {
      saveHighScore(score, correctAnswersCount, questions.length, quizSettings.grade as Grade, quizSettings.topic, quizSettings.difficulty as Difficulty, playerName);
    }
  }, [gameState, quizSettings, score, correctAnswersCount, questions, playerName]);


  const handleStartQuiz = useCallback(async (grade: string, topic: string, difficulty: string, questionType: QuestionType, count: number) => {
    setGameState('loading');
    setError(null);
    setQuizSettings({ grade, topic, difficulty, count });
    try {
      const newQuestions = await generateQuizQuestions(grade, topic, difficulty, questionType, count);
      if (newQuestions && newQuestions.length > 0) {
        setQuestions(newQuestions);
        saveQuestionsToBank(newQuestions, grade, topic, difficulty);
        setGameState('post-generation');
      } else {
        throw new Error("The generated quiz was empty. Please try again.");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while generating the quiz.";
      
      if (errorMessage.includes("API key not valid") || errorMessage.includes("Requested entity was not found")) {
        setError("Your API Key appears to be invalid. Please select a valid key to continue.");
        setApiKeyIsReady(false);
        setGameState('welcome');
        return;
      }
      
      setError(errorMessage);
      setGameState('start');
    }
  }, []);
  
  const handleStartFromBankFlow = (difficulty: Difficulty) => {
      setSelectedDifficulty(difficulty);
      const bankQuestions = getQuestionsFromBank()
        .filter(q => q.grade === selectedGrade && q.difficulty === difficulty)
        .map(q => q.question);

      if (bankQuestions.length === 0) {
        setError(`No questions found in the bank for Grade ${selectedGrade} (${difficulty}). Please generate some first!`);
        goHome();
      } else {
        setCandidateQuestions(bankQuestions);
        setGameState('question-count-selection');
      }
  };

  const handleStartQuizFromBank = (count: number) => {
    const shuffled = [...candidateQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, count);
    setQuestions(selectedQuestions);
    setQuizSettings({
        grade: selectedGrade,
        topic: 'From Question Bank',
        difficulty: selectedDifficulty,
        count: selectedQuestions.length,
    });
    setGameState('name-input');
  };

  const handleKeySelected = () => {
    setApiKeyIsReady(true);
  };

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    handleBeginQuiz();
  };

  const handleBeginQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswersCount(0);
    setGameState('quiz');
  };

  const handleFinishQuiz = () => {
    // The useEffect hook handles saving the score when gameState becomes 'results'
    setGameState('results');
  };

  const handleAnswer = (isCorrect: boolean, timeLeft: number) => {
    if (isCorrect) {
      const points = 100 + (timeLeft * 10); // Base: 100, Bonus: 10 points per second left
      setScore(prevScore => prevScore + points);
      setCorrectAnswersCount(prevCount => prevCount + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setGameState('results');
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswersCount(0);
    setError(null);
    setQuizSettings(null);
    setPlayerName('');
    setGameState('start');
  };
  
  const goHome = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswersCount(0);
    // Keep error message if redirected from a failed action
    // setError(null); 
    setQuizSettings(null);
    setBankFlowIntent(null);
    setCandidateQuestions([]);
    setPlayerName('');
    setGameState('welcome');
  };
  
  const renderInCenteredCard = (content: React.ReactNode) => (
    <div className="flex items-center justify-center w-full h-full p-4">
        {content}
    </div>
  );

  const renderContent = () => {
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen 
          onStartNewQuiz={() => { setError(null); setGameState('start'); }}
          onStartFromBank={() => { setError(null); setBankFlowIntent('play'); setGameState('grade-selection'); }}
          onViewQuestionBank={() => { setError(null); setBankFlowIntent('view'); setGameState('grade-selection'); }}
          onViewHighScores={() => setGameState('high-scores')}
          error={error}
        />;
      case 'start':
        return renderInCenteredCard(<StartScreen onStartQuiz={handleStartQuiz} error={error} onBack={goHome} />);
      case 'loading':
        return renderInCenteredCard(<Loader />);
      case 'post-generation':
        return renderInCenteredCard(<PostGenerationScreen questions={questions} onStart={() => setGameState('name-input')} onReGenerate={resetQuiz} onGoHome={goHome} />);
      case 'name-input':
        const handleBackFromNameInput = () => {
          if (quizSettings?.topic === 'From Question Bank') {
            setGameState('question-count-selection');
          } else {
            setGameState('post-generation');
          }
        };
        return renderInCenteredCard(<NameInputScreen onSubmit={handleNameSubmit} onBack={handleBackFromNameInput} />);
      case 'quiz':
        return (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onFinishQuiz={handleFinishQuiz}
          />
        );
      case 'results':
        return renderInCenteredCard(<ResultsScreen score={score} totalQuestions={questions.length} correctAnswers={correctAnswersCount} onPlayAgain={resetQuiz} onGoHome={goHome} />);
      case 'grade-selection':
        return renderInCenteredCard(<GradeSelectionScreen onSelectGrade={(grade) => { setSelectedGrade(grade); setGameState('difficulty-selection'); }} onBack={goHome} />);
      case 'difficulty-selection':
        return renderInCenteredCard(<DifficultySelectionScreen grade={selectedGrade} onSelectDifficulty={(difficulty) => { 
            if (bankFlowIntent === 'play') {
                handleStartFromBankFlow(difficulty);
            } else {
                setSelectedDifficulty(difficulty); setGameState('question-bank'); 
            }
        }} onBack={() => setGameState('grade-selection')} />);
      case 'question-count-selection':
          return renderInCenteredCard(<QuestionCountSelectionScreen availableQuestions={candidateQuestions.length} onStart={handleStartQuizFromBank} onBack={() => setGameState('difficulty-selection')} />)
      case 'question-bank':
        return renderInCenteredCard(<QuestionBankScreen grade={selectedGrade} difficulty={selectedDifficulty} onBack={() => setGameState('difficulty-selection')} />);
      case 'high-scores':
        return renderInCenteredCard(<HighScoresScreen onBack={goHome} />);
      default:
        return <WelcomeScreen onStartNewQuiz={() => setGameState('start')} onStartFromBank={() => { setBankFlowIntent('play'); setGameState('grade-selection'); }} onViewQuestionBank={() => { setBankFlowIntent('view'); setGameState('grade-selection'); }} onViewHighScores={() => setGameState('high-scores')} error={error} />;
    }
  };

  if (apiKeyIsReady === null) {
    return (
      <div className="h-screen w-screen bg-slate-900 text-white font-sans">
        <main className="w-full h-full">
          {renderInCenteredCard(
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
              <p className="text-lg text-slate-300">Checking Setup...</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (apiKeyIsReady === false) {
    return (
      <div className="h-screen w-screen bg-slate-900 text-white font-sans">
        <main className="w-full h-full">
          <ApiKeyScreen onKeySelect={handleKeySelected} />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-slate-900 text-white font-sans">
      <main className="w-full h-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
