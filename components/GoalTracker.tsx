
import React, { useState, useRef, useEffect } from 'react';
import { WheelData, Goal } from '../types';
import { CATEGORY_ICONS, BAR_COLORS } from '../constants';
import { Plus, Trash2, Target, ChevronDown, ChevronUp, Calendar as CalendarIcon, CheckCircle2, Circle, Ruler, ChevronLeft, ChevronRight, Skull, ArrowUpRight } from 'lucide-react';

interface GoalTrackerProps {
  categories: WheelData[];
  onUpdateGoals: (category: string, goals: Goal[]) => void;
}

const CustomDatePicker: React.FC<{ 
  value: string; 
  onChange: (date: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value + 'T12:00:00') : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const daysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));

  const handleDateSelect = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const offset = selected.getTimezoneOffset();
    const adjustedDate = new Date(selected.getTime() - (offset * 60 * 1000));
    onChange(adjustedDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    for (let d = 1; d <= daysInMonth; d++) {
      const selectedDate = value ? new Date(value + 'T12:00:00') : null;
      const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      days.push(
        <button key={d} onClick={() => handleDateSelect(d)} className={`h-10 w-10 font-dst rounded-full text-sm flex items-center justify-center transition-all ${isSelected ? 'bg-[#3d352d] text-[#f5e6d3]' : 'hover:bg-slate-100 text-[#1a1612]'}`}>
          {d}
        </button>
      );
    }
    return days;
  };

  const formattedValue = value ? new Date(value + 'T12:00:00').toLocaleDateString('pt-BR') : '';

  return (
    <div className="relative w-full" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="w-full bg-white border-2 border-[#3d352d] rounded-[4px] px-4 py-3 text-sm font-bold text-[#1a1612] flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
        <span className={formattedValue ? 'text-[#1a1612]' : 'text-slate-300'}>{formattedValue || 'SELECIONAR DIA'}</span>
        <CalendarIcon size={16} className="text-[#3d352d]/40" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-[#f5e6d3] rounded-[4px] shadow-2xl border-4 border-[#3d352d] z-[100] p-6 w-80">
          <div className="flex justify-between items-center mb-6">
            <h5 className="font-dst font-bold text-[#1a1612] capitalize text-lg">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</h5>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-[#3d352d]/10 rounded-full text-[#3d352d]"><ChevronLeft size={20} /></button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-[#3d352d]/10 rounded-full text-[#3d352d]"><ChevronRight size={20} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 mb-2 text-center text-[10px] font-dst font-black opacity-40">{daysShort.map(d => <div key={d}>{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-y-1">{renderDays()}</div>
        </div>
      )}
    </div>
  );
};

