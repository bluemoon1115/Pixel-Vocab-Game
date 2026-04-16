export default function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl mb-6 text-[var(--color-nes-blue)]">Welcome to Pixel Vocab!</h1>
      <p className="mb-8">Build your vocabulary with 8-bit games and flashcards.</p>
      
      <div className="flex justify-center gap-4">
        <button className="bg-[var(--color-nes-yellow)] text-black px-6 py-3 pixel-border hover:brightness-110">
          START QUIZ
        </button>
        <button className="bg-[var(--color-nes-green)] text-white px-6 py-3 pixel-border hover:brightness-110">
          MANAGE WORDS
        </button>
      </div>
    </div>
  );
}
