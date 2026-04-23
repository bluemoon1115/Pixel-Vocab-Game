import { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { wordApi, type Word, type InsertWordDTO } from '../features/word-bank/api';
import { WordBankForm } from '../features/word-bank/WordBankForm';

export default function WordBank() {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Word>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async (id: string) => {
    await wordApi.deleteWord(id);
    setWords(words.filter(w => w.id !== id));
    setDeletingId(null);
  };

  const filteredWords = words.filter(word => {
    const query = searchQuery.toLowerCase();
    return (
      word.word.toLowerCase().includes(query) ||
      word.definition.toLowerCase().includes(query) ||
      (word.part_of_speech && word.part_of_speech.toLowerCase().includes(query)) ||
      (word.example_sentence && word.example_sentence.toLowerCase().includes(query))
    );
  });

  const toggleQuizStatus = async (word: Word) => {
    const updated = await wordApi.updateWord(word.id, { is_in_quiz: !word.is_in_quiz });
    setWords(words.map(w => w.id === updated.id ? updated : w));
  };

  const handleEditClick = (word: Word) => {
    setEditingId(word.id);
    setEditForm(word);
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    try {
      const updated = await wordApi.updateWord(editingId, {
        word: editForm.word,
        definition: editForm.definition,
        part_of_speech: editForm.part_of_speech,
        example_sentence: editForm.example_sentence,
      });
      setWords(words.map(w => w.id === editingId ? updated : w));
      setEditingId(null);
    } catch (err) {
      console.error("Error updating word:", err);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleOpenSearch = () => {
    if (searchQuery.trim() !== '') {
      setIsSearchModalOpen(true);
    }
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
      <div className='flex justify-between items-end mb-6'>
        <h2 className="text-3xl border-b-4 border-[var(--color-nes-dark)] inline-block">📋 Word Bank</h2>
        
        {/* Search Bar */}
        <div className='flex justify-center items-center'>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleOpenSearch()}
            className="h-10 text-sm border-2 border-[var(--color-nes-dark)] p-2 outline-none focus:border-[var(--color-nes-blue)] bg-white text-black translate-x-0.5" 
            placeholder="Search words..."
          />
          <button 
            onClick={handleOpenSearch} 
            className="h-10 bg-[var(--color-nes-blue)] text-white px-3 py-1 font-bold border-2 border-[var(--color-nes-dark)] hover:brightness-110 active:translate-y-1"
          >
            🔍 Search
          </button>
        </div>
      </div>
      
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
                <th className="p-3 border-r border-gray-600 w-1/4 lg:w-1/5">Word</th>
                <th className="p-3 border-r border-gray-600">Definition</th>
                <th className="p-3 border-r border-gray-600 text-center w-1 whitespace-nowrap">Quiz?</th>
                <th className="p-3 border-r border-gray-600 text-center w-1 whitespace-nowrap">Edit</th>
                <th className="p-3 text-center w-1 whitespace-nowrap">Delete</th>
              </tr>
            </thead>
            <tbody>
              {words.map(word => (
                <tr key={word.id} className="border-b-2 border-gray-200 hover:bg-yellow-50 transition-colors">
                  {editingId === word.id ? (
                    <>
                      <td className="p-3 border-r-2 border-gray-200">
                        <input className="w-full text-lg font-bold border-2 border-gray-300 p-1 mb-1 outline-none focus:border-[var(--color-nes-blue)] bg-white text-black" value={editForm.word || ''} onChange={e => setEditForm({...editForm, word: e.target.value})} placeholder="Word" />
                        <input className="w-full text-xs border-2 border-gray-300 p-1 outline-none focus:border-[var(--color-nes-blue)] bg-white text-black" placeholder="Part of Speech" value={editForm.part_of_speech || ''} onChange={e => setEditForm({...editForm, part_of_speech: e.target.value})} />
                      </td>
                      <td className="p-3 border-r-2 border-gray-200">
                        <textarea className="w-full border-2 border-gray-300 p-1 mb-1 outline-none focus:border-[var(--color-nes-blue)] bg-white text-black" rows={2} value={editForm.definition || ''} onChange={e => setEditForm({...editForm, definition: e.target.value})} placeholder="Definition" />
                        <input className="w-full text-sm italic border-2 border-gray-300 p-1 outline-none focus:border-[var(--color-nes-blue)] bg-white text-black" placeholder="Example Sentence" value={editForm.example_sentence || ''} onChange={e => setEditForm({...editForm, example_sentence: e.target.value})} />
                      </td>
                      <td className="p-3 border-r-2 border-gray-200 text-center">
                        <span className={`text-xl ${word.is_in_quiz ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                          {word.is_in_quiz ? '✅' : '❌'}
                        </span>
                      </td>
                      <td className="p-3 text-center border-r-2 border-gray-200" colSpan={2}>
                        <div className="flex flex-col gap-2 mx-auto justify-center items-center px-2">
                          <button onClick={handleEditSave} className="bg-[var(--color-nes-green)] w-full text-white px-2 py-1 font-bold border-2 border-[var(--color-nes-dark)] hover:opacity-80 active:translate-y-1">Save</button>
                          <button onClick={handleEditCancel} className="bg-[var(--color-nes-red)] w-full text-white px-2 py-1 font-bold border-2 border-[var(--color-nes-dark)] hover:opacity-80 active:translate-y-1">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
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
                          className={`text-xl ${word.is_in_quiz ? 'grayscale-0' : 'grayscale opacity-50'} hover:scale-110 transition-transform`}
                          title={word.is_in_quiz ? "Included in Quiz" : "Excluded from Quiz"}
                        >
                          {word.is_in_quiz ? '✅' : '❌'}
                        </button>
                      </td>
                      <td className="p-3 border-r-2 border-gray-200 text-center">
                        <button onClick={() => handleEditClick(word)} className="text-xl hover:scale-110 transition-transform" title="Edit">
                          ✏️
                        </button>
                      </td>
                      <td className="p-3 text-center align-middle">
                        {deletingId === word.id ? (
                          <div className="flex flex-col gap-1 items-center justify-center">
                            <span className="text-[10px] text-[var(--color-nes-red)] font-bold mb-1">SURE?</span>
                            <div className="flex gap-1 justify-center">
                              <button onClick={() => confirmDelete(word.id)} className="bg-[var(--color-nes-red)] text-white px-2 py-1 text-xs font-bold border-2 border-[var(--color-nes-dark)] hover:opacity-80 active:translate-y-1">Yes</button>
                              <button onClick={() => setDeletingId(null)} className="bg-gray-400 text-white px-2 py-1 text-xs font-bold border-2 border-[var(--color-nes-dark)] hover:opacity-80 active:translate-y-1">No</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => handleDeleteClick(word.id)} className="text-xl hover:scale-110 transition-transform" title="Delete">
                            🗑️
                          </button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Search Result Popup (Modal) */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-nes-light)] pixel-border w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[var(--color-nes-dark)] text-[var(--color-nes-light)] p-3 flex justify-between items-center border-b-4 border-[var(--color-nes-dark)]">
              <h3 className="font-bold text-lg">🔍 Search Results for "{searchQuery}"</h3>
              <button 
                onClick={() => setIsSearchModalOpen(false)}
                className="text-white hover:text-[var(--color-nes-red)] text-2xl font-bold leading-none px-2 active:translate-y-1"
              >
                ×
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 overflow-y-auto">
              {filteredWords.length === 0 ? (
                <p className="text-center py-10 text-gray-500 font-bold">No matching words found.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredWords.map((word) => (
                    <div key={word.id} className="p-4 bg-white border-4 border-gray-300 transition-colors">
                      <div className="flex items-end gap-3 mb-2">
                        <h4 className="text-2xl font-bold font-['Press_Start_2P'] tracking-tighter text-[var(--color-nes-blue)]">{word.word}</h4>
                        {word.part_of_speech && <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs font-bold rounded">{word.part_of_speech}</span>}
                      </div>
                      <p className="text-lg text-gray-800 border-l-4 border-[var(--color-nes-blue)] pl-3 my-2">{word.definition}</p>
                      {word.example_sentence && (
                        <p className="mt-2 text-sm text-gray-500 italic bg-gray-50 p-2">"{word.example_sentence}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
