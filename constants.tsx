
import React from 'react';
import { 
  Heart, 
  Briefcase, 
  Coins, 
  Stethoscope, 
  Users, 
  BookOpen, 
  Smile, 
  Home, 
  Leaf, 
  Palette, 
  Plane,
  Target,
  Sparkles,
  HandHelping,
  Brain
} from 'lucide-react';

export const CATEGORY_METADATA: Record<string, { icon: React.ReactNode, description: string, color: string }> = {
  'Carreira & Trabalho': { 
    icon: <Briefcase size={18} />, 
    description: 'Satisfação no trabalho e crescimento profissional',
    color: '#ef4444' 
  },
  'Finanças & Dinheiro': { 
    icon: <Coins size={18} />, 
    description: 'Segurança financeira e gestão do dinheiro',
    color: '#f97316' 
  },
  'Saúde & Fitness': { 
    icon: <Stethoscope size={18} />, 
    description: 'Saúde física e nível de condicionamento',
    color: '#eab308' 
  },
  'Família': { 
    icon: <Users size={18} />, 
    description: 'Relacionamentos com membros da família',
    color: '#22c55e' 
  },
  'Amor & Romance': { 
    icon: <Heart size={18} />, 
    description: 'Relacionamentos românticos e intimidade',
    color: '#10b981' 
  },
  'Vida Social & Amizades': { 
    icon: <Users size={18} />, 
    description: 'Amizades e conexões sociais',
    color: '#06b6d4' 
  },
  'Crescimento Pessoal': { 
    icon: <Sparkles size={18} />, 
    description: 'Aprendizado e desenvolvimento pessoal',
    color: '#3b82f6' 
  },
  'Recreação & Diversão': { 
    icon: <Plane size={18} />, 
    description: 'Hobbies e atividades de lazer',
    color: '#6366f1' 
  },
  'Ambiente Físico': { 
    icon: <Home size={18} />, 
    description: 'Satisfação com casa e espaço de vida',
    color: '#8b5cf6' 
  },
  'Contribuição & Impacto': { 
    icon: <HandHelping size={18} />, 
    description: 'Retribuir e fazer a diferença',
    color: '#a855f7' 
  },
  'Espiritualidade': { 
    icon: <Leaf size={18} />, 
    description: 'Práticas espirituais e crenças',
    color: '#d946ef' 
  },
  'Saúde Mental & Emocional': { 
    icon: <Brain size={18} />, 
    description: 'Bem-estar emocional e saúde mental',
    color: '#ec4899' 
  }
};

export const CATEGORY_ICONS: Record<string, React.ReactNode> = Object.fromEntries(
  Object.entries(CATEGORY_METADATA).map(([k, v]) => [k, v.icon])
);

export const CATEGORY_QUESTIONS: Record<string, string[]> = {
  'Carreira & Trabalho': [
    'Quão satisfeito você está com suas responsabilidades atuais?',
    'Você sente que tem oportunidades reais de crescimento?',
    'Seu trabalho está alinhado com seu propósito de vida?'
  ],
  'Finanças & Dinheiro': [
    'Sua renda atual cobre suas necessidades e sobra para o futuro?',
    'Quão sob controle estão suas dívidas e gastos mensais?',
    'Você se sente seguro financeiramente para emergências?'
  ],
  'Saúde & Fitness': [
    'Quão satisfeito você está com sua disposição física diária?',
    'Como você avalia sua qualidade de sono e alimentação?',
    'Com que frequência você pratica exercícios ou cuida do corpo?'
  ],
  'Família': [
    'Como está a qualidade do tempo que você passa com seus familiares?',
    'Há harmonia e suporte mútuo nas relações familiares?',
    'Você se sente presente na vida das pessoas que ama?'
  ],
  'Amor & Romance': [
    'Quão realizado você se sente em sua vida afetiva/romântica?',
    'Existe parceria, respeito e cumplicidade no relacionamento?',
    'Você se sente amado e valorizado?'
  ],
  'Vida Social & Amizades': [
    'Você possui amigos em quem pode confiar plenamente?',
    'Quão ativa é sua vida social fora do ambiente de trabalho?',
    'Você se sente pertencente a um grupo ou comunidade?'
  ],
  'Crescimento Pessoal': [
    'Você está aprendendo coisas novas regularmente?',
    'Quão satisfeito está com seu desenvolvimento intelectual?',
    'Você investe tempo em ler ou fazer cursos de interesse?'
  ],
  'Recreação & Diversão': [
    'Você reserva tempo de qualidade para hobbies e diversão?',
    'Sua vida tem momentos genuínos de relaxamento e prazer?',
    'Quão satisfeito você está com suas últimas férias ou folgas?'
  ],
  'Ambiente Físico': [
    'Sua casa é um lugar de descanso e conforto real?',
    'A organização dos seus espaços ajuda na sua rotina?',
    'Você se sente seguro e produtivo nos lugares que frequenta?'
  ],
  'Contribuição & Impacto': [
    'Você sente que seu trabalho ou ações ajudam outras pessoas?',
    'Você participa de projetos voluntários ou causas sociais?',
    'Quão satisfeito você está com sua contribuição para o mundo?'
  ],
  'Espiritualidade': [
    'Você sente conexão com algo maior ou paz interior?',
    'Quão frequentes são seus momentos de reflexão ou oração?',
    'Sua vida parece ter um significado profundo e transcendente?'
  ],
  'Saúde Mental & Emocional': [
    'Quão bem você lida com suas emoções e estresse?',
    'Sua autoestima está em um nível saudável?',
    'Você reserva tempo para o autoconhecimento?'
  ]
};

export const BAR_COLORS = Object.values(CATEGORY_METADATA).map(v => v.color);
