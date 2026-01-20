import { createClient } from '@supabase/supabase-js';

// As chaves foram inseridas diretamente no código para garantir que o aplicativo funcione independente das variáveis de ambiente da Vercel.
const supabaseUrl = 'https://lksyuapxgzyczyfijode.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrc3l1YXB4Z3p5Y3p5Zmlqb2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NDk2MzMsImV4cCI6MjA4NDQyNTYyNn0.BFXrm7jKkOpCriRzaBpzlc_YJjBvQMHO0oAbvtI01YY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
