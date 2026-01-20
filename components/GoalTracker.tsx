
import React, { useState, useRef, useEffect } from 'react';
import { WheelData, Goal, Evidence } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { 
  Plus, Trash2, Target, ChevronDown, ChevronUp, 
  Calendar as CalendarIcon, CheckCircle2, Circle, 
  Skull, ArrowUpRight, BookOpen, Users, Hammer,
  Info, Sparkles, MessageSquare, GraduationCap,
  Clock, CheckCircle, HelpCircle
} from 'lucide-react';

interface GoalTrackerProps {
  categories: WheelData[];
  onUpdateGoals: (category: string, goals: Goal[]) => void;
}

const CustomDatePicker: React.FC<{ 
  value: string; 
  onChange: (date: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (!value) return new Date();
    const d = new Date(value + 'T12:00:00');
    return isNaN(d.getTime()) ? new Date() : d;
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const offset = selected.getTimezoneOffset();
    const adjustedDate = new Date(selected.getTime() - (offset * 60 * 1000));
    onChange(adjustedDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const formattedValue = value && !isNaN(new Date(value + 'T12:00:00').getTime()) 
    ? new Date(value + 'T12:00:00').toLocaleDateString('pt-BR') 
    : '';

  const daysInMonth = isNaN(viewDate.getTime()) ? 30 : new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

  return (
    <div className="relative w-full" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="w-full bg-white border-2 border-[#3d352d] rounded-[4px] px-4 py-3 text-sm font-bold text-[#1a1612] flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
        <span className={formattedValue ? 'text-[#1a1612]' : 'text-slate-300'}>{formattedValue || 'SELECIONAR DIA'}</span>
        <CalendarIcon size={16} className="text-[#3d352d]/40" />
      </div>
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-[#f5e6d3] rounded-[4px] shadow-2xl border-4 border-[#3d352d] z-[100] p-6 w-80">
          <div className="flex justify-between items-center mb-6">
            <h5 className="font-dst font-bold text-[#1a1612] capitalize text-lg">
              {!isNaN(viewDate.getTime()) ? months[viewDate.getMonth()] : 'Mês'} {!isNaN(viewDate.getTime()) ? viewDate.getFullYear() : '2026'}
            </h5>
            <div className="flex gap-2">
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-2 hover:bg-[#3d352d]/10 rounded-full text-[#3d352d]"><ChevronDown className="rotate-90" size={20} /></button>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-2 hover:bg-[#3d352d]/10 rounded-full text-[#3d352d]"><ChevronUp className="rotate-90" size={20} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {[...Array(daysInMonth)].map((_, i) => (
              <button key={i} onClick={() => handleDateSelect(i + 1)} className="h-10 w-10 font-dst rounded-full text-sm flex items-center justify-center hover:bg-[#3d352d] hover:text-[#f5e6d3]">
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GoalTracker: React.FC<GoalTrackerProps> = ({ categories, onUpdateGoals }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const addStrategy = (category: string) => {
    const cat = categories.find(c => c.category === category);
    if (!cat) return;
    const newStrategy: Goal = { 
      id: Math.random().toString(36).substr(2, 9), 
      intention: '', 
      smartGoal: '', 
      successIndicator: '', 
      dueDate: '', 
      horizon: 'Médio',
      practiceEvidences: [],
      socialEvidences: [],
      conceptualEvidences: [],
      completed: false 
    };
    onUpdateGoals(category, [...(cat.goals || []), newStrategy]);
  };

  const updateStrategy = (category: string, goalId: string, updates: Partial<Goal>) => {
    const cat = categories.find(c => c.category === category);
    if (!cat) return;
    onUpdateGoals(category, (cat.goals || []).map(g => g.id === goalId ? { ...g, ...updates } : g));
  };

  const addEvidence = (category: string, goalId: string, type: 'practice' | 'social' | 'conceptual') => {
    const cat = categories.find(c => c.category === category);
    const goal = (cat?.goals || []).find(g => g.id === goalId);
    if (!goal) return;

    const newEvidence: Evidence = { id: Math.random().toString(36).substr(2, 5), text: '', completed: false };
    const field = `${type}Evidences` as keyof Goal;
    updateStrategy(category, goalId, { [field]: [...((goal[field] as Evidence[]) || []), newEvidence] });
  };

  const updateEvidence = (category: string, goalId: string, type: 'practice' | 'social' | 'conceptual', evidenceId: string, updates: Partial<Evidence>) => {
    const cat = categories.find(c => c.category === category);
    const goal = (cat?.goals || []).find(g => g.id === goalId);
    if (!goal) return;

    const field = `${type}Evidences` as keyof Goal;
    const newList = ((goal[field] as Evidence[]) || []).map(e => e.id === evidenceId ? { ...e, ...updates } : e);
    updateStrategy(category, goalId, { [field]: newList });
  };

  const removeEvidence = (category: string, goalId: string, type: 'practice' | 'social' | 'conceptual', evidenceId: string) => {
    const cat = categories.find(c => c.category === category);
    const goal = (cat?.goals || []).find(g => g.id === goalId);
    if (!goal) return;

    const field = `${type}Evidences` as keyof Goal;
    const newList = ((goal[field] as Evidence[]) || []).filter(e => e.id !== evidenceId);
    updateStrategy(category, goalId, { [field]: newList });
  };

  const removeStrategy = (category: string, goalId: string) => {
    const cat = categories.find(c => c.category === category);
    if (!cat) return;
    onUpdateGoals(category, (cat.goals || []).filter(g => g.id !== goalId));
  };

  return (
    <div className="max-w-5xl mx-auto pb-48">
      <div className="mb-12 px-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h3 className="text-4xl font-dst text-[#f5e6d3] tracking-tighter uppercase italic">Blueprint de Sobrevivência</h3>
          <p className="text-[#f5e6d3]/60 font-dst text-sm mt-2 tracking-widest uppercase flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" /> Do Intencional ao Acionável
          </p>
        </div>
        <div className="bg-[#1a1612] border-2 border-[#3d352d] p-4 flex gap-6">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-[9px] font-dst text-[#f5e6d3]/50 uppercase tracking-widest">Prática 70%</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-[9px] font-dst text-[#f5e6d3]/50 uppercase tracking-widest">Social 20%</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span className="text-[9px] font-dst text-[#f5e6d3]/50 uppercase tracking-widest">Estudo 10%</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {(categories || []).map((cat) => {
          const isExpanded = expanded === cat.category;
          const currentScore = cat.currentScore || cat.score;
          const goals = cat.goals || [];
          const totalProgress = goals.length > 0 ? Math.round((goals.filter(g => g.completed).length / goals.length) * 100) : 0;

          return (
            <div key={cat.category} className={`bg-[#1a1612] border-4 border-[#3d352d] transition-all duration-300 relative shadow-2xl ${isExpanded ? 'scale-[1.01]' : 'hover:bg-[#25201b]'}`}>
              <div className="p-8 cursor-pointer flex items-center gap-8" onClick={() => setExpanded(isExpanded ? null : cat.category)}>
                <div className="w-16 h-16 bg-[#f5e6d3] rounded-sm border-4 border-[#3d352d] flex items-center justify-center text-[#3d352d] shadow-lg rotate-[-3deg] relative">
                   {CATEGORY_ICONS[cat.category] || <Target size={28} />}
                   <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white w-6 h-6 rounded-sm border-2 border-[#3d352d] flex items-center justify-center font-dst text-xs shadow-md">
                      {Math.floor(currentScore)}
                   </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-2xl font-dst text-[#f5e6d3] tracking-tighter uppercase">{cat.category}</h4>
                    <span className="text-[10px] font-dst text-amber-500 uppercase tracking-widest">{goals.length} ESTRATÉGIAS</span>
                  </div>
                  <div className="h-2 bg-[#3d352d] rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${totalProgress}%` }} />
                  </div>
                </div>
                <div className="text-[#f5e6d3]">{isExpanded ? <ChevronUp size={28} /> : <ChevronDown size={28} />}</div>
              </div>

              {isExpanded && (
                <div className="px-8 pb-10 pt-4 space-y-10 animate-in slide-in-from-top-4">
                  {goals.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-[#3d352d] bg-[#3d352d]/10">
                      <p className="text-[#f5e6d3]/30 font-dst text-xs uppercase tracking-widest italic">Nenhuma intenção de desenvolvimento traçada ainda.</p>
                    </div>
                  )}

                  <div className="space-y-12">
                    {goals.map(goal => (
                      <div key={goal.id} className={`p-8 bg-[#f5e6d3] border-4 border-[#3d352d] relative shadow-xl transition-all ${goal.completed ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                        
                        <div className="flex justify-between items-start mb-8 border-b-2 border-[#3d352d]/10 pb-4">
                          <div className="flex-1">
                            <label className="text-[10px] font-dst text-amber-700 uppercase font-black tracking-widest mb-1 block">Intenção de Desenvolvimento</label>
                            <input 
                              className="w-full bg-transparent border-none p-0 font-dst text-2xl text-[#1a1612] outline-none placeholder:text-[#3d352d]/20" 
                              placeholder="EX: Fortalecer resiliência emocional..." 
                              value={goal.intention} 
                              onChange={(e) => updateStrategy(cat.category, goal.id, { intention: e.target.value })} 
                            />
                          </div>
                          <button onClick={() => removeStrategy(cat.category, goal.id)} className="p-2 text-[#3d352d]/40 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                          <div className="space-y-2 md:col-span-2">
                            <label className="flex items-center gap-2 font-dst text-[10px] text-[#3d352d] uppercase tracking-widest font-bold">
                              <Target size={12} className="text-amber-600" /> Meta SMART (Resultado Esperado)
                            </label>
                            <textarea 
                              className="w-full bg-white/50 border-2 border-[#3d352d] px-4 py-3 text-sm font-bold text-[#1a1612] min-h-[80px] outline-none focus:bg-white transition-colors"
                              placeholder="O que especificamente será alcançado? Como?"
                              value={goal.smartGoal}
                              onChange={(e) => updateStrategy(cat.category, goal.id, { smartGoal: e.target.value })}
                            />
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 font-dst text-[10px] text-[#3d352d] uppercase tracking-widest font-bold">
                                <Clock size={12} className="text-amber-600" /> Horizonte
                              </label>
                              <select 
                                className="w-full bg-white border-2 border-[#3d352d] px-4 py-3 text-xs font-bold text-[#1a1612] outline-none appearance-none"
                                value={goal.horizon}
                                onChange={(e) => updateStrategy(cat.category, goal.id, { horizon: e.target.value as any })}
                              >
                                <option>Curto</option>
                                <option>Médio</option>
                                <option>Longo</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="font-dst text-[10px] text-[#3d352d] uppercase tracking-widest font-bold">Prazo Estimado</label>
                              <CustomDatePicker value={goal.dueDate} onChange={(d) => updateStrategy(cat.category, goal.id, { dueDate: d })} />
                            </div>
                          </div>
                        </div>

                        <div className="mb-10 space-y-2">
                           <label className="flex items-center gap-2 font-dst text-[10px] text-[#3d352d] uppercase tracking-widest font-bold">
                             <CheckCircle size={12} className="text-emerald-600" /> Indicador de Sucesso
                           </label>
                           <input 
                              className="w-full bg-white/50 border-2 border-[#3d352d] px-4 py-3 text-sm font-bold text-[#1a1612] outline-none focus:bg-white"
                              placeholder="Como você saberá que essa estratégia funcionou?"
                              value={goal.successIndicator}
                              onChange={(e) => updateStrategy(cat.category, goal.id, { successIndicator: e.target.value })}
                           />
                        </div>

                        <div className="space-y-6 bg-[#3d352d]/5 p-6 border-2 border-[#3d352d]/10">
                          <div className="flex items-center gap-2 mb-2">
                             <HelpCircle size={14} className="text-amber-700" />
                             <h5 className="font-dst text-xs text-[#3d352d] uppercase font-black">Evidências de Aprendizado (70/20/10)</h5>
                          </div>

                          <div className="space-y-3">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-dst text-emerald-700 uppercase font-bold flex items-center gap-2"><Hammer size={12}/> Prática e Aplicação (70%)</span>
                                <button onClick={() => addEvidence(cat.category, goal.id, 'practice')} className="text-[9px] font-dst uppercase text-emerald-700 hover:underline">+ Adicionar Teste Prático</button>
                             </div>
                             <div className="space-y-2">
                                {(goal.practiceEvidences || []).map(ev => (
                                  <div key={ev.id} className="flex gap-4 items-center group/ev">
                                     <button onClick={() => updateEvidence(cat.category, goal.id, 'practice', ev.id, { completed: !ev.completed })} className={`w-6 h-6 border-2 border-[#3d352d] flex items-center justify-center flex-shrink-0 ${ev.completed ? 'bg-emerald-600' : 'bg-white'}`}>
                                        {ev.completed && <CheckCircle2 size={14} className="text-white" />}
                                     </button>
                                     <input 
                                        className="flex-1 bg-transparent border-b border-[#3d352d]/20 text-xs font-bold text-[#1a1612] outline-none" 
                                        placeholder="Aplicação real ou teste no dia a dia..."
                                        value={ev.text}
                                        onChange={(e) => updateEvidence(cat.category, goal.id, 'practice', ev.id, { text: e.target.value })}
                                     />
                                     <button 
                                        onClick={() => removeEvidence(cat.category, goal.id, 'practice', ev.id)} 
                                        className="opacity-0 group-hover/ev:opacity-100 p-1 text-[#3d352d]/30 hover:text-red-600 transition-all"
                                     >
                                        <Trash2 size={14} />
                                     </button>
                                  </div>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-3">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-dst text-blue-700 uppercase font-bold flex items-center gap-2"><MessageSquare size={12}/> Troca e Social (20%)</span>
                                <button onClick={() => addEvidence(cat.category, goal.id, 'social')} className="text-[9px] font-dst uppercase text-blue-700 hover:underline">+ Adicionar Interação</button>
                             </div>
                             <div className="space-y-2">
                                {(goal.socialEvidences || []).map(ev => (
                                  <div key={ev.id} className="flex gap-4 items-center group/ev">
                                     <button onClick={() => updateEvidence(cat.category, goal.id, 'social', ev.id, { completed: !ev.completed })} className={`w-6 h-6 border-2 border-[#3d352d] flex items-center justify-center flex-shrink-0 ${ev.completed ? 'bg-blue-600' : 'bg-white'}`}>
                                        {ev.completed && <CheckCircle2 size={14} className="text-white" />}
                                     </button>
                                     <input 
                                        className="flex-1 bg-transparent border-b border-[#3d352d]/20 text-xs font-bold text-[#1a1612] outline-none" 
                                        placeholder="Feedback, mentoria ou troca com outros..."
                                        value={ev.text}
                                        onChange={(e) => updateEvidence(cat.category, goal.id, 'social', ev.id, { text: e.target.value })}
                                     />
                                     <button 
                                        onClick={() => removeEvidence(cat.category, goal.id, 'social', ev.id)} 
                                        className="opacity-0 group-hover/ev:opacity-100 p-1 text-[#3d352d]/30 hover:text-red-600 transition-all"
                                     >
                                        <Trash2 size={14} />
                                     </button>
                                  </div>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-3">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-dst text-amber-700 uppercase font-bold flex items-center gap-2"><GraduationCap size={12}/> Estudo e Conceito (10%)</span>
                                <button onClick={() => addEvidence(cat.category, goal.id, 'conceptual')} className="text-[9px] font-dst uppercase text-amber-700 hover:underline">+ Adicionar Estudo</button>
                             </div>
                             <div className="space-y-2">
                                {(goal.conceptualEvidences || []).map(ev => (
                                  <div key={ev.id} className="flex gap-4 items-center group/ev">
                                     <button onClick={() => updateEvidence(cat.category, goal.id, 'conceptual', ev.id, { completed: !ev.completed })} className={`w-6 h-6 border-2 border-[#3d352d] flex items-center justify-center flex-shrink-0 ${ev.completed ? 'bg-amber-600' : 'bg-white'}`}>
                                        {ev.completed && <CheckCircle2 size={14} className="text-white" />}
                                     </button>
                                     <input 
                                        className="flex-1 bg-transparent border-b border-[#3d352d]/20 text-xs font-bold text-[#1a1612] outline-none" 
                                        placeholder="Leitura, curso ou palestra de apoio..."
                                        value={ev.text}
                                        onChange={(e) => updateEvidence(cat.category, goal.id, 'conceptual', ev.id, { text: e.target.value })}
                                     />
                                     <button 
                                        onClick={() => removeEvidence(cat.category, goal.id, 'conceptual', ev.id)} 
                                        className="opacity-0 group-hover/ev:opacity-100 p-1 text-[#3d352d]/30 hover:text-red-600 transition-all"
                                     >
                                        <Trash2 size={14} />
                                     </button>
                                  </div>
                                ))}
                             </div>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#3d352d]/10 flex justify-end">
                          <button 
                            onClick={() => updateStrategy(cat.category, goal.id, { completed: !goal.completed })}
                            className={`px-6 py-3 font-dst text-xs uppercase tracking-widest border-2 border-[#3d352d] transition-all flex items-center gap-2 ${goal.completed ? 'bg-[#3d352d] text-white' : 'bg-white text-[#1a1612] hover:bg-emerald-50'}`}
                          >
                             {goal.completed ? 'Estratégia Masterizada' : 'Marcar como Concluído'}
                             {goal.completed && <Skull size={14} className="text-amber-500" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => addStrategy(cat.category)} 
                    className="w-full py-6 border-4 border-dashed border-[#3d352d] text-[#f5e6d3]/40 hover:text-amber-500 hover:border-amber-500 transition-all font-dst text-lg tracking-widest uppercase italic bg-black/20"
                  >
                    Mapear Nova Estratégia de Desenvolvimento +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-20 flex flex-col items-center opacity-30 px-6 text-center">
        <Skull size={48} className="text-[#f5e6d3] mb-4" />
        <p className="font-dst text-[10px] uppercase tracking-[0.5em] text-[#f5e6d3] max-w-sm">
          "A sobrevivência não vem apenas do que você faz, mas de quem você se torna no processo."
        </p>
      </div>
    </div>
  );
};

export default GoalTracker;
