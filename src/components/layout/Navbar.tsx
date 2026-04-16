import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { PixelButton } from '../ui/PixelButton';

export default function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <nav className="w-full bg-[var(--color-nes-dark)] text-[var(--color-nes-light)] p-4 pixel-border">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold font-['Press_Start_2P'] hover:text-[var(--color-nes-yellow)] transition-colors tracking-tighter">
          👾 Pixel Vocab
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/wordbank" className="hover:text-[var(--color-nes-yellow)]">Word Bank</Link>
          <Link to="/flashcards" className="hover:text-[var(--color-nes-yellow)]">Flashcards</Link>
          <Link to="/quiz" className="hover:text-[var(--color-nes-yellow)]">Quiz</Link>
          
          {user ? (
             <div className="flex items-center gap-3 ml-4 border-l-2 border-gray-600 pl-4">
               <span className="text-sm">Hi, {user.user_metadata?.full_name?.split(' ')[0] || 'Player'}</span>
               <PixelButton variant="danger" onClick={signOut} className="!py-1 !px-2 !text-sm">
                 Logout
               </PixelButton>
             </div>
          ) : (
            <PixelButton variant="primary" onClick={signInWithGoogle} className="ml-4 !py-1 !px-2 !text-sm flex items-center gap-2">
              Google Login
            </PixelButton>
          )}
        </div>
      </div>
    </nav>
  );
}
