import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/AuthContext';
import { wordApi, type Word } from '../features/word-bank/api';
import { PixelButton } from '../components/ui/PixelButton';

export default function Flashcards() {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    wordApi.getWords().then((data) => {
      // 只有被勾上 is_in_quiz 的單字才會進入遊戲系統
      const quizWords = data.filter(w => w.is_in_quiz);
      setWords(quizWords);
      setLoading(false);
    });
  }, [user]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 150); // wait briefly for the card to un-flip so user doesn't see back content instantly
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setWords(shuffled);
      setCurrentIndex(0);
    }, 150);
  };

  if (!user) {
    return <div className="text-center mt-20"><h2 className="text-2xl">Please log in to study.</h2></div>;
  }

  if (loading) return <div className="text-center mt-20"><p>Loading cards...</p></div>;

  if (words.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl mb-4">No words found in your Quiz list.</h2>
        <p>Go to the Word Bank and enable "Quiz" for some words first.</p>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl mb-6 border-b-4 border-[var(--color-nes-dark)] inline-block">🎴 Flashcards</h2>
      
      <div className="flex justify-between w-full max-w-[500px] mb-4 text-lg font-bold">
        <span>Card {currentIndex + 1} / {words.length}</span>
        <button onClick={handleShuffle} className="hover:text-[var(--color-nes-blue)] underline">🔀 Shuffle</button>
      </div>

      <div 
        className="w-full max-w-[500px] aspect-[4/3] cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        >
          {/* 正面：單字 */}
          <div 
             className="absolute inset-0 bg-white pixel-border flex flex-col items-center justify-center p-8 text-center"
             style={{ backfaceVisibility: "hidden" }}
          >
            <h3 className="text-4xl font-['Press_Start_2P'] tracking-tighter text-[var(--color-nes-blue)] mb-6 word-wrap break-words w-full px-4">{currentWord.word}</h3>
            {currentWord.part_of_speech && (
              <span className="bg-gray-200 px-3 py-1 text-base">{currentWord.part_of_speech}</span>
            )}
            <p className="absolute bottom-4 text-gray-400 text-sm">(Click to flip)</p>
          </div>

          {/* 背面：定義與例句 */}
          <div 
             className="absolute inset-0 bg-[#f4f3ec] pixel-border flex flex-col items-center justify-center p-8 text-center"
             style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <h3 className="text-3xl font-bold mb-6 text-black break-words w-full px-4">{currentWord.definition}</h3>
            {currentWord.example_sentence && (
              <p className="text-gray-700 bg-white p-4 pixel-border-inset w-full italic text-lg leading-relaxed">
                "{currentWord.example_sentence}"
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between w-full max-w-[500px] mt-8 gap-4">
        <PixelButton onClick={handlePrev} variant="warning" className="w-1/2 !py-4 text-xl">◀ PREV</PixelButton>
        <PixelButton onClick={handleNext} variant="success" className="w-1/2 !py-4 text-xl">NEXT ▶</PixelButton>
      </div>
    </div>
  );
}
