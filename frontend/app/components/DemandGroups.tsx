'use client';

import { DemandGroup } from '../types/demand';

interface DemandGroupsProps {
  groups: DemandGroup[];
  onGroupClick?: (group: DemandGroup) => void;
  onDemandClick?: (demandId: string, groupId: string) => void;
}

export default function DemandGroups({
  groups,
  onGroupClick,
  onDemandClick,
}: DemandGroupsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
        Agrupador de Pendências
      </h3>
      {groups.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)] text-center py-4">
          Nenhum grupo criado
        </p>
      ) : (
        groups.map((group) => (
          <div
            key={group.id}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-[var(--border)] hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onGroupClick?.(group)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                {group.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">{group.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {group.demands.length} demanda{group.demands.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
