import { createClient } from '@supabase/supabase-js';

/**
 * INSTRUÇÕES:
 * 1. Vá em Supabase > Project Settings > API
 * 2. Substitua as strings abaixo pelas chaves do seu NOVO projeto.
 */
const supabaseUrl = 'https://ncgpzuhtpdffjdicwtrx.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZ3B6dWh0cGRmZmpkaWN3dHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzAxMDAsImV4cCI6MjA4NDQ0NjEwMH0.3_Dq3m2muVJ_Z3MexewdI7bJaPNqt2Z9Jn3-_ZTZEh8';

// Função para limpar espaços extras que podem vir ao colar
const cleanUrl = supabaseUrl.trim();
const cleanKey = supabaseAnonKey.trim();

export const supabase = (cleanUrl.startsWith('http')) 
  ? createClient(cleanUrl, cleanKey)
  : null;

if (!supabase) {
  console.error("ERRO: As chaves do Supabase não foram configuradas corretamente no arquivo lib/supabase.ts");
}
