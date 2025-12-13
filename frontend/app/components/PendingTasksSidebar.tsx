'use client';

import { Demand, DemandPriority } from '../types/demand';

interface PendingTasksSidebarProps {
  tasks: Demand[];
  onTaskClick?: (task: Demand) => void;
  onDemandUpdate?: (taskId: string, updates: Partial<Demand>) => void;
}

// Opções de horas: 0.5, 1, 1.5, 2, 2.5, ... até 24 horas
const MAX_HOURS = 24;
const HOURS_OPTIONS: number[] = [];
for (let i = 0.5; i <= MAX_HOURS; i += 0.5) {
  HOURS_OPTIONS.push(i);
}

// Função para formatar horas
const formatHours = (hours: number): string => {
  return `${hours.toString().replace('.', ',')}h`;
};

// Função para determinar a cor baseada no rank de impacto
const getImpactColor = (rank: number | undefined, impactPercentage: number | undefined) => {
  if (!impactPercentage || impactPercentage === 0) {
    return 'bg-white'; // Sem impacto definido
  }
  
  if (rank === 0) {
    // Maior impacto: verde mais intenso
    return 'bg-[#1A8917]';
  } else if (rank >= 1 && rank <= 3) {
    // Top 3: verde mais escuro
    return 'bg-[#2d5a2b]';
  } else {
    // Resto: verde normal
    return 'bg-[#4a9e47]';
  }
};

export default function PendingTasksSidebar({
  tasks,
  onTaskClick,
  onDemandUpdate,
}: PendingTasksSidebarProps) {
  // Ordenar tarefas por impacto (maior primeiro, depois as sem impacto)
  const sortedTasks = [...tasks].sort((a, b) => {
    const aImpact = a.impactPercentage || 0;
    const bImpact = b.impactPercentage || 0;
    // Primeiro ordena por impacto (maior primeiro)
    if (bImpact !== aImpact) {
      return bImpact - aImpact;
    }
    // Se impacto igual, mantém ordem original
    return 0;
  });
  
  // Criar mapa de rank por ID
  const impactRankMap = new Map<string, number>();
  sortedTasks.forEach((task, index) => {
    if (task.impactPercentage && task.impactPercentage > 0) {
      impactRankMap.set(task.id, index);
    }
  });
  
  const pendingTasks = sortedTasks;

  return (
    <div className="fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-[var(--border)] overflow-y-auto">
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wide">
          Lista de Pendências
        </h2>
      </div>
      <div className="p-4 space-y-2">
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] text-center py-8">
            Nenhuma pendência
          </p>
        ) : (
          pendingTasks.map((task) => {
            const impactRank = impactRankMap.get(task.id);
            const bgColor = getImpactColor(impactRank, task.impactPercentage);
            const textColor = task.impactPercentage && task.impactPercentage > 0 
              ? 'text-white' 
              : 'text-[var(--text-primary)]';
            
            return (
            <div
              key={task.id}
              className={`p-3 rounded-lg border border-[var(--border)] ${bgColor} hover:opacity-90 transition-all ${textColor}`}
            >
              <p
                className={`text-sm ${textColor} mb-2 cursor-pointer`}
                onClick={() => onTaskClick?.(task)}
              >
                {task.title}
              </p>
              <div className="flex gap-1.5">
                {/* Select de Prioridade */}
                <select
                  value={task.priority}
                  onChange={(e) => {
                    onDemandUpdate?.(task.id, {
                      priority: e.target.value as DemandPriority,
                    });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`flex-1 px-2 py-1.5 text-xs rounded border border-[var(--border)] ${
                    task.impactPercentage && task.impactPercentage > 0
                      ? 'bg-white/90 text-[var(--text-primary)]'
                      : 'bg-white text-[var(--text-primary)]'
                  } focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-transparent transition-all`}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>

                {/* Select de Horas */}
                <select
                  value={task.storyPoints?.toString() || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    onDemandUpdate?.(task.id, {
                      storyPoints:
                        value && value !== '?' ? parseFloat(value) : undefined,
                    });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`flex-1 px-2 py-1.5 text-xs rounded border border-[var(--border)] ${
                    task.impactPercentage && task.impactPercentage > 0
                      ? 'bg-white/90 text-[var(--text-primary)]'
                      : 'bg-white text-[var(--text-primary)]'
                  } focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-transparent transition-all`}
                >
                  <option value="">Horas</option>
                  {HOURS_OPTIONS.map((hours) => (
                    <option key={hours} value={hours.toString()}>
                      {formatHours(hours)}
                    </option>
                  ))}
                  <option value="?">?</option>
                </select>

                {/* Input de Impacto */}
                <input
                  type="number"
                  value={task.impactPercentage?.toString() || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    onDemandUpdate?.(task.id, {
                      impactPercentage: value ? parseFloat(value) : undefined,
                    });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Impacto %"
                  min="0"
                  max="100"
                  step="0.1"
                  className={`flex-1 px-2 py-1.5 text-xs rounded border border-[var(--border)] ${
                    task.impactPercentage && task.impactPercentage > 0
                      ? 'bg-white/90 text-[var(--text-primary)]'
                      : 'bg-white text-[var(--text-primary)]'
                  } placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-transparent transition-all`}
                />
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
