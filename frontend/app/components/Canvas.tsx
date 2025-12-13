'use client';

import { Demand } from '../types/demand';

interface CanvasProps {
  demands: Demand[];
  onDemandClick?: (demand: Demand) => void;
}

export default function Canvas({ demands, onDemandClick }: CanvasProps) {
  const activeDemands = demands.filter((d) => d.status === 'in_progress' && !d.groupId);

  return (
    <div className="flex-1 bg-gray-50 rounded-lg border border-[var(--border)] p-6 min-h-[300px] mb-4 flex flex-col">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 uppercase tracking-wide">
        Canvas
      </h3>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {activeDemands.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] text-center py-12">
            Nenhuma demanda ativa no canvas
          </p>
        ) : (
          activeDemands.map((demand) => (
            <div
              key={demand.id}
              onClick={() => onDemandClick?.(demand)}
              className="p-4 bg-white rounded-lg border border-[var(--border)] hover:shadow-md transition-shadow cursor-pointer"
            >
              <p className="text-sm text-[var(--text-primary)]">{demand.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
