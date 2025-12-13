'use client';

import { Demand, DemandStatus } from '../types/demand';

interface PendingTasksSidebarProps {
  tasks: Demand[];
  onTaskClick?: (task: Demand) => void;
  onStatusChange?: (taskId: string, status: DemandStatus) => void;
}

export default function PendingTasksSidebar({
  tasks,
  onTaskClick,
  onStatusChange,
}: PendingTasksSidebarProps) {
  const pendingTasks = tasks.filter((task) => task.status === 'pending' || task.status === 'in_progress');

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-[var(--border)] overflow-y-auto">
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
          pendingTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onTaskClick?.(task)}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-[var(--text-primary)] flex-1">{task.title}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newStatus: DemandStatus =
                      task.status === 'pending' ? 'in_progress' : 'pending';
                    onStatusChange?.(task.id, newStatus);
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    task.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {task.status === 'in_progress' ? 'Em progresso' : 'Pendente'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
