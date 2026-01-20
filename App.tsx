
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { RefreshCw, Trophy, Loader2, Key, ExternalLink, LogOut, Upload, BrainCircuit } from 'lucide-react';
import ManualEntry from './components/ManualEntry';
import RankingChart from './components/RankingChart';
import GoalTracker from './components/GoalTracker';
import DSTStats from './components/DSTStats';
import LevelUpModal from './components/LevelUpModal';
import { Auth } from './components/Auth';
import { WheelData, Goal } from './types';
import { supabase } from './lib/supabase';
import { analyzeWheelImage } from './services/geminiService';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [baseData, setBaseData] = useState<WheelData[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  
  const [levelUpInfo, setLevelUpInfo] = useState<{ area: string, days: number, level: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialLoad = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sanitizeData = (data: any[]): WheelData[] => {
    if (!Array.isArray(data)) return [];
    return data.map(cat => ({
      ...cat,
      goals: (cat.goals || []).map((goal: any) => ({
        id: goal.id || Math.random().toString(36).substr(2, 9),
        intention: goal.intention || goal.text || '',
        successCriteria: goal.successCriteria || goal.successIndicator || '',
        dueDate: goal.dueDate || '',
        status: goal.status || 'ativo',
        milestones: (goal.milestones || []).map((m: any) => ({
          ...m,
          strategies: m.strategies || []
        })),
        reflections: goal.reflections || [],
        completed: !!goal.completed
      }))
    }));
  };

  // Reseta o estado local quando o usuário muda para evitar vazamento de dados
  useEffect(() => {
    if (session?.user?.id) {
      setBaseData([]);
      setIsStarted(false);
      setLastSaved(null);
      isInitialLoad.current = true;
      loadData();
    } else {
      setBaseData([]);
      setIsStarted(false);
      setLastSaved(null);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!supabase) {
      setIsLoadingSession(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadData = useCallback(async () => {
    if (!supabase || !session?.user) return;
    
    const { data, error } = await supabase
      .from('planner_runs')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0 && !error) {
      const latestRun = data[0];
      const sanitized = sanitizeData(latestRun.user_data);
      setBaseData(sanitized);
      setIsStarted(true);
      setLastSaved(new Date(latestRun.created_at));
    } else {
      // Caso seja um novo usuário ou ocorra erro, garante que comece do zero
      setBaseData([]);
      setIsStarted(false);
      setLastSaved(null);
    }
    
    // Pequeno delay para evitar que o save automático dispare antes do load completar
    setTimeout(() => { isInitialLoad.current = false; }, 800);
  }, [session?.user?.id]);

  const saveToSupabase = useCallback(async (currentData: WheelData[], xp: number) => {
    if (!supabase || !session?.user || currentData.length === 0 || isInitialLoad.current) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase.from('planner_runs').insert([{ 
        user_data: currentData, 
        total_xp: xp,
        user_id: session.user.id 
      }]);
      if (error) throw error;
      setLastSaved(new Date());
    } catch (err) {
      console.error("Erro ao salvar dados:", err);
    } finally {
      setIsSaving(false);
    }
  }, [session?.user?.id]);

  const currentTotalXP = useMemo(() => {
    const baseXP = baseData.reduce((acc, curr) => acc + (curr.score || 0) * 10, 0);
    const goalsXP = baseData.reduce((acc, curr) => acc + ((curr.goals || []).filter(g => g.completed).length * 150), 0);
    return Math.floor(baseXP + goalsXP);
  }, [baseData]);

  useEffect(() => {
    // Não salva se estiver no carregamento inicial ou se não houver dados
    if (isInitialLoad.current || !isStarted || !session || baseData.length === 0) return;
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase(baseData, currentTotalXP);
    }, 3000); // Delay maior para evitar spam de inserts
    
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [baseData, isStarted, session, currentTotalXP, saveToSupabase]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const results = await analyzeWheelImage(base64);
        handleConfirmScores(results);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erro na análise:", error);
      alert("Erro ao analisar imagem. Tente preenchimento manual.");
      setIsAnalyzing(false);
    }
  };

  const handleConfirmScores = useCallback((results: { category: string; score: number }[]) => {
    const initialData = results.map(r => ({ ...r, goals: [] }));
    isInitialLoad.current = false;
    setBaseData(initialData);
    setIsStarted(true);
    saveToSupabase(initialData, initialData.reduce((acc, curr) => acc + curr.score * 10, 0));
  }, [saveToSupabase]);

  const evolvedData = useMemo(() => {
    return baseData.map(item => {
      const goals = item.goals || [];
      const totalGoals = goals.length;
      if (totalGoals === 0) return { ...item, currentScore: item.score };
      const completedCount = goals.filter(g => g.completed).length;
      const bonus = (completedCount / totalGoals) * (10 - item.score);
      return { ...item, currentScore: parseFloat((item.score + bonus).toFixed(1)) };
    });
  }, [baseData]);

  const updateCategoryGoals = (categoryName: string, goals: Goal[]) => {
    setBaseData(prev => prev.map(c => c.category === categoryName ? { ...c, goals } : c));
  };

  if (isLoadingSession) return <div className="min-h-screen bg-[#1a1612] flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;
  if (!session) return <Auth />;

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {levelUpInfo && <LevelUpModal {...levelUpInfo} xp={500} onClose={() => setLevelUpInfo(null)} />}
      
      {isAnalyzing && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
          <div className="w-32 h-32 bg-amber-600 rounded-full flex items-center justify-center mb-8 animate-pulse border-4 border-[#f5e6d3]">
            <BrainCircuit size={64} className="text-[#1a1612] animate-bounce" />
          </div>
          <h2 className="text-4xl font-dst text-white mb-2 uppercase italic tracking-tighter">Processando Sinais...</h2>
          <p className="text-amber-500 font-dst text-sm uppercase tracking-widest">A IA está decodificando sua Roda da Vida</p>
        </div>
      )}

      <nav className="bg-[#1a1612]/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#3d352d] px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-600 rounded-[8px] flex items-center justify-center text-[#1a1612] shadow-lg rotate-3 border-2 border-[#f5e6d3]">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="text-xl font-dst font-bold text-[#f5e6d3] leading-none uppercase tracking-widest">Planner 2026</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] text-amber-500/80 uppercase tracking-[0.2em] font-black">Constant Discovery</p>
                {isSaving ? (
                  <div className="flex items-center gap-1">
                    <Loader2 size={10} className="animate-spin text-amber-500" />
                    <span className="text-[8px] text-amber-500/50 uppercase">Sincronizando...</span>
                  </div>
                ) : lastSaved && (
                  <span className="text-[8px] text-[#f5e6d3]/30 uppercase">Salvo em {lastSaved.toLocaleTimeString()}</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => supabase?.auth.signOut()} className="p-2 text-[#f5e6d3]/40 hover:text-red-500 transition-colors" title="Sair da Jornada"><LogOut size={20} /></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {!isStarted ? (
          <section className="max-w-6xl mx-auto mt-12 mb-20 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-6xl font-dst text-[#f5e6d3] tracking-tighter uppercase italic">Diagnóstico Inicial</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 bg-amber-600 hover:bg-amber-500 text-[#1a1612] px-8 py-4 font-dst text-xl uppercase tracking-widest border-4 border-[#3d352d] shadow-lg transition-all"
                >
                  <Upload size={24} /> Escanear PNG/Foto
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <span className="font-dst text-[#f5e6d3]/20 uppercase italic">ou</span>
                <p className="text-[#f5e6d3]/60 font-dst text-sm italic">Preencha o quiz abaixo manualmente</p>
              </div>
            </div>
            <ManualEntry onConfirm={handleConfirmScores} />
          </section>
        ) : (
          <div className="space-y-16">
            <DSTStats data={evolvedData} totalXP={currentTotalXP} />
            <div className="bg-[#f5e6d3] text-[#1a1612] p-8 md:p-12 rounded-[4px] shadow-2xl border-x-[12px] border-y-[4px] border-[#3d352d]">
               <RankingChart data={evolvedData} />
            </div>
            <GoalTracker categories={evolvedData} onUpdateGoals={updateCategoryGoals} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
