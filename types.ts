
export interface Goal {
  id: string;
  description: string;
  measurable: string; // Como medir o sucesso
  dueDate: string;    // Data limite
  completed: boolean; // Status de conclusão
}

export interface WheelData {
  category: string;
  score: number; // Nota base da IA
  currentScore?: number; // Nota evoluída baseada nas metas
  goals: Goal[];
  icon?: string;
}

export interface PlanningState {
  image: string | null;
  data: WheelData[];
  isLoading: boolean;
  error: string | null;
}
