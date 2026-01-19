
import { createClient } from '@supabase/supabase-js';

// No Vercel, você deve configurar estas variáveis em Settings > Environment Variables
// Certifique-se de que os nomes estão EXATAMENTE como abaixo
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'AVISO: Supabase não configurado. Certifique-se de adicionar SUPABASE_URL e SUPABASE_ANON_KEY às suas variáveis de ambiente.'
  );
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
