
import React from 'react';
import { Trophy, ChevronRight } from 'lucide-react';

interface LevelUpModalProps {
  area: string;
  days: number;
  level: number;
  xp: number;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ area, days, level, xp, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#1a1612] border-[12px] border-[#3d352d] p-1 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Bordas decorativas estilo DST */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-600/30" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-600/30" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-600/30" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-600/30" />

        <div className="text-center py-8 space-y-6">
          <h2 className="text-5xl font-dst text-[#f5e6d3] tracking-tighter uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
            VOCÊ PASSOU DE NÍVEL!
          </h2>

          <div className="bg-black/40 border-y-4 border-[#3d352d] py-8 flex flex-col md:flex-row items-center justify-center gap-8 px-6">
            <div className="flex flex-col items-start gap-4 text-left">
              <div className="flex items-baseline gap-4">
                <span className="font-dst text-amber-500/60 uppercase text-xs tracking-widest">Tempo de Evolução:</span>
                <span className="font-dst text-2xl text-[#f5e6d3]">{days} dias</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="font-dst text-amber-500/60 uppercase text-xs tracking-widest">Área Conquistada:</span>
                <span className="font-dst text-2xl text-amber-500 uppercase">{area}</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                 <div className="px-3 py-1 bg-amber-600 text-[#1a1612] font-dst text-lg">Nível {level}</div>
                 <span className="font-dst text-[#f5e6d3]/40 text-xs">XP GANHO: {xp}</span>
              </div>
            </div>

            <div className="w-32 h-32 border-4 border-[#3d352d] bg-[#3d352d]/20 flex items-center justify-center relative group">
                <Trophy size={64} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                <div className="absolute -bottom-2 -right-2 bg-amber-600 w-8 h-8 flex items-center justify-center text-[#1a1612] font-black rounded-sm border-2 border-[#f5e6d3]">
                    !
                </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button 
              onClick={onClose}
              className="bg-[#f5e6d3] hover:bg-white text-[#1a1612] px-8 py-3 font-dst text-xl uppercase tracking-widest border-4 border-[#3d352d] shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Continuar Sobrevivendo
            </button>
          </div>
        </div>
        
        {/* Estilização de fundo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
      </div>
    </div>
  );
};

export default LevelUpModal;
