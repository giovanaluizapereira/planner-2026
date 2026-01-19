
import React, { useState } from 'react';
import { HelpCircle, Check, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { CATEGORY_QUESTIONS, CATEGORY_METADATA } from '../constants';

interface ManualEntryProps {
  onConfirm: (data: { category: string; score: number }[]) => void;
}

const ManualEntry: React.FC<ManualEntryProps> = ({ onConfirm }) => {
  const categories = Object.keys(CATEGORY_QUESTIONS);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(categories.map(cat => [cat, 5]))
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number[]>>(
    Object.fromEntries(categories.map(cat => [cat, []]))
  );
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleScoreChange = (category: string, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const handleQuizAnswer = (category: string, questionIdx: number, value: number) => {
    const currentAnswers = [...(quizAnswers[category] || [])];
    currentAnswers[questionIdx] = value;
    
    const filledAnswers = currentAnswers.filter(v => v !== undefined);
    const sum = filledAnswers.reduce((acc, curr) => acc + (curr || 0), 0);
    const avg = parseFloat((sum / filledAnswers.length).toFixed(1));
    setScores(prev => ({ ...prev, [category]: avg }));
    
    setQuizAnswers(prev => ({ ...prev, [category]: currentAnswers }));
  };

  const handleSubmit = () => {
    const data = categories.map(cat => ({
      category: cat,
      score: scores[cat]
    }));
    onConfirm(data);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const meta = CATEGORY_METADATA[cat];
          const isExpanded = expandedCategory === cat;
          const questionsFilled = quizAnswers[cat].filter(v => v !== undefined).length;
          
          return (
            <div 
              key={cat} 
              className={`bg-[#1a1612] border-4 border-[#3d352d] shadow-xl flex flex-col transition-all duration-300 ${isExpanded ? 'lg:col-span-2 scale-[1.02] z-10' : 'hover:border-amber-500/50'}`}
            >
              <div 
                className="p-6 cursor-pointer flex flex-col gap-4"
                onClick={() => setExpandedCategory(isExpanded ? null : cat)}
              >
                {/* Cabeçalho do Card */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-dst text-xl text-[#f5e6d3] uppercase tracking-tighter leading-none">{cat}</h3>
                    <p className="text-[10px] text-[#f5e6d3]/40 mt-1 uppercase tracking-wider line-clamp-1">{meta?.description}</p>
                  </div>
                  <div 
                    className="w-8 h-8 rounded-sm border-2 border-[#3d352d] flex items-center justify-center text-[#1a1612] shadow-inner"
                    style={{ backgroundColor: meta?.color }}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Score Display */}
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-dst text-[#f5e6d3]/60 uppercase tracking-widest">Score Inicial:</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-dst text-3xl text-amber-500 drop-shadow-md">{scores[cat]}</span>
                    <span className="font-dst text-xs text-[#f5e6d3]/40">/10</span>
                  </div>
                </div>

                {/* Mini Progresso das Perguntas */}
                <div className="flex gap-1 h-1">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div 
                      key={i} 
                      className={`flex-1 h-full rounded-full transition-colors ${quizAnswers[cat][i] !== undefined ? 'bg-amber-500' : 'bg-[#3d352d]'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Quiz Detalhado */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 bg-[#25201b] border-t-2 border-[#3d352d] animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-6 pt-4 border-t border-[#3d352d]/30">
                    <HelpCircle size={14} className="text-amber-500" />
                    <p className="text-[10px] text-amber-500 uppercase tracking-widest italic font-bold">5 Perguntas de Precisão</p>
                    <span className="ml-auto text-[10px] text-[#f5e6d3]/30 uppercase font-dst">{questionsFilled}/5 Respondidas</span>
                  </div>
                  
                  <div className="space-y-6">
                    {CATEGORY_QUESTIONS[cat].map((q, idx) => (
                      <div key={idx} className="space-y-3">
                        <p className="text-[11px] font-dst text-[#f5e6d3] leading-relaxed opacity-80">{idx + 1}. {q}</p>
                        <div className="flex justify-between gap-1">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button
                              key={num}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuizAnswer(cat, idx, num);
                              }}
                              className={`flex-1 py-2 text-[10px] font-dst border border-[#3d352d] transition-all rounded-sm ${
                                quizAnswers[cat][idx] === num 
                                  ? 'bg-amber-600 text-[#1a1612] font-black border-amber-400' 
                                  : 'bg-[#1a1612] text-[#f5e6d3]/30 hover:bg-[#3d352d] hover:text-[#f5e6d3]'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#3d352d]/30">
                    <button 
                      onClick={() => setExpandedCategory(null)}
                      className="w-full py-2 bg-[#3d352d] text-[#f5e6d3] font-dst text-[10px] uppercase tracking-widest hover:bg-[#4d443a] transition-colors"
                    >
                      Confirmar Notas desta Área
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-6 pt-12 pb-24">
        <div className="max-w-md w-full bg-amber-600/10 border-2 border-dashed border-amber-600/30 p-4 text-center">
          <p className="text-[10px] text-amber-500 uppercase tracking-widest font-dst italic leading-relaxed">
            "Para uma precisão letal, expanda cada área e responda as 5 questões. 
            O score será a média das suas respostas."
          </p>
        </div>
        
        <button 
          onClick={handleSubmit}
          className="w-full max-w-lg bg-[#f5e6d3] hover:bg-white text-[#1a1612] py-8 font-dst text-3xl uppercase tracking-[0.2em] border-4 border-[#3d352d] shadow-2xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-4 group"
        >
          <Check size={40} className="group-hover:rotate-12 transition-transform" />
          Iniciar Jornada 2026
        </button>
      </div>
    </div>
  );
};

export default ManualEntry;
