import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl mb-6 text-[var(--color-nes-blue)]">Welcome to Pixiecrab!</h1>
      <p className="mb-8">Remember new vocabs with flashcards and games!</p>
      
      <div className="flex justify-center gap-4">
        <Link to="/quiz" className="bg-[#FEF0A5] text-black px-6 py-3 pixel-border hover:brightness-110 inline-block">
          START QUIZ
        </Link>
        <Link to="/wordbank" className="bg-[#DDBDD5] text-black px-6 py-3 pixel-border hover:brightness-110 inline-block">
          WORD BANK
        </Link>
        <Link to="/flashcards" className="bg-[#AC9FBB] text-black px-6 py-3 pixel-border hover:brightness-110 inline-block">
          FLASHCARDS
        </Link>
      </div>
    </div>
  );
}
