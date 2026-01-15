
import React, { useMemo, useState } from 'react';
import { Heart, Brain, UtensilsCrossed, Sun, CloudSnow, Leaf, Flame, Droplets, Thermometer, User, Home, Users, Smile, Info } from 'lucide-react';
import { WheelData } from '../types';

interface DSTStatsProps {
  data: WheelData[];
  totalXP: number;
}

interface BreakdownItem {
  name: string;
  score: number;
}

interface MacroStatResult {
  value: number;
  breakdown: BreakdownItem[];
}

const DSTStats: React.FC<DSTStatsProps> = ({ data, totalXP }) => {
  const { dayCount, season, seasonIcon, seasonColor, rotation, temp } = useMemo(() => {
    const start = new Date('2026-01-01');
    const today = new Date(); 
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const currentDay = Math.max(1, diff);
    
    const rot = (currentDay / 365) * 360;

    let s = "Verão";
    let icon = <Flame size={20} />;
    let color = "#e74c3c";
    let t = 32;

    if (currentDay >= 79 && currentDay < 172) {
      s = "Outono";
      icon = <Leaf size={20} />;
      color = "#f1c40f"; 
      t = 22;
    } else if (currentDay >= 172 && currentDay < 265) {
      s = "Inverno";
      icon = <CloudSnow size={20} />;
      color = "#3498db"; 
      t = 14;
    } else if (currentDay >= 265 && currentDay < 355) {
      s = "Primavera";
      icon = <Sun size={20} />;
      color = "#2ecc71"; 
      t = 26;
    }

    return { 
      dayCount: currentDay, 
      season: s, 
      seasonIcon: icon, 
      seasonColor: color, 
      rotation: rot,
      temp: t
    };
  }, []);

  // Lógica de Agrupamento em 6 Áreas Macro com Detalhamento
  const macroStats = useMemo(() => {
    const groups = {
      finance: { 
        keys: ['Carreira', 'Trabalho', 'Finanças', 'Dinheiro', 'Negócios', 'Provisão'],
        label: 'Carreira & Finanças'
      },
      social: { 
        keys: ['Amor', 'Romance', 'Família', 'Social', 'Amizades', 'Relacionamentos', 'Vínculos'],
        label: 'Relacionamentos'
      },
      health: { 
        keys: ['Saúde', 'Fitness', 'Exercícios', 'Mental', 'Emocional', 'Sono', 'Autocuidado'],
        label: 'Saúde & Autocuidado'
      },
      environment: { 
        keys: ['Ambiente', 'Casa', 'Organização', 'Segurança', 'Estrutura'],
        label: 'Ambiente & Estrutura'
      },
      growth: { 
        keys: ['Crescimento', 'Pessoal', 'Espiritualidade', 'Valores', 'Estudos', 'Aprendizado'],
        label: 'Crescimento & Interno'
      },
      leisure: { 
        keys: ['Recreação', 'Diversão', 'Lazer', 'Prazer', 'Expressão', 'Hobby'],
        label: 'Lazer & Prazer'
      }
    };

    const calculateGroupData = (categories: string[]): MacroStatResult => {
      const matches = data.filter(d => 
        categories.some(cat => d.category.toLowerCase().includes(cat.toLowerCase()))
      );
      
      const breakdown = matches.map(m => ({
        name: m.category,
        score: m.currentScore || m.score
      }));

      if (matches.length === 0) return { value: 100, breakdown: [] };

      const sum = matches.reduce((acc, curr) => acc + (curr.currentScore || curr.score), 0);
      const avg = sum / matches.length;
      return { 
        value: Math.round(avg * 20),
        breakdown 
      };
    };

    return {
      finance: calculateGroupData(groups.finance.keys),
      social: calculateGroupData(groups.social.keys),
      health: calculateGroupData(groups.health.keys),
      environment: calculateGroupData(groups.environment.keys),
      growth: calculateGroupData(groups.growth.keys),
      leisure: calculateGroupData(groups.leisure.keys)
    };
  }, [data]);

  const StatCircle = ({ stat, color, icon, label, max = 200 }: { stat: MacroStatResult, color: string, icon: React.ReactNode, label: string, max?: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className="flex flex-col items-center relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-[5px] border-[#3d352d] bg-[#1a1612] overflow-hidden flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-help">
          <div className="absolute inset-0 bg-black/40" />
          <div 
            className="absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out opacity-90"
            style={{ height: `${(stat.value / max) * 100}%`, backgroundColor: color }}
          />
          <div className="relative z-10 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
            {icon}
          </div>
          <div className="absolute top-1 left-4 w-6 h-2 bg-white/10 rounded-full blur-[1px] rotate-[-20deg]" />
        </div>
        
        <div className="mt-2 bg-[#1a1612] border-2 border-[#3d352d] min-w-[45px] text-center py-0.5 relative">
          <span className="font-dst text-xs text-[#f5e6d3]">{stat.value}</span>
        </div>
        
        <span className="text-[8px] font-dst text-[#f5e6d3]/50 uppercase mt-1 tracking-tighter text-center max-w-[70px] leading-tight">
          {label}
        </span>

        {/* Tooltip de Detalhamento estilo Pergaminho DST */}
        {isHovered && stat.breakdown.length > 0 && (
          <div className="absolute top-full mt-4 z-[100] w-48 bg-[#f5e6d3] border-4 border-[#3d352d] p-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f5e6d3] border-t-4 border-l-4 border-[#3d352d] rotate-45" />
            <h5 className="font-dst text-[#1a1612] text-xs mb-3 border-b-2 border-[#3d352d]/20 pb-1 uppercase font-bold flex items-center gap-2">
              <Info size={12} /> Origem do Valor
            </h5>
            <div className="space-y-2">
              {stat.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-dst text-[#3d352d]">
                  <span className="opacity-70">{item.name}</span>
                  <span className="font-bold">{(item.score * 20).toFixed(0)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#3d352d]/10 flex justify-between items-center font-bold text-[#1a1612] text-[10px]">
                <span>Média (Geral)</span>
                <span className="text-amber-700">{stat.value}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-8 mb-20 animate-in fade-in duration-1000">
      
      {/* HUD de Tempo */}
      <div className="flex gap-4 items-center scale-90 md:scale-100">
        <div className="relative w-28 h-28 rounded-full border-[6px] border-[#3d352d] bg-[#1a1612] shadow-2xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 flex flex-wrap opacity-30">
            <div className="w-1/2 h-1/2 bg-[#e74c3c]" />
            <div className="w-1/2 h-1/2 bg-[#f1c40f]" />
            <div className="w-1/2 h-1/2 bg-[#2ecc71]" />
            <div className="w-1/2 h-1/2 bg-[#3498db]" />
          </div>
          <div className="z-10 text-center flex flex-col items-center bg-[#1a1612]/70 px-2 py-1 border border-white/5">
            <span className="font-dst text-[8px] text-amber-500 uppercase tracking-widest">Mundo</span>
            <span className="font-dst text-xl text-[#f5e6d3] leading-none">Dia {dayCount}</span>
          </div>
          <div 
            className="absolute w-1.5 h-12 bg-[#3d352d] origin-bottom bottom-1/2 transition-transform duration-1000 z-20" 
            style={{ transform: `rotate(${rotation}deg)` }} 
          />
        </div>

        <div className="relative w-24 h-24 rounded-full border-[5px] border-[#3d352d] bg-[#f5e6d3]/5 flex flex-col items-center justify-center shadow-xl">
           <div className="absolute inset-0 flex items-center justify-center opacity-10">
             {React.cloneElement(seasonIcon as React.ReactElement<any>, { size: 60, color: seasonColor })}
           </div>
           <span className="font-dst text-xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10">{season}</span>
        </div>
      </div>

      {/* Barra de XP e Stats Ambientais */}
      <div className="flex-1 w-full max-w-md space-y-4">
        <div className="bg-[#1a1612]/80 p-4 rounded-sm border-2 border-[#3d352d] shadow-xl">
          <div className="flex justify-between items-end mb-2">
            <h4 className="font-dst text-lg text-[#f5e6d3] tracking-tighter">Survivor XP</h4>
            <span className="font-dst text-xs text-amber-500">{totalXP} pts</span>
          </div>
          <div className="h-3 bg-black/60 border border-[#3d352d] p-0.5">
            <div 
              className="h-full bg-amber-500 transition-all duration-1000"
              style={{ width: `${(totalXP % 1000) / 10}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1a1612] border-2 border-[#3d352d] flex items-center justify-between px-3 py-2">
            <User size={14} className="text-[#f5e6d3]/60" />
            <span className="font-dst text-md text-[#f5e6d3]">{temp}°C</span>
            <Thermometer size={14} className="text-amber-500" />
          </div>
          <div className="bg-[#1a1612] border-2 border-[#3d352d] flex items-center justify-between px-3 py-2">
            <CloudSnow size={14} className="text-[#f5e6d3]/60" />
            <span className="font-dst text-md text-[#f5e6d3]">{temp - 5}°C</span>
            <Droplets size={14} className="text-blue-400" />
          </div>
        </div>
      </div>

      {/* 6 Atributos Macro de Status */}
      <div className="grid grid-cols-3 sm:grid-cols-6 xl:flex gap-4 md:gap-6 justify-center">
        <StatCircle 
          stat={macroStats.finance} 
          color="#f1c40f" 
          icon={<UtensilsCrossed size={24} />} 
          label="Carreira" 
        />
        <StatCircle 
          stat={macroStats.social} 
          color="#c0392b" 
          icon={<Users size={24} fill="currentColor" />} 
          label="Social" 
        />
        <StatCircle 
          stat={macroStats.health} 
          color="#2980b9" 
          icon={<Droplets size={24} fill="currentColor" />} 
          label="Saúde" 
        />
        <StatCircle 
          stat={macroStats.environment} 
          color="#7f8c8d" 
          icon={<Home size={24} fill="currentColor" />} 
          label="Ambiente" 
        />
        <StatCircle 
          stat={macroStats.growth} 
          color="#d35400" 
          icon={<Brain size={24} fill="currentColor" />} 
          label="Mente" 
        />
        <StatCircle 
          stat={macroStats.leisure} 
          color="#2ecc71" 
          icon={<Smile size={24} fill="currentColor" />} 
          label="Lazer" 
        />
      </div>

    </div>
  );
};

export default DSTStats;
