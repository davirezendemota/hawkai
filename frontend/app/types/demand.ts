export type DemandStatus = 'pending' | 'in_progress' | 'completed';

export interface Demand {
  id: string;
  title: string;
  status: DemandStatus;
  createdAt: Date;
  groupId?: string;
}

export interface DemandGroup {
  id: string;
  name: string;
  demands: Demand[];
}
