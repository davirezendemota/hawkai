'use client';

import { useState, FormEvent } from 'react';
import { DemandPriority } from '../types/demand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite uma nova demanda"
            className="flex-1"
            required
          />

          {/* Select de prioridade */}
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as DemandPriority)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>

          {/* Select de horas */}
          <Select
            value={storyPoints || undefined}
            onValueChange={(value) => setStoryPoints(value)}
          >
            <SelectTrigger className="w-[140px]" title="Horas estimadas">
              <SelectValue placeholder="Horas" />
            </SelectTrigger>
            <SelectContent>
              {HOURS_OPTIONS.map((hours) => (
                <SelectItem key={hours} value={hours.toString()}>
                  {formatHours(hours)}
                </SelectItem>
              ))}
              <SelectItem value="?">? (incerto)</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão de submit */}
          <Button type="submit">
            Criar
          </Button>
        </div>
      </form>
    </div>
  );
}
