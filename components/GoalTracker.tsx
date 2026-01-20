
import React, { useState, useRef, useEffect } from 'react';
import { WheelData, Goal, Milestone, Strategy, Reflection } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { 
  Plus, Trash2, ChevronDown, ChevronUp, 
  Calendar as CalendarIcon, CheckCircle2, 
  Skull, Sparkles, HelpCircle, Minimize2, Maximize2,
  Flag, Map, Clock, AlertCircle, History, 
  ArrowRight, MessageSquare, Lightbulb, RotateCcw,
  // Fix: Added missing Target icon import
  Target
} from 'lucide-react';

interface GoalTrackerProps {
  categories: WheelData[];
  onUpdateGoals: (category: string, goals: Goal[]) => void;
}

const MentalTooltip: React.FC<{ title: string, hint: string, examples: string[] }> = ({ title, hint, examples }) => (
  <div className="group relative inline-block ml-1 align-middle">
    <HelpCircle size={14} className="text-[#3d352d]/40 cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-[#1a1612] text-[#f5e6d3] text-[10px] rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl z-[200] border-2 border-[#3d352d]">
      <p className="font-dst text-amber-500 uppercase mb-2 border-b border-[#3d352d] pb-1">{title}</p>
      <p className="font-dst mb-3 leading-relaxed italic">"{hint}"</p>
      <div className="space-y-1 opacity-70">
        <p className="font-bold">EXEMPLOS:</p>
        {examples.map((ex, i) => <p key={i}>• {ex}</p>)}
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1a1612] rotate-45 border-r-2 border-b-2 border-[#3d352d]" />
    </div>
  </div>
);

