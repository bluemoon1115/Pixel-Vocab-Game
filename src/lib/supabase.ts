import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key are missing.');
}

export const supabase = createClient(
  supabaseUrl || 'https://tzehwnhsnxbffhbqypfc.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZWh3bmhzbnhiZmZoYnF5cGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjYyODQsImV4cCI6MjA5MTE0MjI4NH0.a5U4kbLDY2A7Qf0UUfOZMvfH1FFz7uQd6G7R5g85guQ'
);
