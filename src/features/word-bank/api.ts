import { supabase } from '../../lib/supabase';

// 定義與 Supabase table 對應的資料型態
export interface Word {
  id: string;
  user_id: string;
  word: string;
  definition: string;
  part_of_speech?: string;
  example_sentence?: string;
  is_in_quiz: boolean;
  created_at: string;
}

export type InsertWordDTO = Omit<Word, 'id' | 'created_at'>;

export const wordApi = {
  // 取得當前使用者的所有單字
  async getWords(): Promise<Word[]> {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },

  // 新增一個單字
  async addWord(wordData: Omit<InsertWordDTO, 'user_id'>): Promise<Word> {
    // 取得當前登入者 ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const newWord: InsertWordDTO = {
      ...wordData,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('words')
      .insert([newWord])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // 刪除單字
  async deleteWord(id: string): Promise<void> {
    const { error } = await supabase.from('words').delete().eq('id', id);
    if (error) throw error;
  },

  // 更新單字
  async updateWord(id: string, updates: Partial<Omit<Word, 'id' | 'user_id' | 'created_at'>>): Promise<Word> {
    const { data, error } = await supabase
      .from('words')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};
