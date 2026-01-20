import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Skull, Mail, Lock, Loader2, LogIn, AlertTriangle, RefreshCw, ExternalLink, Settings } from 'lucide-react';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Verifica se o cliente foi inicializado (se as chaves foram preenchidas)
  const isConfigured = !!supabase;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const { error } = isSignUp 
        ? await supabase!.auth.signUp({ email, password })
        : await supabase!.auth.signInWithPassword({ email, password });

      if (error) {
        let errorMsg = error.message;
        if (errorMsg.toLowerCase().includes('api key')) {
          errorMsg = "CHAVE INVÁLIDA: O código ainda está com as chaves antigas ou os placeholders. Verifique o arquivo lib/supabase.ts";
        }
        throw new Error(errorMsg);
      }
      
      if (isSignUp) {
        setMessage({ type: 'success', text: 'Conta criada! Confirme o e-mail (se ativado no Supabase) e faça login.' });
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      setMessage({ type: 'error', text: error.message || 'Erro de conexão.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1612] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#25201b] border-4 border-[#3d352d] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-600/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-600/30" />

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-amber-600 rounded-lg flex items-center justify-center border-2 border-[#f5e6d3] shadow-lg rotate-3 mb-4">
            <Skull size={32} className="text-[#1a1612]" />
          </div>
          <h2 className="text-3xl font-dst text-[#f5e6d3] uppercase tracking-tighter text-center">Survivor Login</h2>
          <p className="text-[10px] text-amber-500 uppercase tracking-[0.3em] font-black mt-1">Planner 2026</p>
        </div>

        {!isConfigured ? (
          <div className="bg-red-900/20 border-2 border-red-900/50 p-6 text-center space-y-4">
            <Settings className="mx-auto text-red-500 animate-spin-slow" size={32} />
            <h3 className="font-dst text-red-400 uppercase text-sm tracking-widest">Aguardando Configuração</h3>
            <p className="text-[10px] text-[#f5e6d3]/60 leading-relaxed">
              Você precisa abrir o arquivo <code className="text-white bg-black/40 px-1">lib/supabase.ts</code> e colar a URL e a Key do seu novo projeto lá.
            </p>
          </div>
        ) : (
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
                placeholder="sobrevivente@2026.com"
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
              <div className={`p-4 text-[10px] font-dst uppercase tracking-widest border-2 leading-relaxed flex gap-3 ${
                message.type === 'error' ? 'bg-red-900/20 border-red-900/50 text-red-400' : 'bg-emerald-900/20 border-emerald-900/50 text-emerald-400'
              }`}>
                {message.type === 'error' ? <AlertTriangle size={16} className="shrink-0" /> : <RefreshCw size={16} className="shrink-0 animate-spin" />}
                {message.text}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#f5e6d3] hover:bg-white text-[#1a1612] py-4 font-dst text-xl uppercase tracking-widest border-4 border-[#3d352d] shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <LogIn size={20} />}
              {isSignUp ? 'Criar Cadastro' : 'Entrar na Run'}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-[#3d352d] flex flex-col items-center gap-4">
          <button 
            disabled={!isConfigured}
            onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
            className={`text-[10px] font-dst text-amber-500 uppercase tracking-widest hover:underline ${!isConfigured ? 'opacity-20' : ''}`}
          >
            {isSignUp ? 'Já tem conta? Login' : 'Novo por aqui? Criar Cadastro'}
          </button>
          
          <a 
            href="https://supabase.com/dashboard/projects" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[8px] text-[#f5e6d3]/30 uppercase tracking-[0.2em] hover:text-amber-500 transition-colors"
          >
            Acessar Painel Supabase <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </div>
  );
};
