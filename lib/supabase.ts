
import { createClient } from '@supabase/supabase-js';

// Tenta pegar das variáveis de ambiente da Vercel
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Se as variáveis estiverem vazias, o cliente ainda será criado mas emitirá erro ao ser usado,
// facilitando o debug no console do navegador.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.error("SUPABASE ERROR: Chaves não detectadas. Verifique se você fez o REDEPLOY na Vercel após configurar as Environment Variables.");
}
