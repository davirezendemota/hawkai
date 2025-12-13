'use client';

import { useState, FormEvent } from 'react';
import { DemandPriority } from '../types/demand';

interface NewDemandInputProps {
  onDemandCreate: (data: {
    title: string;
    priority: DemandPriority;
    storyPoints?: number;
  }) => void;
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

export default function NewDemandInput({ onDemandCreate }: NewDemandInputProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<DemandPriority>('medium');
  const [storyPoints, setStoryPoints] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      // "?" representa incerteza, não passa valor numérico
      const hours =
        storyPoints && storyPoints !== '?'
          ? parseFloat(storyPoints)
          : undefined;

      onDemandCreate({
        title: trimmedTitle,
        priority,
        storyPoints: hours,
      });

      // Reset form
      setTitle('');
      setPriority('medium');
      setStoryPoints('');
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          {/* Input de título */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite uma nova demanda"
            className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
            required
          />

          {/* Select de prioridade */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as DemandPriority)}
            className="px-4 py-3 rounded-lg border border-[var(--border)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>

          {/* Select de horas */}
          <select
            value={storyPoints}
            onChange={(e) => setStoryPoints(e.target.value)}
            className="px-4 py-3 rounded-lg border border-[var(--border)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
            title="Horas estimadas"
          >
            <option value="">Horas</option>
            {HOURS_OPTIONS.map((hours) => (
              <option key={hours} value={hours.toString()}>
                {formatHours(hours)}
              </option>
            ))}
            <option value="?">? (incerto)</option>
          </select>

          {/* Botão de submit */}
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 transition-all"
          >
            Criar
          </button>
        </div>
      </form>
    </div>
  );
}
