
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Calendar, RefreshCw, Trophy, Save, Loader2 } from 'lucide-react';
import ManualEntry from './components/ManualEntry';
import RankingChart from './components/RankingChart';
import GoalTracker from './components/GoalTracker';
import DSTStats from './components/DSTStats';
import LevelUpModal from './components/LevelUpModal';
import { WheelData, Goal } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [baseData, setBaseData] = useState<WheelData[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Controle de Level Up
  const [levelUpInfo, setLevelUpInfo] = useState<{ area: string, days: number, level: number } | null>(null);
  const prevScoresRef = useRef<Record<string, number>>({});
  const startTimeRef = useRef<number>(Date.now());

  // Carregar dados iniciais do Supabase ao montar o componente
  useEffect(() => {
    const loadData = async () => {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('planner_runs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setBaseData(data.user_data);
        setIsStarted(true);
        setLastSaved(new Date(data.created_at));
        // Ajustar scores anteriores para o detector de level up não disparar logo de cara
        const scores: Record<string, number> = {};
        data.user_data.forEach((d: any) => scores[d.category] = d.score);
        prevScoresRef.current = scores;
      }
    };
    loadData();
  }, []);

  const saveToSupabase = useCallback(async (currentData: WheelData[], xp: number) => {
    if (!supabase || currentData.length === 0) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('planner_runs')
      .insert([{ 
        user_data: currentData, 
        total_xp: xp 
      }]);

    if (!error) {
      setLastSaved(new Date());
    }
    setIsSaving(false);
  }, []);

  const handleConfirmScores = useCallback((results: { category: string; score: number }[]) => {
    startTimeRef.current = Date.now();
    const initialData = results.map(r => ({
      ...r,
      goals: []
    }));
    setBaseData(initialData);
    
    const scores: Record<string, number> = {};
    initialData.forEach(d => scores[d.category] = d.score);
    prevScoresRef.current = scores;
    setIsStarted(true);
    
    // Salva imediatamente ao iniciar
    saveToSupabase(initialData, 0);
  }, [saveToSupabase]);

  const evolvedData = useMemo(() => {
    return baseData.map(item => {
      const totalGoals = item.goals.length;
      if (totalGoals === 0) return { ...item, currentScore: item.score };

      const completedCount = item.goals.filter(g => g.completed).length;
      const progressRatio = completedCount / totalGoals;
      
      const bonus = progressRatio * (10 - item.score);
      const currentScore = parseFloat((item.score + bonus).toFixed(1));

      return { ...item, currentScore };
    });
  }, [baseData]);

  const totalXP = useMemo(() => {
    const baseXP = baseData.reduce((acc, curr) => acc + curr.score * 10, 0);
    const goalsXP = baseData.reduce((acc, curr) => 
      acc + (curr.goals.filter(g => g.completed).length * 150), 0
    );
    const evolutionXP = evolvedData.reduce((acc, curr) => {
      const diff = (curr.currentScore || 0) - curr.score;
      return acc + (diff > 0 ? diff * 100 : 0);
    }, 0);

    return Math.floor(baseXP + goalsXP + evolutionXP);
  }, [baseData, evolvedData]);

  // Detector de Level Up e Auto-save ao mudar dados
  useEffect(() => {
    if (baseData.length === 0) return;

    let shouldSave = false;
    evolvedData.forEach(item => {
      const prevScore = prevScoresRef.current[item.category];
      const newScore = item.currentScore || item.score;

      if (prevScore !== undefined && Math.floor(newScore) > Math.floor(prevScore)) {
        const diffDays = Math.floor((Date.now() - startTimeRef.current) / (1000 * 60 * 60 * 24)) + 1;
        setLevelUpInfo({
          area: item.category,
          days: diffDays,
          level: Math.floor(newScore)
        });
        shouldSave = true;
      }
      
      if (newScore !== prevScore) {
        shouldSave = true;
      }
      
      prevScoresRef.current[item.category] = newScore;
    });

    if (shouldSave) {
      const timeout = setTimeout(() => saveToSupabase(baseData, totalXP), 2000);
      return () => clearTimeout(timeout);
    }
  }, [evolvedData, baseData, totalXP, saveToSupabase]);

  const updateCategoryGoals = (categoryName: string, goals: Goal[]) => {
    setBaseData(prev => prev.map(c => 
      c.category === categoryName ? { ...c, goals } : c
    ));
  };

  const handleReset = async () => {
    if (window.confirm("Isso apagará sua 'run' atual permanentemente. Deseja recomeçar?")) {
      setBaseData([]);
      setIsStarted(false);
      prevScoresRef.current = {};
      if (supabase) {
        await supabase.from('planner_runs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {levelUpInfo && (
        <LevelUpModal 
          area={levelUpInfo.area}
          days={levelUpInfo.days}
          level={levelUpInfo.level}
          xp={500}
          onClose={() => setLevelUpInfo(null)}
        />
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
                {isSaving && <Loader2 size={10} className="animate-spin text-amber-500" />}
                {lastSaved && !isSaving && <span className="text-[8px] text-[#f5e6d3]/30 uppercase tracking-tighter">Salvo: {lastSaved.toLocaleTimeString()}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isStarted && (
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 bg-[#3d352d] hover:bg-[#4d443a] px-5 py-2 rounded-[4px] border border-[#f5e6d3]/20 transition-all text-xs font-dst uppercase tracking-widest text-[#f5e6d3]"
              >
                <RefreshCw size={14} />
                New Run
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {!isStarted ? (
          <section className="max-w-4xl mx-auto mt-12 mb-20">
            <div className="text-center mb-16">
              <h2 className="text-6xl font-dst text-[#f5e6d3] mb-6 tracking-tighter drop-shadow-lg">Mapeie sua Sobrevivência</h2>
              <p className="text-[#f5e6d3]/60 font-dst text-lg max-w-2xl mx-auto leading-relaxed italic">
                Insira suas notas atuais ou responda o pergaminho de cada área para uma análise mais profunda.
              </p>
            </div>
            <ManualEntry onConfirm={handleConfirmScores} />
          </section>
        ) : (
          <div className="space-y-16">
            <DSTStats data={evolvedData} totalXP={totalXP} />
            
            <div className="bg-[#f5e6d3] text-[#1a1612] p-8 md:p-12 rounded-[4px] shadow-2xl border-x-[12px] border-y-[4px] border-[#3d352d] relative">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3d352d] text-[#f5e6d3] px-6 py-2 font-dst text-sm uppercase tracking-widest rounded-full">
                  Progress Report
               </div>
               <RankingChart data={evolvedData} />
            </div>

            <GoalTracker 
              categories={evolvedData} 
              onUpdateGoals={updateCategoryGoals} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
