
export interface Strategy {
  id: string;
  text: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  description: string;
  targetDate: string;
  strategies: Strategy[];
  completed: boolean;
}

export interface Reflection {
  date: string;
  whatWorked: string;
  whatDidnt: string;
  adjustments: string;
  type: 'prorrogacao' | 'ajuste' | 'conclusao';
}

export interface Goal {
  id: string;
  intention: string;       // O que eu quero alcançar
  successCriteria: string;  // Quando considero atingida
  dueDate: string;          // Até quando (Data Final)
  status: 'ativo' | 'reflexao_pendente' | 'concluido';
  
  milestones: Milestone[];
  reflections: Reflection[];
  
  completed: boolean;
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
