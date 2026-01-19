
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Skull, Mail, Lock, Loader2, LogIn } from 'lucide-react';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase não configurado.' });
      setLoading(false);
      return;
    }

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      
      if (isSignUp) {
        setMessage({ type: 'success', text: 'Verifique seu e-mail para confirmar o cadastro!' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro na autenticação' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1612] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#25201b] border-4 border-[#3d352d] p-10 shadow-2xl relative overflow-hidden">
        {/* Detalhes de canto estilo DST */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-600/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-600/30" />

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-amber-600 rounded-lg flex items-center justify-center border-2 border-[#f5e6d3] shadow-lg rotate-3 mb-4">
            <Skull size={32} className="text-[#1a1612]" />
          </div>
          <h2 className="text-3xl font-dst text-[#f5e6d3] uppercase tracking-tighter">Survivor Login</h2>
          <p className="text-[10px] text-amber-500 uppercase tracking-[0.3em] font-black mt-1">Planner 2026</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="font-dst text-[10px] text-[#f5e6d3]/60 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Mail size={10} /> Email
            </label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1612] border-2 border-[#3d352d] px-4 py-3 font-dst text-[#f5e6d3] outline-none focus:border-amber-600 transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="font-dst text-[10px] text-[#f5e6d3]/60 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Lock size={10} /> Password
            </label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1612] border-2 border-[#3d352d] px-4 py-3 font-dst text-[#f5e6d3] outline-none focus:border-amber-600 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className={`p-3 text-[10px] font-dst uppercase tracking-widest border-2 ${message.type === 'error' ? 'bg-red-900/20 border-red-900/50 text-red-400' : 'bg-emerald-900/20 border-emerald-900/50 text-emerald-400'}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#f5e6d3] hover:bg-white text-[#1a1612] py-4 font-dst text-xl uppercase tracking-widest border-4 border-[#3d352d] shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <LogIn size={20} />}
            {isSignUp ? 'Criar Conta' : 'Entrar na Run'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#3d352d] text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] font-dst text-amber-500 uppercase tracking-widest hover:underline"
          >
            {isSignUp ? 'Já tem conta? Faça Login' : 'Novo por aqui? Criar Cadastro'}
          </button>
        </div>
      </div>
    </div>
  );
};