const GoalTracker: React.FC<GoalTrackerProps> = ({ categories, onUpdateGoals }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const addGoal = (category: string) => {
    const cat = categories.find(c => c.category === category);
    if (!cat) return;
    const newGoal: Goal = { id: Math.random().toString(36).substr(2, 9), description: '', measurable: '', dueDate: '', completed: false };
    onUpdateGoals(category, [...cat.goals, newGoal]);
  };

  const updateGoal = (category: string, goalId: string, updates: Partial<Goal>) => {
    const cat = categories.find(c => c.category === category);
    if (!cat) return;
    onUpdateGoals(category, cat.goals.map(g => g.id === goalId ? { ...g, ...updates } : g));
  };

  const removeGoal = (category: string, goalId: string) => {
    const cat = categories.find(c => c.category === category);
    if (!cat) return;
    onUpdateGoals(category, cat.goals.filter(g => g.id !== goalId));
  };

  return (
    <div className="max-w-5xl mx-auto pb-48">
      <div className="mb-12 px-4">
        <h3 className="text-4xl font-dst text-[#f5e6d3] tracking-tighter uppercase italic">Recipe for Survival</h3>
        <p className="text-[#f5e6d3]/60 font-dst text-sm mt-2 tracking-widest uppercase">Defina estratégias para alcançar o próximo nível</p>
      </div>

      <div className="flex flex-col gap-8">
        {categories.map((cat, idx) => {
          const isExpanded = expanded === cat.category;
          const totalGoals = cat.goals.length;
          const completedGoals = cat.goals.filter(g => g.completed).length;
          const totalProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
          
          const currentScore = cat.currentScore || cat.score;
          const nextLevel = Math.floor(currentScore) + 1;

          return (
            <div key={cat.category} className={`bg-[#1a1612] border-4 border-[#3d352d] transition-all duration-300 relative shadow-2xl ${isExpanded ? 'scale-[1.02]' : 'hover:bg-[#25201b]'}`}>
              <div className="p-8 cursor-pointer flex items-center gap-8" onClick={() => setExpanded(isExpanded ? null : cat.category)}>
                <div className="w-20 h-20 bg-[#f5e6d3] rounded-full border-4 border-[#3d352d] flex items-center justify-center text-[#3d352d] shadow-lg rotate-[-5deg] relative">
                   {CATEGORY_ICONS[cat.category] || <Target size={32} />}
                   <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white w-8 h-8 rounded-full border-2 border-[#3d352d] flex items-center justify-center font-dst text-sm shadow-md">
                      {Math.floor(currentScore)}
                   </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="text-3xl font-dst text-[#f5e6d3] tracking-tighter uppercase">{cat.category}</h4>
                    <div className="flex items-center gap-2 text-amber-500 font-dst text-xs">
                       <span>Nível {Math.floor(currentScore)}</span>
                       <ArrowUpRight size={14} />
                       <span className="opacity-60 text-[10px]">Alvo: {nextLevel > 10 ? 10 : nextLevel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-[#3d352d] p-0.5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${totalProgress}%` }} />
                    </div>
                    <span className="text-[10px] font-dst text-amber-500 font-bold uppercase">{totalProgress}%</span>
                  </div>
                </div>
                <div className="text-[#f5e6d3]">{isExpanded ? <ChevronUp size={32} /> : <ChevronDown size={32} />}</div>
              </div>

              {isExpanded && (
                <div className="px-8 pb-10 pt-4 space-y-8 animate-in slide-in-from-top-4">
                  <div className="bg-[#3d352d]/30 p-4 border border-dashed border-amber-500/30 rounded-sm">
                     <p className="font-dst text-[10px] text-amber-500/80 uppercase tracking-widest text-center">
                        Para chegar no <span className="text-amber-500 font-bold">Nível {nextLevel > 10 ? 10 : nextLevel}</span>, você deve completar estas estratégias:
                     </p>
                  </div>

                  <div className="space-y-6">
                    {cat.goals.map(goal => (
                      <div key={goal.id} className={`p-8 bg-[#f5e6d3] border-4 border-[#3d352d] transition-all relative ${goal.completed ? 'opacity-40 grayscale rotate-1' : 'rotate-[-1deg] shadow-xl'}`}>
                        <div className="flex flex-col md:flex-row gap-8">
                          <button onClick={() => updateGoal(cat.category, goal.id, { completed: !goal.completed })} className={`w-14 h-14 border-4 border-[#3d352d] flex items-center justify-center transition-all ${goal.completed ? 'bg-amber-600' : 'bg-white hover:bg-slate-50'}`}>
                            {goal.completed ? <CheckCircle2 size={32} className="text-white" /> : <div className="w-full h-full" />}
                          </button>
                          <div className="flex-1 space-y-6">
                            <input className={`w-full bg-transparent border-b-4 border-[#3d352d]/20 py-2 font-dst text-2xl text-[#1a1612] outline-none placeholder:text-[#3d352d]/30 ${goal.completed ? 'line-through' : ''}`} placeholder="SUA ESTRATÉGIA DE SOBREVIVÊNCIA..." value={goal.description} onChange={(e) => updateGoal(cat.category, goal.id, { description: e.target.value })} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="font-dst text-[10px] text-[#3d352d]/60 uppercase tracking-widest font-bold ml-1">Indicador de Sucesso</label>
                                <input className="w-full bg-white border-2 border-[#3d352d] px-4 py-3 text-sm font-bold text-[#1a1612] outline-none" placeholder="Quantidade / Unidade" value={goal.measurable} onChange={(e) => updateGoal(cat.category, goal.id, { measurable: e.target.value })} />
                              </div>
                              <div className="space-y-2">
                                <label className="font-dst text-[10px] text-[#3d352d]/60 uppercase tracking-widest font-bold ml-1">Data Limite</label>
                                <CustomDatePicker value={goal.dueDate} onChange={(date) => updateGoal(cat.category, goal.id, { dueDate: date })} />
                              </div>
                            </div>
                          </div>
                          <button onClick={() => removeGoal(cat.category, goal.id)} className="w-14 h-14 flex items-center justify-center text-[#3d352d]/40 hover:text-red-600 transition-colors"><Trash2 size={24} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addGoal(cat.category)} className="w-full py-8 border-4 border-dashed border-[#3d352d] text-[#f5e6d3]/40 hover:text-amber-500 hover:border-amber-500 transition-all font-dst text-xl tracking-widest uppercase italic">Criar Nova Estratégia +</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-20 flex flex-col items-center opacity-30">
        <Skull size={48} className="text-[#f5e6d3] mb-4" />
        <p className="font-dst text-[10px] uppercase tracking-[0.5em] text-[#f5e6d3]">Don't Starve in 2026</p>
      </div>
    </div>
  );
};

export default GoalTracker;
