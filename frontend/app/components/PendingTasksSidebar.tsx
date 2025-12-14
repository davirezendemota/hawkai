'use client';

import { Demand, DemandPriority } from '../types/demand';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface PendingTasksSidebarProps {
  tasks: Demand[];
  onTaskClick?: (task: Demand) => void;
  onDemandUpdate?: (taskId: string, updates: Partial<Demand>) => void;
  onDemandDelete?: (taskId: string) => void;
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

// Função para determinar a cor baseada no rank de impacto (apenas primeira e segunda demanda)
// Retorna 'bg-white' se todas as demandas tiverem o mesmo impacto
const getImpactColor = (
  rank: number | undefined, 
  impactPercentage: number | undefined,
  allSameImpact: boolean
) => {
  if (!impactPercentage || impactPercentage === 0) {
    return 'bg-white'; // Sem impacto definido
  }
  
  // Se todas têm o mesmo impacto, não aplicar cores
  if (allSameImpact) {
    return 'bg-white';
  }
  
  if (rank === undefined) {
    return 'bg-white'; // Sem cor se rank não definido
  }
  
  if (rank === 0) {
    // Primeira demanda: verde mais intenso
    return 'bg-[#1A8917]';
  } else if (rank === 1) {
    // Segunda demanda: verde mais escuro
    return 'bg-[#2d5a2b]';
  } else {
    // Resto: sem cor destacada
    return 'bg-white';
  }
};

export default function PendingTasksSidebar({
  tasks,
  onTaskClick,
  onDemandUpdate,
  onDemandDelete,
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
  
  // Verificar se todas as demandas têm o mesmo percentual de impacto
  const tasksWithImpact = sortedTasks.filter(
    (t) => t.impactPercentage !== undefined && t.impactPercentage > 0
  );
  const allSameImpact = tasksWithImpact.length > 0 && 
    tasksWithImpact.every(
      (t) => Math.abs((t.impactPercentage || 0) - (tasksWithImpact[0]?.impactPercentage || 0)) < 0.01
    );
  
  // Criar mapa de rank por ID
  const impactRankMap = new Map<string, number>();
  sortedTasks.forEach((task, index) => {
    if (task.impactPercentage && task.impactPercentage > 0) {
      impactRankMap.set(task.id, index);
    }
  });
  
  const pendingTasks = sortedTasks;

  return (
    <div className="fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-[var(--border)] flex flex-col">
      <div className="p-4 border-b border-[var(--border)] flex-shrink-0">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wide">
          Lista de Pendências
        </h2>
      </div>
      <div className="p-4 space-y-2 overflow-y-auto flex-1">
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] text-center py-8">
            Nenhuma pendência
          </p>
        ) : (
          pendingTasks.map((task) => {
            const impactRank = impactRankMap.get(task.id);
            const bgColor = getImpactColor(impactRank, task.impactPercentage, allSameImpact);
            const textColor = !allSameImpact && (impactRank === 0 || impactRank === 1) && task.impactPercentage && task.impactPercentage > 0 
              ? 'text-white' 
              : 'text-[var(--text-primary)]';
            
            return (
            <Card
              key={task.id}
              className={`p-3 ${bgColor} hover:opacity-90 transition-all ${textColor} border-[var(--border)] relative`}
            >
              <CardContent className="p-0">
                {/* Título no canto superior esquerdo e porcentagem/checkbox no canto superior direito */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  {/* Título no canto superior esquerdo */}
                  <p
                    className={`text-sm ${textColor} cursor-pointer flex-1 min-w-0`}
                    onClick={() => onTaskClick?.(task)}
                  >
                    {task.title}
                  </p>
                  {/* Porcentagem de impacto e checkbox lado a lado */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Porcentagem de impacto */}
                    <span className={`text-xs font-medium ${textColor}`}>
                      {task.impactPercentage !== undefined
                        ? `${task.impactPercentage.toFixed(1)}%`
                        : '-'}
                    </span>
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => onDemandDelete?.(task.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer accent-[var(--text-primary)]"
                      aria-label="Marcar como concluída"
                    />
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {/* Select de Prioridade */}
                  <Select
                    value={task.priority}
                    onValueChange={(value) => {
                      onDemandUpdate?.(task.id, {
                        priority: value as DemandPriority,
                      });
                    }}
                  >
                    <SelectTrigger
                      className={`flex-1 h-6 text-xs ${
                        task.impactPercentage && task.impactPercentage > 0
                          ? 'bg-white/90 text-[var(--text-primary)]'
                          : 'bg-white text-[var(--text-primary)]'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Select de Horas */}
                  <Select
                    value={task.storyPoints?.toString() || undefined}
                    onValueChange={(value) => {
                      onDemandUpdate?.(task.id, {
                        storyPoints:
                          value && value !== '?' ? parseFloat(value) : undefined,
                      });
                    }}
                  >
                    <SelectTrigger
                      className={`flex-1 h-6 text-xs ${
                        task.impactPercentage && task.impactPercentage > 0
                          ? 'bg-white/90 text-[var(--text-primary)]'
                          : 'bg-white text-[var(--text-primary)]'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue placeholder="Horas" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {HOURS_OPTIONS.map((hours) => (
                        <SelectItem key={hours} value={hours.toString()}>
                          {formatHours(hours)}
                        </SelectItem>
                      ))}
                      <SelectItem value="?">?</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
