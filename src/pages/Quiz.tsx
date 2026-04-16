import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { wordApi, type Word } from '../features/word-bank/api';
import { PixelButton } from '../components/ui/PixelButton';

type QuestionType = 'TYPE_A' | 'TYPE_B' | 'TYPE_C';

interface Question {
  type: QuestionType;
  word: Word;
  options: string[]; // Type A = Definitions, Type B/C = Words
  correctAnswer: string;
}

// 產生亂數陣列的輔助函數
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// 根據單字庫產生題目
function generateQuestions(words: Word[], questionCount = 10): Question[] {
  if (words.length < 4) return [];

  // 選出欲測驗的目標單字
  const targets = shuffleArray(words).slice(0, questionCount);

  return targets.map(targetWord => {
    // 隨機挑出 3 個不重複的錯誤單字當作干擾項
    const distractors = shuffleArray(words.filter(w => w.id !== targetWord.id)).slice(0, 3);

    // 判斷該單字可以支援哪些題型
    const availableTypes: QuestionType[] = ['TYPE_A', 'TYPE_B'];
    
    // 若有例句且例句裡有包含這個單字(不分大小寫)，才支援 TYPE_C 克漏字
    const sentenceHasWord = targetWord.example_sentence && 
      targetWord.example_sentence.toLowerCase().includes(targetWord.word.toLowerCase());
      
    if (sentenceHasWord) {
      availableTypes.push('TYPE_C');
    }

    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    if (type === 'TYPE_A') {
      // 單字選意思
      const options = shuffleArray([targetWord.definition, ...distractors.map(w => w.definition)]);
      return { type, word: targetWord, options, correctAnswer: targetWord.definition };
    } else {
      // 意思選單字 (Type B) 或 填空題 (Type C)
      const options = shuffleArray([targetWord.word, ...distractors.map(w => w.word)]);
      return { type, word: targetWord, options, correctAnswer: targetWord.word };
    }
  });
}

export default function Quiz() {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // 答題狀態
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    wordApi.getWords().then((data) => {
      const quizWords = data.filter(w => w.is_in_quiz);
      setWords(quizWords);
      setLoading(false);
    });
  }, [user]);

  const startQuiz = () => {
    const newQuestions = generateQuestions(words, 10);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setIsGameOver(false);
    setIsAnswered(false);
    setSelectedOption(null);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsGameOver(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    }
  };

  if (!user) {
    return <div className="text-center mt-20"><h2 className="text-2xl">Please log in to take quizzes.</h2></div>;
  }

  if (loading) return <div className="text-center mt-20"><p>Loading arena...</p></div>;

  // 單字不足以生成 4 個選項
  if (words.length < 4) {
    return (
      <div className="text-center mt-20 p-8 bg-white pixel-border">
        <h2 className="text-2xl mb-4 text-[var(--color-nes-red)]">Not enough words!</h2>
        <p>You need at least <strong>4</strong> words marked for Quiz to generate multiple-choice questions.</p>
        <p className="mt-2 text-gray-500">Currently you have {words.length} enabled words.</p>
      </div>
    );
  }

  // 測驗還沒開始或結束時的畫面
  if (questions.length === 0 || isGameOver) {
    return (
      <div className="flex flex-col items-center mt-20 p-8 bg-white pixel-border max-w-lg mx-auto text-center">
        <h2 className="text-4xl mb-4 text-[var(--color-nes-blue)] font-['Press_Start_2P'] tracking-tighter">
          {isGameOver ? 'GAME OVER' : 'QUIZ ARENA'}
        </h2>
        
        {isGameOver ? (
          <div className="mb-8">
            <p className="text-2xl mb-2">Final Score:</p>
            <p className="text-6xl font-['Press_Start_2P'] text-[var(--color-nes-yellow)] " style={{ WebkitTextStroke: "2px black" }}>
              {score}/{questions.length}
            </p>
          </div>
        ) : (
          <p className="mb-8 text-black">Test your memory with mixed types of questions (Translate, Cloze, etc)!</p>
        )}
        
        <PixelButton onClick={startQuiz} className="text-xl px-8 py-4">
          {isGameOver ? 'TRY AGAIN' : 'START NOW'}
        </PixelButton>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  
  // 針對 Type C (克漏字) 的例句處理功能
  const renderClozeSentence = () => {
    if (!currentQ.word.example_sentence) return '';
    // 用正則表達式不分大小寫將目標單字替換為空格
    const regex = new RegExp(currentQ.word.word, 'gi');
    return currentQ.word.example_sentence.replace(regex, '________');
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between mb-4 font-bold text-xl">
        <span>Question {currentIndex + 1} / {questions.length}</span>
        <span className="text-[var(--color-nes-blue)] text-2xl">Score: {score}</span>
      </div>

      <div className="bg-white w-full p-8 pixel-border text-center min-h-[250px] flex flex-col items-center justify-center relative">
        <div className="absolute top-0 right-0 bg-[var(--color-nes-dark)] text-[var(--color-nes-light)] px-3 py-1 font-bold">
          {currentQ.type === 'TYPE_A' ? 'Word to Meaning' : currentQ.type === 'TYPE_B' ? 'Meaning to Word' : 'Fill in Blank'}
        </div>

        {/* 題幹顯示區 */}
        {currentQ.type === 'TYPE_A' && (
          <h3 className="text-5xl font-['Press_Start_2P'] text-[var(--color-nes-blue)] tracking-tighter drop-shadow-sm">{currentQ.word.word}</h3>
        )}

        {currentQ.type === 'TYPE_B' && (
          <h3 className="text-3xl font-bold">{currentQ.word.definition}</h3>
        )}

        {currentQ.type === 'TYPE_C' && (
          <h3 className="text-2xl font-bold italic leading-loose">
             "{renderClozeSentence()}"
          </h3>
        )}
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {currentQ.options.map((opt, idx) => {
          let btnVariant: 'primary' | 'success' | 'danger' | 'warning' = 'primary';
          
          if (isAnswered) {
             if (opt === currentQ.correctAnswer) btnVariant = 'success';
             else if (opt === selectedOption) btnVariant = 'danger';
             else btnVariant = 'warning'; // 其他未選選項變灰或警告色
          } else {
             if (selectedOption === opt) btnVariant = 'warning';
          }

          return (
            <PixelButton 
              key={idx} 
              variant={btnVariant}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`p-4 h-auto min-h-[80px] break-words text-lg ${isAnswered && opt !== currentQ.correctAnswer && opt !== selectedOption ? 'opacity-50 grayscale' : ''}`}
            >
              {opt}
            </PixelButton>
          );
        })}
      </div>

      {isAnswered && (
        <div className="w-full mt-8 animate-bounce flex justify-center">
          <PixelButton onClick={handleNext} variant="success" className="px-8 py-3 text-xl border-4 border-black">
            CONTINUE ▶
          </PixelButton>
        </div>
      )}
    </div>
  );
}
