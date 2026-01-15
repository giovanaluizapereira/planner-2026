
import React, { useState } from 'react';
import { HelpCircle, Check, Pencil } from 'lucide-react';
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
    
    const answeredCount = currentAnswers.filter(v => v !== undefined).length;
    if (answeredCount > 0) {
      const sum = currentAnswers.reduce((acc, curr) => acc + (curr || 0), 0);
      const avg = parseFloat((sum / answeredCount).toFixed(1));
      setScores(prev => ({ ...prev, [category]: avg }));
    }
    
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
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const meta = CATEGORY_METADATA[cat];
          return (
            <div key={cat} className="bg-[#1a1612] border-4 border-[#3d352d] shadow-xl flex flex-col transition-all duration-300">
              <div className="p-6 flex flex-col gap-4">
                {/* Cabeçalho do Card */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-dst text-xl text-[#f5e6d3] uppercase tracking-tighter leading-none">{cat}</h3>
                    <p className="text-[10px] text-[#f5e6d3]/40 mt-1 uppercase tracking-wider">{meta?.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                      className="p-1.5 text-[#f5e6d3]/30 hover:text-amber-500 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <div 
                      className="w-6 h-6 rounded-sm border border-[#3d352d]"
                      style={{ backgroundColor: meta?.color }}
                    />
                  </div>
                </div>

                {/* Score Display */}
                <div className="flex justify-between items-end mt-2">
                  <span className="text-[10px] font-dst text-[#f5e6d3]/60 uppercase tracking-widest">Avaliação:</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-dst text-2xl text-[#f5e6d3]">{scores[cat]}</span>
                    <span className="font-dst text-xs text-[#f5e6d3]/40">/10</span>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-1">
                  <div className="relative h-6 flex items-center">
                    <div className="absolute inset-0 h-2 my-auto bg-[#3d352d] rounded-full overflow-hidden">
                       <div 
                         className="h-full transition-all duration-300" 
                         style={{ 
                           width: `${(scores[cat] / 10) * 100}%`,
                           backgroundColor: meta?.color,
                           opacity: 0.8
                         }} 
                       />
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      step="0.5"
                      value={scores[cat]} 
                      onChange={(e) => handleScoreChange(cat, parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#3d352d]"
                    />
                  </div>
                  <div className="flex justify-between text-[8px] font-dst text-[#f5e6d3]/30 uppercase tracking-tighter">
                    <span>Muito Baixo</span>
                    <span className="text-amber-500/50">Neutro</span>
                    <span>Excelente</span>
                  </div>
                </div>
              </div>

              {/* Quiz Opcional Expandido */}
              {expandedCategory === cat && (
                <div className="px-6 pb-6 pt-2 bg-[#3d352d]/20 border-t-2 border-[#3d352d]/50 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle size={14} className="text-amber-500" />
                    <p className="text-[10px] text-amber-500/60 uppercase tracking-widest italic">Pergaminho de Precisão</p>
                  </div>
                  <div className="space-y-4">
                    {CATEGORY_QUESTIONS[cat].map((q, idx) => (
                      <div key={idx} className="space-y-2">
                        <p className="text-[10px] font-dst text-[#f5e6d3]/70 leading-tight">{q}</p>
                        <div className="flex justify-between gap-0.5">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button
                              key={num}
                              onClick={() => handleQuizAnswer(cat, idx, num)}
                              className={`flex-1 py-1 text-[9px] font-dst border border-[#3d352d] transition-all ${
                                quizAnswers[cat][idx] === num 
                                  ? 'bg-amber-600 text-[#1a1612] font-bold' 
                                  : 'bg-[#1a1612] text-[#f5e6d3]/20 hover:bg-[#3d352d]'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={handleSubmit}
          className="w-full max-w-md bg-[#f5e6d3] hover:bg-white text-[#1a1612] py-6 font-dst text-2xl uppercase tracking-[0.2em] border-4 border-[#3d352d] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group"
        >
          <Check size={32} className="group-hover:rotate-12 transition-transform" />
          Iniciar Sobrevivência
        </button>
      </div>
    </div>
  );
};

export default ManualEntry;
