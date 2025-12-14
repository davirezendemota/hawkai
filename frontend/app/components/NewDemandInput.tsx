'use client';

import { useState, FormEvent } from 'react';
import { DemandPriority } from '../types/demand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface NewDemandInputProps {
  onDemandCreate: (data: {
    title: string;
    priority: DemandPriority;
    storyPoints?: number;
  }) => void;
}


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
        <div className="relative">
          {/* Input de título */}
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite uma nova demanda"
            className="flex-1 pr-12 h-12 text-base"
            required
          />

          {/* Botão de submit dentro do input */}
          <Button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            size="icon"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
