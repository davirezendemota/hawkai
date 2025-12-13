'use client';

import { Demand, DemandPriority } from '../types/demand';
import { Input } from '@/components/ui/input';
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
  
  if (rank === undefined) {
    return 'bg-[#4a9e47]'; // Verde normal se rank não definido
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
            <Card
              key={task.id}
              className={`p-3 ${bgColor} hover:opacity-90 transition-all ${textColor} border-[var(--border)]`}
            >
              <CardContent className="p-0">
                <p
                  className={`text-sm ${textColor} mb-2 cursor-pointer`}
                  onClick={() => onTaskClick?.(task)}
                >
                  {task.title}
                </p>
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
                      className={`flex-1 h-8 text-xs ${
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
                      className={`flex-1 h-8 text-xs ${
                        task.impactPercentage && task.impactPercentage > 0
                          ? 'bg-white/90 text-[var(--text-primary)]'
                          : 'bg-white text-[var(--text-primary)]'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue placeholder="Horas" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS_OPTIONS.map((hours) => (
                        <SelectItem key={hours} value={hours.toString()}>
                          {formatHours(hours)}
                        </SelectItem>
                      ))}
                      <SelectItem value="?">?</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Input de Impacto */}
                  <Input
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
                    className={`flex-1 h-8 text-xs ${
                      task.impactPercentage && task.impactPercentage > 0
                        ? 'bg-white/90 text-[var(--text-primary)]'
                        : 'bg-white text-[var(--text-primary)]'
                    }`}
                  />
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
