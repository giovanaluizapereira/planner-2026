
import { createClient } from '@supabase/supabase-js';

// No Vercel, estas variáveis são injetadas automaticamente no process.env
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Inicializamos o cliente. Se as chaves forem vazias, o cliente será criado mas as chamadas falharão com erro descritivo.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
