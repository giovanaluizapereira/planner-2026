
import React, { useMemo } from 'react';
import { WheelData } from '../types';
import { BAR_COLORS, CATEGORY_ICONS } from '../constants';
import { Target, TrendingUp } from 'lucide-react';

interface RankingChartProps {
  data: WheelData[];
}

const RankingChart: React.FC<RankingChartProps> = ({ data }) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => (b.currentScore || b.score) - (a.currentScore || a.score));
  }, [data]);

  const average = useMemo(() => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + (curr.currentScore || curr.score), 0);
    return (sum / data.length).toFixed(1);
  }, [data]);

  if (data.length === 0) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="mb-10">
          <h2 className="text-4xl font-dst text-[#1a1612] tracking-tighter">Ranking de Atributos</h2>
          <p className="text-slate-600 font-medium text-sm mt-1 uppercase tracking-widest">Sua evolução atual baseada em metas cumpridas</p>
        </div>

        <div className="overflow-x-auto pb-6 scrollbar-hide">
          <div className="flex items-end justify-between min-w-[700px] h-[300px] gap-2 px-2">
            {sortedData.map((item, index) => {
              const displayScore = item.currentScore || item.score;
              const heightPercentage = (displayScore / 10) * 100;
              const color = BAR_COLORS[index % BAR_COLORS.length];
              const hasImproved = (item.currentScore || 0) > item.score;
              
              return (
                <div key={item.category} className="flex flex-col items-center flex-1 group h-full justify-end">
                  <div className="relative mb-3 flex flex-col items-center">
                    {hasImproved && (
                      <span className="absolute -top-6 text-[10px] font-dst text-emerald-600 animate-bounce">
                        +{ (item.currentScore! - item.score).toFixed(1) }
                      </span>
                    )}
                    <span className="font-dst text-2xl" style={{ color: '#1a1612' }}>
                      {displayScore}
                    </span>
                  </div>
                  
                  <div 
                    className="w-full border-t-4 border-x-4 border-[#3d352d] transition-all duration-1000 ease-out relative shadow-sm"
                    style={{ 
                      height: `${heightPercentage}%`, 
                      backgroundColor: color,
                      minHeight: '12px'
                    }}
                  >
                     <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                  </div>

                  <div className="mt-4 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-[#3d352d] flex items-center justify-center bg-white mb-2 shadow-sm text-[#3d352d]">
                      {CATEGORY_ICONS[item.category] || <Target size={16} />}
                    </div>
                    <span className="text-[9px] font-dst font-bold uppercase tracking-tighter text-center h-4 flex items-center opacity-70">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:w-72 flex flex-col gap-6">
        <div className="bg-[#3d352d] rounded-[4px] p-8 text-[#f5e6d3] shadow-inner flex flex-col items-center text-center">
          <span className="text-[10px] font-dst tracking-widest opacity-60 mb-2 uppercase">Sobrevivência Média</span>
          <div className="text-7xl font-dst mb-2 tracking-tighter">
            {average}
          </div>
          <p className="text-[10px] uppercase font-bold text-amber-500">Tier Global</p>
        </div>
        
        <div className="border-4 border-dashed border-[#3d352d]/20 p-6 rounded-[4px] flex-1">
          <h5 className="font-dst text-sm mb-4 uppercase flex items-center gap-2">
            <TrendingUp size={14} /> Trends
          </h5>
          <div className="space-y-4">
             {data.filter(i => i.goals.length > 0).slice(0, 3).map((item, idx) => {
               const completedCount = item.goals.filter(g => g.completed).length;
               const progress = Math.round((completedCount / item.goals.length) * 100);
               return (
                <div key={idx} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-dst uppercase">
                      <span>{item.category}</span>
                      <span>{progress}%</span>
                   </div>
                   <div className="h-2 bg-[#1a1612]/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3d352d] transition-all duration-1000" style={{ width: `${progress}%` }} />
                   </div>
                </div>
               );
             })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingChart;
