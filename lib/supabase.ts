import { createClient } from '@supabase/supabase-js';

// Chaves extraídas dos seus prints
const supabaseUrl = 'https://ncgpzuhtpdffjdicwtrx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZ3B6dWh0cGRmZmpkaWN3dHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzAxMDAsImV4cCI6MjA4NDQ0NjEwMH0.3_Dq3m2muVJ_Z3MexewdI7bJaPNqt2Z9Jn3-_ZTZEh8';

export const supabase = createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Diagnóstico simples
console.log("Supabase Client inicializado para o projeto: " + supabaseUrl);
