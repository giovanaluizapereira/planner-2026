
import { createClient } from '@supabase/supabase-js';

// Tenta pegar do ambiente (Vercel/Node) ou do localStorage (Configuração Manual)
const getSupabaseConfig = () => {
  const envUrl = process.env.SUPABASE_URL;
  const envKey = process.env.SUPABASE_ANON_KEY;
  
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_key') : null;

  return {
    url: envUrl || localUrl || '',
    key: envKey || localKey || ''
  };
};

const { url, key } = getSupabaseConfig();

if (!url || !key) {
  console.warn(
    'AVISO: Supabase não configurado. Use a tela de configuração manual no app.'
  );
}

export const supabase = (url && key) 
  ? createClient(url, key)
  : null;

// Função utilitária para salvar chaves manualmente
export const saveManualConfig = (url: string, key: string) => {
  localStorage.setItem('supabase_url', url);
  localStorage.setItem('supabase_key', key);
  window.location.reload();
};

export const clearManualConfig = () => {
  localStorage.removeItem('supabase_url');
  localStorage.removeItem('supabase_key');
  window.location.reload();
};
