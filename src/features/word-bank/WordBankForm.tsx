import { useState } from 'react';
import type { FormEvent } from 'react';
import { PixelInput } from '../../components/ui/PixelInput';
import { PixelButton } from '../../components/ui/PixelButton';
import type { InsertWordDTO } from './api';

interface WordBankFormProps {
  onAdd: (word: Omit<InsertWordDTO, 'user_id'>) => Promise<void>;
}

export function WordBankForm({ onAdd }: WordBankFormProps) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!word || !definition) return;
    
    setLoading(true);
    try {
      await onAdd({
        word,
        definition,
        part_of_speech: partOfSpeech || undefined,
        example_sentence: exampleSentence || undefined,
        is_in_quiz: true,
      });
      // Clear form on success
      setWord('');
      setDefinition('');
      setPartOfSpeech('');
      setExampleSentence('');
    } catch (err) {
      alert('Failed to add word');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-nes-light)] p-4 pixel-border mb-6">
      <h3 className="text-xl mb-4 text-[var(--color-nes-blue)]">➕ Add New Word</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Word *</span>
          <PixelInput 
            required 
            value={word} 
            onChange={e => setWord(e.target.value)} 
            placeholder="e.g. Pixel"
          />
        </label>
        
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Definition *</span>
          <PixelInput 
            required 
            value={definition} 
            onChange={e => setDefinition(e.target.value)} 
            placeholder="e.g. A minute area of illumination"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Part of Speech</span>
          <PixelInput 
            value={partOfSpeech} 
            onChange={e => setPartOfSpeech(e.target.value)} 
            placeholder="e.g. Noun"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold">Example Sentence</span>
          <PixelInput 
            value={exampleSentence} 
            onChange={e => setExampleSentence(e.target.value)} 
            placeholder="e.g. This game has pixel art."
          />
        </label>
      </div>

      <div className="flex justify-end mt-4">
        <PixelButton type="submit" variant="success" disabled={loading}>
          {loading ? 'Adding...' : 'SAVE WORD'}
        </PixelButton>
      </div>
    </form>
  );
}
