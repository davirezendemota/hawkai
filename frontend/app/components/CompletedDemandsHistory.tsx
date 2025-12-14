'use client';

import { Demand } from '../types/demand';
import { Card, CardContent } from '@/components/ui/card';

interface CompletedDemandsHistoryProps {
  completedDemands: Demand[];
  onDemandClick?: (demand: Demand) => void;
}

export default function CompletedDemandsHistory({
  completedDemands,
  onDemandClick,
}: CompletedDemandsHistoryProps) {
  // Ordenar por data de conclusão (mais recentes primeiro)
  const sortedDemands = [...completedDemands].sort((a, b) => {
    const aDate = a.completedAt?.getTime() || 0;
    const bDate = b.completedAt?.getTime() || 0;
    return bDate - aDate;
  });

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
        Histórico de Demandas Concluídas
      </h3>
      {sortedDemands.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)] text-center py-4">
          Nenhuma demanda concluída
        </p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {sortedDemands.map((demand) => (
            <Card
              key={demand.id}
              className="p-3 hover:shadow-md transition-shadow cursor-pointer border-[var(--border)] bg-gray-50"
              onClick={() => onDemandClick?.(demand)}
            >
              <CardContent className="p-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] line-through mb-1">
                      {demand.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <span className="capitalize">{demand.priority}</span>
                      {demand.storyPoints && (
                        <>
                          <span>•</span>
                          <span>{demand.storyPoints.toString().replace('.', ',')}h</span>
                        </>
                      )}
                      {demand.completedAt && (
                        <>
                          <span>•</span>
                          <span>{formatDate(demand.completedAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
