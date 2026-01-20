
export interface Evidence {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  intention: string;       // Intenção de desenvolvimento (O que quer desenvolver)
  smartGoal: string;       // Definição SMART (Específica, Mensurável...)
  successIndicator: string; // Como saberá que funcionou
  dueDate: string;
  horizon: 'Curto' | 'Médio' | 'Longo';
  
  // Estrutura 70/20/10
  practiceEvidences: Evidence[];   // 70% - Aplicação real
  socialEvidences: Evidence[];     // 20% - Feedbacks/Trocas
  conceptualEvidences: Evidence[]; // 10% - Teoria/Cursos
  
  completed: boolean; // Status mestre da estratégia
}

export interface WheelData {
  category: string;
  score: number;
  currentScore?: number;
  goals: Goal[];
  icon?: string;
}

export interface PlanningState {
  image: string | null;
  data: WheelData[];
  isLoading: boolean;
  error: string | null;
}
