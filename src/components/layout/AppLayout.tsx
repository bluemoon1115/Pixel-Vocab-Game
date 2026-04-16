import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="w-full min-h-screen bg-[var(--color-nes-light)] font-['DotGothic16'] text-[var(--color-nes-dark)]">
      <Navbar />
      <main className="max-w-5xl mx-auto p-4 mt-4">
        {/* The child routes will be rendered inside this Outlet */}
        <Outlet />
      </main>
    </div>
  );
}
