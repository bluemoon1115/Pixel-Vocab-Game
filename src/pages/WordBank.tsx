import { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { wordApi, type Word, type InsertWordDTO } from '../features/word-bank/api';
import { WordBankForm } from '../features/word-bank/WordBankForm';
import { PixelButton } from '../components/ui/PixelButton';

export default function WordBank() {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Fetch words
    wordApi.getWords()
      .then(setWords)
      .catch(err => console.error("Error fetching words:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleAddWord = async (wordData: Omit<InsertWordDTO, 'user_id'>) => {
    const newWord = await wordApi.addWord(wordData);
    setWords([newWord, ...words]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this word?')) return;
    
    await wordApi.deleteWord(id);
    setWords(words.filter(w => w.id !== id));
  };

  const toggleQuizStatus = async (word: Word) => {
    const updated = await wordApi.updateWord(word.id, { is_in_quiz: !word.is_in_quiz });
    setWords(words.map(w => w.id === updated.id ? updated : w));
  };

  if (!user) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl mb-4">Please log in to use the Word Bank</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl mb-6 border-b-4 border-[var(--color-nes-dark)] inline-block">📋 Word Bank</h2>
      
      <WordBankForm onAdd={handleAddWord} />

      <div className="bg-white pixel-border overflow-x-auto">
        {loading ? (
          <p className="p-8 text-center">Loading words...</p>
        ) : words.length === 0 ? (
          <p className="p-8 text-center text-gray-500">Your vocabulary list is empty. Add a word above!</p>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[var(--color-nes-dark)] text-[var(--color-nes-light)] text-sm">
                <th className="p-3 border-r border-gray-600">Word</th>
                <th className="p-3 border-r border-gray-600">Definition</th>
                <th className="p-3 border-r border-gray-600 items-center justify-center text-center">Quiz?</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {words.map(word => (
                <tr key={word.id} className="border-b-2 border-gray-200 hover:bg-yellow-50 transition-colors">
                  <td className="p-3 font-bold border-r-2 border-gray-200">
                    <span className="text-lg">{word.word}</span>
                    {word.part_of_speech && <span className="ml-2 text-xs bg-gray-200 px-1 py-0.5 rounded text-gray-700">{word.part_of_speech}</span>}
                  </td>
                  <td className="p-3 border-r-2 border-gray-200">
                    <p>{word.definition}</p>
                    {word.example_sentence && <p className="text-sm text-gray-500 italic mt-1">"{word.example_sentence}"</p>}
                  </td>
                  <td className="p-3 border-r-2 border-gray-200 text-center">
                    <button 
                      onClick={() => toggleQuizStatus(word)}
                      className={`text-xl ${word.is_in_quiz ? 'grayscale-0' : 'grayscale opacity-50'}`}
                      title={word.is_in_quiz ? "Included in Quiz" : "Excluded from Quiz"}
                    >
                      {word.is_in_quiz ? '✅' : '❌'}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleDelete(word.id)} className="text-xl hover:scale-110 transition-transform" title="Delete">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
