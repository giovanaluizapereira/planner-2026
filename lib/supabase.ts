
import { createClient } from '@supabase/supabase-js';

// Tenta detectar as chaves em diferentes contextos (Vercel, Vite, Global)
const getEnv = (name: string) => {
  if (typeof process !== 'undefined' && process.env && process.env[name]) return process.env[name];
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[`VITE_${name}`]) return import.meta.env[`VITE_${name}`];
  return '';
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn("SUPABASE WARNING: Chaves não detectadas. Certifique-se de fazer o REDEPLOY na Vercel.");
}
