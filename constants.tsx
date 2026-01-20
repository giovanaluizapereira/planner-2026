
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
    'De 1 a 10, quão satisfeito você está com suas responsabilidades atuais?',
    'Qual nota você dá para as suas chances reais de crescimento hoje?',
    'O quanto você sente que seu trabalho está alinhado ao seu propósito?',
    'Como você avalia o equilíbrio entre seu trabalho e sua vida pessoal?',
    'Quão valorizado e reconhecido você se sente no seu ambiente profissional?'
  ],
  'Finanças & Dinheiro': [
    'Qual nota você dá para o quanto sua renda atual supre suas necessidades?',
    'De 1 a 10, quão sob controle estão suas dívidas e gastos mensais?',
    'O quanto você se sente seguro financeiramente para lidar com imprevistos?',
    'Qual nota você dá para a clareza do seu plano de investimentos ou poupança?',
    'Quão alta é a sua sensação de paz e tranquilidade em relação ao dinheiro?'
  ],
  'Saúde & Fitness': [
    'De 1 a 10, qual nota você dá para a sua disposição física diária?',
    'Como você avalia a qualidade do seu sono atualmente?',
    'Qual nota você dá para a qualidade da sua alimentação no dia a dia?',
    'Quão satisfeito você está com a sua frequência de exercícios físicos?',
    'De 1 a 10, o quanto você está feliz com a sua imagem corporal e saúde?'
  ],
  'Família': [
    'Qual nota você dá para a qualidade do tempo que passa com sua família?',
    'De 1 a 10, quão harmônico e leve é o ambiente nas suas relações familiares?',
    'O quanto você se sente presente e conectado com as pessoas que ama?',
    'Qual nota você dá para a sua habilidade de resolver conflitos em família?',
    'Quão satisfeito você está com o apoio que recebe dos seus familiares?'
  ],
  'Amor & Romance': [
    'De 1 a 10, quão realizado você se sente em sua vida afetiva/romântica?',
    'Qual nota você dá para o nível de cumplicidade e respeito na relação?',
    'O quanto você se sente amado e desejado pelo seu parceiro(a)?',
    'Como você avalia a qualidade da comunicação e intimidade entre vocês?',
    'De 1 a 10, quão satisfeito você está com o tempo dedicado ao romance?'
  ],
  'Vida Social & Amizades': [
    'Qual nota você dá para o nível de confiança que tem em seus amigos?',
    'De 1 a 10, quão satisfeito você está com a sua vida social atual?',
    'O quanto você sente que pertence e é aceito nos seus grupos sociais?',
    'Qual nota você dá para a alegria e inspiração que suas amizades te trazem?',
    'Quão livre e autêntico você se sente quando está com seus amigos?'
  ],
  'Crescimento Pessoal': [
    'De 1 a 10, o quanto você sente que está aprendendo coisas novas?',
    'Qual nota você dá para o seu nível de desenvolvimento intelectual hoje?',
    'Quão satisfeito você está com o tempo que dedica aos seus estudos e leituras?',
    'O quanto você sente que evoluiu como pessoa no último ano?',
    'De 1 a 10, qual nota você dá para a clareza das suas metas de vida?'
  ],
  'Recreação & Diversão': [
    'Qual nota você dá para a qualidade dos seus momentos de lazer?',
    'De 1 a 10, o quanto você se permite relaxar e brincar sem sentir culpa?',
    'Quão satisfeito você está com as suas opções de entretenimento e hobbies?',
    'O quanto você sente que seus momentos de diversão recarregam suas baterias?',
    'De 1 a 10, qual nota você dá para a leveza da sua rotina fora do trabalho?'
  ],
  'Ambiente Físico': [
    'Qual nota você dá para o conforto e acolhimento da sua casa hoje?',
    'De 1 a 10, quão satisfeito você está com a organização dos seus espaços?',
    'O quanto seu ambiente atual te ajuda a ser produtivo e focado?',
    'Qual nota você dá para a segurança e localização de onde você vive?',
    'De 1 a 10, o quanto o seu ambiente físico reflete quem você é?'
  ],
  'Contribuição & Impacto': [
    'De 1 a 10, o quanto você sente que suas ações ajudam outras pessoas?',
    'Qual nota você dá para o seu nível de envolvimento em causas sociais?',
    'Quão satisfeito você está com o impacto que deixa no mundo hoje?',
    'O quanto você se sente realizado ao praticar atos de generosidade?',
    'De 1 a 10, qual nota você dá para a sua utilidade para a sociedade?'
  ],
  'Espiritualidade': [
    'Qual nota você dá para o seu nível de paz interior e conexão espiritual?',
    'De 1 a 10, quão satisfeito você está com sua prática meditativa ou de fé?',
    'O quanto você sente que sua vida possui um significado profundo?',
    'Qual nota você dá para a sua resiliência baseada em suas crenças?',
    'De 1 a 10, o quanto você vive de acordo com seus valores espirituais?'
  ],
  'Saúde Mental & Emocional': [
    'Qual nota você dá para a sua habilidade de lidar com o estresse?',
    'De 1 a 10, o quanto você se sente no controle das suas emoções?',
    'Quão satisfeito você está com o seu nível de autoestima atual?',
    'Qual nota você dá para o tempo que dedica ao seu autoconhecimento?',
    'De 1 a 10, quão alta é a sua sensação frequente de paz de espírito?'
  ]
};

export const BAR_COLORS = Object.values(CATEGORY_METADATA).map(v => v.color);