const CustomDatePicker: React.FC<{ 
  value: string; 
  onChange: (date: string) => void;
  label?: string;
}> = ({ value, onChange, label = 'ESCOLHER DATA' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (!value) return new Date();
    const d = new Date(value + 'T12:00:00');
    return isNaN(d.getTime()) ? new Date() : d;
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

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

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  return (
    <div className="relative w-full" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="w-full bg-white border-2 border-[#3d352d] rounded-[4px] px-3 py-2 text-[10px] font-bold text-[#1a1612] flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-all">
        <span className={formattedValue ? 'text-[#1a1612]' : 'text-slate-300'}>{formattedValue || label}</span>
        <CalendarIcon size={12} className="text-[#3d352d]/40" />
      </div>
      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-[#f5e6d3] rounded-[4px] shadow-2xl border-4 border-[#3d352d] z-[200] p-4 w-64">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-dst font-bold text-[#1a1612] capitalize text-xs">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</h5>
            <div className="flex gap-1">
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-1 hover:bg-[#3d352d]/10 rounded text-[#3d352d]"><ChevronDown className="rotate-90" size={14} /></button>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-1 hover:bg-[#3d352d]/10 rounded text-[#3d352d]"><ChevronUp className="rotate-90" size={14} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 mb-2 text-[8px] font-black text-[#3d352d]/40 uppercase text-center">
            {weekDays.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const isSelected = value === `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              return (
                <button key={dayNum} onClick={() => handleDateSelect(dayNum)} className={`h-7 w-7 font-dst rounded-sm text-[10px] flex items-center justify-center transition-colors ${isSelected ? 'bg-amber-600 text-[#1a1612] font-black border-[#3d352d]' : 'text-[#1a1612] hover:bg-[#3d352d] hover:text-[#f5e6d3] font-bold'}`}>{dayNum}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const GoalTracker: React.FC<GoalTrackerProps> = ({ categories, onUpdateGoals }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [collapsedStrategies, setCollapsedStrategies] = useState<Set<string>>(new Set());
  const [reflectionContext, setReflectionContext] = useState<{ category: string, goal: Goal, type: 'prorrogacao' | 'ajuste' | 'conclusao' } | null>(null);
  const [reflectionText, setReflectionText] = useState({ worked: '', didnt: '', adjust: '' });

  const toggleStrategyCollapse = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCollapsedStrategies(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addGoal = (category: string) => {
    const cat = categories.find(c => c.category === category);
    if (!cat) return;
    const newGoal: Goal = { 
      id: Math.random().toString(36).substr(2, 9), 
      intention: '', 
      successCriteria: '', 
      dueDate: '', 
      status: 'ativo',
      milestones: [],
      reflections: [],
      completed: false 
    };
    onUpdateGoals(category, [...(cat.goals || []), newGoal]);
  };

  const updateGoal = (category: string, goalId: string, updates: Partial<Goal>) => {
    const cat = categories.find(c => c.category === category);
    if (!cat) return;
    onUpdateGoals(category, (cat.goals || []).map(g => g.id === goalId ? { ...g, ...updates } : g));
  };

  // Fix: Added missing removeGoal function
  const removeGoal = (category: string, goalId: string) => {
    const cat = categories.find(c => c.category === category);
    if (!cat) return;
    onUpdateGoals(category, (cat.goals || []).filter(g => g.id !== goalId));
  };

  const addMilestone = (category: string, goalId: string) => {
    const cat = categories.find(c => c.category === category);
    const goal = (cat?.goals || []).find(g => g.id === goalId);
    if (!goal) return;
    const newMilestone: Milestone = { id: Math.random().toString(36).substr(2, 5), description: '', targetDate: '', strategies: [], completed: false };
    updateGoal(category, goalId, { milestones: [...(goal.milestones || []), newMilestone] });
  };

  const updateMilestone = (category: string, goalId: string, mid: string, updates: Partial<Milestone>) => {
    const cat = categories.find(c => c.category === category);
    const goal = (cat?.goals || []).find(g => g.id === goalId);
    if (!goal) return;
    updateGoal(category, goalId, { milestones: goal.milestones.map(m => m.id === mid ? { ...m, ...updates } : m) });
  };

  const addStrategyToMilestone = (category: string, goalId: string, mid: string) => {
    const cat = categories.find(c => c.category === category);
    const goal = (cat?.goals || []).find(g => g.id === goalId);
    if (!goal) return;
    const milestone = goal.milestones.find(m => m.id === mid);
    if (!milestone) return;
    const newStrategy: Strategy = { id: Math.random().toString(36).substr(2, 5), text: '', completed: false };
    updateMilestone(category, goalId, mid, { strategies: [...(milestone.strategies || []), newStrategy] });
  };

  const handleReflectionCommit = () => {
    if (!reflectionContext) return;
    const { category, goal, type } = reflectionContext;
    const newReflection: Reflection = {
      date: new Date().toISOString(),
      whatWorked: reflectionText.worked,
      whatDidnt: reflectionText.didnt,
      adjustments: reflectionText.adjust,
      type
    };

    const updates: Partial<Goal> = {
      reflections: [...(goal.reflections || []), newReflection],
      status: type === 'conclusao' ? 'concluido' : 'ativo',
      completed: type === 'conclusao'
    };

    updateGoal(category, goal.id, updates);
    setReflectionContext(null);
    setReflectionText({ worked: '', didnt: '', adjust: '' });
  };

  return (
    <div className="max-w-5xl mx-auto pb-48">
      {/* Reflection Overlay */}
      {reflectionContext && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-[#f5e6d3] border-8 border-[#3d352d] p-8 shadow-2xl relative">
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-600 px-4 py-1 border-2 border-[#3d352d] font-dst text-[#1a1612] uppercase text-xs">
                MOMENTO DE REFLEXÃO
             </div>
             <h3 className="font-dst text-xl text-[#1a1612] mb-6 uppercase text-center">
                {reflectionContext.type === 'conclusao' ? 'MISSÃO CUMPRIDA?' : 'REAJUSTANDO A ROTA'}
             </h3>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="font-dst text-[10px] text-emerald-800 uppercase font-black flex items-center gap-2"><Lightbulb size={12} /> O que funcionou até agora?</label>
                   <textarea value={reflectionText.worked} onChange={e => setReflectionText(p => ({...p, worked: e.target.value}))} className="w-full bg-white/50 border-2 border-[#3d352d] p-3 font-dst text-xs outline-none focus:bg-white" placeholder="Sua percepção honesta..." />
                </div>
                <div className="space-y-2">
                   <label className="font-dst text-[10px] text-red-800 uppercase font-black flex items-center gap-2"><Skull size={12} /> O que não saiu como planejado?</label>
                   <textarea value={reflectionText.didnt} onChange={e => setReflectionText(p => ({...p, didnt: e.target.value}))} className="w-full bg-white/50 border-2 border-[#3d352d] p-3 font-dst text-xs outline-none focus:bg-white" placeholder="Onde a vida real interferiu?" />
                </div>
                <div className="space-y-2">
                   <label className="font-dst text-[10px] text-amber-800 uppercase font-black flex items-center gap-2"><RotateCcw size={12} /> O que será ajustado a partir de agora?</label>
                   <textarea value={reflectionText.adjust} onChange={e => setReflectionText(p => ({...p, adjust: e.target.value}))} className="w-full bg-white/50 border-2 border-[#3d352d] p-3 font-dst text-xs outline-none focus:bg-white" placeholder="Seu novo experimento..." />
                </div>
                <div className="pt-4 flex gap-4">
                   <button onClick={() => setReflectionContext(null)} className="flex-1 py-3 font-dst text-xs uppercase border-2 border-[#3d352d] text-[#3d352d]/60 hover:text-[#3d352d]">Cancelar</button>
                   <button onClick={handleReflectionCommit} disabled={!reflectionText.worked || !reflectionText.adjust} className="flex-1 py-3 bg-amber-600 text-[#1a1612] font-dst text-xs uppercase border-2 border-[#3d352d] shadow-lg disabled:opacity-50">Confirmar Registro</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-12 px-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h3 className="text-4xl font-dst text-[#f5e6d3] tracking-tighter uppercase italic">Mapa de Intenções</h3>
          <p className="text-[#f5e6d3]/60 font-dst text-sm mt-2 tracking-widest uppercase flex items-center gap-2">
            <Map size={16} className="text-amber-500" /> Vivendo metas, não gerenciando planos
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {(categories || []).map((cat) => {
          const isCatExpanded = expandedCategory === cat.category;
          const goals = cat.goals || [];

          return (
            <div key={cat.category} className={`bg-[#1a1612] border-4 border-[#3d352d] transition-all duration-300 relative shadow-2xl ${isCatExpanded ? 'scale-[1.01]' : 'hover:bg-[#25201b]'}`}>
              <div className="p-8 cursor-pointer flex items-center gap-8" onClick={() => setExpandedCategory(isCatExpanded ? null : cat.category)}>
                <div className="w-16 h-16 bg-[#f5e6d3] rounded-sm border-4 border-[#3d352d] flex items-center justify-center text-[#3d352d] shadow-lg rotate-[-3deg] relative">
                   {/* Fix: Target is now imported */}
                   {CATEGORY_ICONS[cat.category] || <Target size={28} />}
                   <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white w-6 h-6 rounded-sm border-2 border-[#3d352d] flex items-center justify-center font-dst text-xs shadow-md">
                      {Math.floor(cat.currentScore || cat.score)}
                   </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-2xl font-dst text-[#f5e6d3] tracking-tighter uppercase">{cat.category}</h4>
                    <span className="text-[10px] font-dst text-amber-500 uppercase tracking-widest">{goals.length} INTENÇÕES</span>
                  </div>
                </div>
                <div className="text-[#f5e6d3]">{isCatExpanded ? <ChevronUp size={28} /> : <ChevronDown size={28} />}</div>
              </div>

              {isCatExpanded && (
                <div className="px-8 pb-10 pt-4 space-y-10 animate-in slide-in-from-top-4">
                  <div className="space-y-6">
                    {goals.map(goal => {
                      const isCollapsed = collapsedStrategies.has(goal.id);
                      const isExpired = goal.dueDate && new Date(goal.dueDate) < new Date() && goal.status === 'ativo';

                      return (
                        <div key={goal.id} className={`bg-[#f5e6d3] border-4 border-[#3d352d] relative shadow-xl transition-all ${goal.completed ? 'opacity-60 grayscale-[0.5]' : ''} ${isExpired ? 'ring-4 ring-red-600 ring-offset-4 ring-offset-[#1a1612]' : ''}`}>
                          
                          {isExpired && (
                            <div className="absolute -top-4 right-4 bg-red-600 text-white px-3 py-1 font-dst text-[10px] uppercase border-2 border-[#3d352d] z-10 animate-bounce">
                               Reavaliação Necessária!
                            </div>
                          )}

                          <div className={`p-6 flex items-center justify-between cursor-pointer ${isCollapsed ? 'bg-[#3d352d]/5' : 'border-b-2 border-[#3d352d]/10'}`} onClick={() => toggleStrategyCollapse(goal.id)}>
                            <div className="flex-1">
                              <label className="text-[9px] font-dst text-amber-700 uppercase font-black tracking-widest mb-1 block">
                                O que eu quero alcançar?
                                <MentalTooltip title="A INTENÇÃO" hint="Como eu quero me sentir ou o que quero mudar de verdade?" examples={['Sentir-me bem com meu corpo', 'Liderar com segurança', 'Tranquilidade financeira']} />
                              </label>
                              <div className="flex items-center gap-4">
                                <input className="w-full bg-transparent border-none p-0 font-dst text-xl text-[#1a1612] outline-none placeholder:text-[#3d352d]/20" placeholder="Meu desejo ou resolução..." value={goal.intention} onClick={(e) => e.stopPropagation()} onChange={(e) => updateGoal(cat.category, goal.id, { intention: e.target.value })} />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                               {/* Fix: replaced broken code with removeGoal call */}
                               <button onClick={(e) => { e.stopPropagation(); removeGoal(cat.category, goal.id); }} className="p-2 text-[#3d352d]/30 hover:text-red-600"><Trash2 size={16} /></button>
                               <div className="text-[#3d352d]/40 p-1">{isCollapsed ? <Maximize2 size={16} /> : <Minimize2 size={16} />}</div>
                            </div>
                          </div>

                          {!isCollapsed && (
                            <div className="p-8 space-y-8 animate-in slide-in-from-top-2 duration-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2 font-dst text-[10px] text-[#3d352d] uppercase tracking-widest font-bold">
                                    <HelpCircle size={12} className="text-blue-600" /> Quando considero atingida?
                                    <MentalTooltip title="REGRA DE VITÓRIA" hint="O que precisa acontecer para eu dizer: ok, deu certo?" examples={['Pesar no mínimo 69kg', 'Receber feedback positivo de clareza', 'Ter R$ 10k guardados']} />
                                  </label>
                                  <textarea className="w-full bg-white/50 border-2 border-[#3d352d] px-4 py-3 text-sm font-bold text-[#1a1612] min-h-[60px] outline-none" placeholder="O critério de sucesso prático..." value={goal.successCriteria} onChange={(e) => updateGoal(cat.category, goal.id, { successCriteria: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2 font-dst text-[10px] text-[#3d352d] uppercase tracking-widest font-bold">
                                    <Clock size={12} className="text-amber-600" /> Até quando?
                                    <MentalTooltip title="O HORIZONTE" hint="Até quando quero resolver isso, considerando a vida real?" examples={['Até as férias de Abril', 'Dezembro de 2026', 'Próximos 3 meses']} />
                                  </label>
                                  <CustomDatePicker value={goal.dueDate} onChange={(d) => updateGoal(cat.category, goal.id, { dueDate: d })} label="DATA FINAL DA META" />
                                  {goal.reflections.length > 0 && (
                                    <div className="mt-2 flex items-center gap-2 text-[8px] font-dst text-amber-700 uppercase">
                                       <History size={10} /> {goal.reflections.filter(r => r.type === 'prorrogacao').length} Prorrogação(ões)
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* MARCOS E ESTRATÉGIAS */}
                              <div className="space-y-6 bg-[#3d352d]/5 p-6 border-2 border-[#3d352d]/10">
                                <div className="flex justify-between items-center mb-4">
                                   <div className="flex items-center gap-2">
                                      <Map size={14} className="text-amber-700" />
                                      <h5 className="font-dst text-xs text-[#3d352d] uppercase font-black">
                                         Como vou chegar lá? (Fases)
                                         <MentalTooltip title="OS MARCOS" hint="Quais etapas mostram que estou no caminho antes do fim?" examples={['Fase 1: Chegar nos 75kg', 'Fase 2: Conseguir correr 5km', 'Fase 3: Caber no biquíni']} />
                                      </h5>
                                   </div>
                                   <button onClick={() => addMilestone(cat.category, goal.id)} className="text-[9px] font-dst uppercase text-amber-700 hover:underline">+ Criar Fase</button>
                                </div>

                                <div className="space-y-8">
                                   {goal.milestones.map((m) => (
                                     <div key={m.id} className="relative pl-8 border-l-2 border-dashed border-[#3d352d]/20">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#f5e6d3] border-2 border-[#3d352d]" />
                                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                                           <div className="flex-1">
                                              <input className="w-full bg-transparent border-none p-0 font-dst text-sm text-[#1a1612] font-black outline-none placeholder:text-[#3d352d]/30" placeholder="Ex: Fase 1 - Perder os primeiros 5kg..." value={m.description} onChange={e => updateMilestone(cat.category, goal.id, m.id, {description: e.target.value})} />
                                           </div>
                                           <div className="w-32">
                                              <CustomDatePicker value={m.targetDate} onChange={d => updateMilestone(cat.category, goal.id, m.id, {targetDate: d})} label="Meta da Fase" />
                                           </div>
                                        </div>
                                        
                                        <div className="space-y-2 bg-white/30 p-4 border border-[#3d352d]/10">
                                           <div className="flex justify-between items-center mb-2">
                                              <span className="text-[8px] font-dst uppercase text-[#3d352d]/60">Coisas para testar nesta fase:</span>
                                              <button onClick={() => addStrategyToMilestone(cat.category, goal.id, m.id)} className="text-[8px] font-dst uppercase text-blue-700">+ Add Teste</button>
                                           </div>
                                           {(m.strategies || []).map(s => (
                                              <div key={s.id} className="flex gap-2 items-center group/s">
                                                 <button onClick={() => {
                                                   const newList = m.strategies.map(st => st.id === s.id ? {...st, completed: !st.completed} : st);
                                                   updateMilestone(cat.category, goal.id, m.id, {strategies: newList});
                                                 }} className={`w-4 h-4 border border-[#3d352d] flex items-center justify-center ${s.completed ? 'bg-emerald-600' : 'bg-white'}`}>
                                                    {s.completed && <CheckCircle2 size={10} className="text-white" />}
                                                 </button>
                                                 <input className="flex-1 bg-transparent border-none text-[10px] text-[#1a1612] outline-none" value={s.text} placeholder="Ex: Beber 3L de água..." onChange={e => {
                                                   const newList = m.strategies.map(st => st.id === s.id ? {...st, text: e.target.value} : st);
                                                   updateMilestone(cat.category, goal.id, m.id, {strategies: newList});
                                                 }} />
                                                 <button onClick={() => {
                                                   const newList = m.strategies.filter(st => st.id !== s.id);
                                                   updateMilestone(cat.category, goal.id, m.id, {strategies: newList});
                                                 }} className="opacity-0 group-hover/s:opacity-100"><Trash2 size={10} className="text-red-600" /></button>
                                              </div>
                                           ))}
                                        </div>
                                     </div>
                                   ))}
                                </div>
                              </div>

                              {/* FOOTER ACTIONS */}
                              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-[#3d352d]/10">
                                 {isExpired ? (
                                    <div className="flex-1 flex gap-2">
                                       <button onClick={() => setReflectionContext({ category: cat.category, goal, type: 'ajuste' })} className="flex-1 bg-amber-600 text-[#1a1612] py-3 font-dst text-[10px] uppercase border-2 border-[#3d352d] flex items-center justify-center gap-2">
                                          <RotateCcw size={14} /> Mudar Estratégia
                                       </button>
                                       <button onClick={() => setReflectionContext({ category: cat.category, goal, type: 'prorrogacao' })} className="flex-1 bg-white text-[#1a1612] py-3 font-dst text-[10px] uppercase border-2 border-[#3d352d] flex items-center justify-center gap-2">
                                          <Clock size={14} /> Prorrogar Data
                                       </button>
                                    </div>
                                 ) : (
                                    <div className="flex-1" />
                                 )}
                                 <button onClick={() => setReflectionContext({ category: cat.category, goal, type: 'conclusao' })} className="px-8 py-3 bg-[#3d352d] text-[#f5e6d3] font-dst text-[10px] uppercase border-2 border-[#3d352d] flex items-center justify-center gap-2 hover:bg-[#1a1612]">
                                    <Flag size={14} /> Concluir Meta
                                 </button>
                              </div>

                              {/* HISTORICO DE REFLEXAO */}
                              {goal.reflections.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-[#3d352d]/20">
                                   <div className="flex items-center gap-2 mb-4 text-[#3d352d]/40">
                                      <History size={14} />
                                      <h6 className="font-dst text-[9px] uppercase tracking-widest">Diário de Aprendizado</h6>
                                   </div>
                                   <div className="space-y-4">
                                      {goal.reflections.map((ref, idx) => (
                                         <div key={idx} className="bg-white/40 p-4 border border-dashed border-[#3d352d]/20 text-[10px] font-dst italic text-[#3d352d]">
                                            <div className="flex justify-between items-center mb-2">
                                               <span className="text-amber-700 uppercase font-black">{ref.type === 'prorrogacao' ? 'Prorrogação' : 'Ajuste'}</span>
                                               <span className="opacity-40">{new Date(ref.date).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <p><span className="font-bold">O que funcionou:</span> {ref.whatWorked}</p>
                                            <p><span className="font-bold">Ajuste:</span> {ref.adjustments}</p>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={() => addGoal(cat.category)} className="w-full py-6 border-4 border-dashed border-[#3d352d] text-[#f5e6d3]/40 hover:text-amber-500 hover:border-amber-500 transition-all font-dst text-lg tracking-widest uppercase italic bg-black/20">
                    + Iniciar Novo Caminho em {cat.category}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalTracker;
