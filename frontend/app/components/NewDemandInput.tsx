'use client';

import { useState, FormEvent } from 'react';

interface NewDemandInputProps {
  onDemandCreate: (title: string) => void;
}

export default function NewDemandInput({ onDemandCreate }: NewDemandInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onDemandCreate(trimmedValue);
      setInputValue('');
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite uma nova demanda e pressione Enter"
          className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
        />
      </form>
    </div>
  );
}
