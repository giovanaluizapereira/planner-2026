import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { RefreshCw, Trophy, Loader2, Upload, LayoutPanelLeft, Key, ExternalLink } from 'lucide-react';
import ManualEntry from './components/ManualEntry';
import RankingChart from './components/RankingChart';
import GoalTracker from './components/GoalTracker';
import DSTStats from './components/DSTStats';
import LevelUpModal from './components/LevelUpModal';
import WheelUploader from './components/WheelUploader';
import { WheelData, Goal } from './types';
import { supabase } from './lib/supabase';
import { analyzeWheelImage } from './services/geminiService';

const App: React.FC = () => {
  const [baseData, setBaseData] = useState<WheelData[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [entryMode, setEntryMode] = useState<'upload' | 'manual'>('upload');
  const [hasApiKey, setHasApiKey] = useState<boolean>(true); // Inicialmente assume que tem
  
  const [levelUpInfo, setLevelUpInfo] = useState<{ area: string, days: number, level: number } | null>(null);
  const prevScoresRef = useRef<Record<string, number>>({});
  const startTimeRef = useRef<number>(Date.now());

  // Verifica se a API KEY está disponível
  useEffect(() => {
    const checkKey = async () => {
      if (!process.env.API_KEY && window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true); // Assume sucesso após abrir o diálogo
    }
  };

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
    await supabase.from('planner_runs').insert([{ user_data: currentData, total_xp: xp }]);
    setLastSaved(new Date());
    setIsSaving(false);
  }, []);

  const handleConfirmScores = useCallback((results: { category: string; score: number }[]) => {
    startTimeRef.current = Date.now();
    const initialData = results.map(r => ({ ...r, goals: [] }));
    setBaseData(initialData);
    setIsStarted(true);
    saveToSupabase(initialData, 0);
  }, [saveToSupabase]);

  const handleImageUpload = async (base64: string) => {
    setCurrentImage(base64);
    setIsAnalyzing(true);
    try {
      const results = await analyzeWheelImage(base64);
      if (results && results.length > 0) {
        handleConfirmScores(results);
      }
    } catch (error: any) {
      console.error("Erro no processamento:", error);
      if (error.message?.includes("not found")) {
        setHasApiKey(false); // Força re-seleção se a chave falhar
      }
      alert("Erro ao analisar imagem. Certifique-se de que a chave API está configurada corretamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const evolvedData = useMemo(() => {
    return baseData.map(item => {
      const totalGoals = item.goals.length;
      if (totalGoals === 0) return { ...item, currentScore: item.score };
      const completedCount = item.goals.filter(g => g.completed).length;
      const progressRatio = completedCount / totalGoals;
      const bonus = progressRatio * (10 - item.score);
      return { ...item, currentScore: parseFloat((item.score + bonus).toFixed(1)) };
    });
  }, [baseData]);

  const totalXP = useMemo(() => {
    const baseXP = baseData.reduce((acc, curr) => acc + curr.score * 10, 0);
    const goalsXP = baseData.reduce((acc, curr) => acc + (curr.goals.filter(g => g.completed).length * 150), 0);
    const evolutionXP = evolvedData.reduce((acc, curr) => {
      const diff = (curr.currentScore || 0) - curr.score;
      return acc + (diff > 0 ? diff * 100 : 0);
    }, 0);
    return Math.floor(baseXP + goalsXP + evolutionXP);
  }, [baseData, evolvedData]);

  useEffect(() => {
    if (baseData.length === 0) return;
    let shouldSave = false;
    evolvedData.forEach(item => {
      const prevScore = prevScoresRef.current[item.category];
      const newScore = item.currentScore || item.score;
      if (prevScore !== undefined && Math.floor(newScore) > Math.floor(prevScore)) {
        setLevelUpInfo({ area: item.category, days: 1, level: Math.floor(newScore) });
        shouldSave = true;
      }
      if (newScore !== prevScore) shouldSave = true;
      prevScoresRef.current[item.category] = newScore;
    });
    if (shouldSave) saveToSupabase(baseData, totalXP);
  }, [evolvedData, baseData, totalXP, saveToSupabase]);

  const updateCategoryGoals = (categoryName: string, goals: Goal[]) => {
    setBaseData(prev => prev.map(c => c.category === categoryName ? { ...c, goals } : c));
  };

  if (!hasApiKey && !process.env.API_KEY) {
    return (
      <div className="min-h-screen bg-[#1a1612] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-[#25201b] border-4 border-[#3d352d] p-10 shadow-2xl">
          <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-[#f5e6d3] shadow-lg">
            <Key size={40} className="text-[#1a1612]" />
          </div>
          <h2 className="text-3xl font-dst text-[#f5e6d3] mb-4 uppercase tracking-tighter">Conexão com IA Necessária</h2>
          <p className="text-[#f5e6d3]/60 mb-8 text-sm leading-relaxed">
            Para analisar sua Roda da Vida via imagem, precisamos conectar com o Google Gemini. Por favor, selecione sua chave API de um projeto com faturamento ativo.
          </p>
          <button 
            onClick={handleOpenKeySelector}
            className="w-full bg-[#f5e6d3] text-[#1a1612] py-4 font-dst text-xl uppercase tracking-widest border-4 border-[#3d352d] hover:bg-white transition-all mb-4"
          >
            Configurar Chave API
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-[10px] text-amber-500 uppercase tracking-widest hover:underline"
          >
            Documentação de Faturamento <ExternalLink size={10} />
          </a>
        </div>
      </div>
    );
  }

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
                onClick={() => window.confirm("Reiniciar run?") && setBaseData([])}
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
          <section className="max-w-4xl mx-auto mt-12 mb-20 space-y-12">
            <div className="text-center">
              <h2 className="text-6xl font-dst text-[#f5e6d3] mb-6 tracking-tighter drop-shadow-lg uppercase">Mapeie sua Jornada</h2>
              <p className="text-[#f5e6d3]/60 font-dst text-lg max-w-2xl mx-auto leading-relaxed italic">
                Sua sobrevivência em 2026 começa com um diagnóstico honesto.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setEntryMode('upload')}
                className={`flex items-center gap-3 px-6 py-3 font-dst uppercase tracking-widest text-sm border-2 transition-all ${entryMode === 'upload' ? 'bg-amber-600 text-[#1a1612] border-amber-500' : 'bg-[#1a1612] text-[#f5e6d3]/40 border-[#3d352d]'}`}
              >
                <Upload size={18} /> Subir Imagem
              </button>
              <button 
                onClick={() => setEntryMode('manual')}
                className={`flex items-center gap-3 px-6 py-3 font-dst uppercase tracking-widest text-sm border-2 transition-all ${entryMode === 'manual' ? 'bg-amber-600 text-[#1a1612] border-amber-500' : 'bg-[#1a1612] text-[#f5e6d3]/40 border-[#3d352d]'}`}
              >
                <LayoutPanelLeft size={18} /> Notas Manuais
              </button>
            </div>

            <div className="bg-[#1a1612] p-8 border-4 border-[#3d352d] shadow-2xl">
              {entryMode === 'upload' ? (
                <div className="space-y-8">
                  <WheelUploader 
                    onImageUpload={handleImageUpload} 
                    isAnalyzing={isAnalyzing} 
                    currentImage={currentImage} 
                  />
                </div>
              ) : (
                <ManualEntry onConfirm={handleConfirmScores} />
              )}
            </div>
          </section>
        ) : (
          <div className="space-y-16">
            <DSTStats data={evolvedData} totalXP={totalXP} />
            <div className="bg-[#f5e6d3] text-[#1a1612] p-8 md:p-12 rounded-[4px] shadow-2xl border-x-[12px] border-y-[4px] border-[#3d352d] relative">
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
