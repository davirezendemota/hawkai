export type DemandPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Demand {
  id: string;
  title: string;
  priority: DemandPriority;
  createdAt: Date;
  groupId?: string;
  impactPercentage?: number; // Porcentagem de impacto da demanda no dia (0-100)
  storyPoints?: number; // Horas estimadas (0.5, 1, 1.5, 2, 2.5, etc.)
}

export interface DemandGroup {
  id: string;
  name: string;
  demands: Demand[];
}
