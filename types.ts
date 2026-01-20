
export interface Evidence {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  intention: string;       // O quê? (Intenção/Habilidade)
  why: string;             // Por quê? (Sentido/Importância)
  smartGoal: string;       // Como? (O plano de ação geral)
  withWhom: string;        // Com quem? (Apoio/Envolvidos)
  successIndicator: string; // Como saberei que funcionou?
  dueDate: string;         // Quando? (Data)
  horizon: 'Curto' | 'Médio' | 'Longo'; // Quando? (Horizonte)
  
  // Estrutura 10/20/70
  conceptualEvidences: Evidence[]; // 10% - Teoria/Cursos
  socialEvidences: Evidence[];     // 20% - Feedbacks/Trocas
  practiceEvidences: Evidence[];   // 70% - Aplicação real
  
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
