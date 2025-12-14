'use client';

import { useState, useCallback, useMemo } from 'react';
import { Demand, DemandPriority } from '../types/demand';
import PendingTasksSidebar from './PendingTasksSidebar';
import NewDemandInput from './NewDemandInput';
import Canvas from './Canvas';
import CompletedDemandsHistory from './CompletedDemandsHistory';
import DailyTimeline from './DailyTimeline';
import Hawk from './Hawk';
import { calculateImpactPercentages } from '../utils/impactCalculator';

export default function Dashboard() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [completedDemands, setCompletedDemands] = useState<Demand[]>([]);

  // Calcular impactos automaticamente sempre que as demandas mudarem
  const demandsWithImpact = useMemo(() => {
    const impactMap = calculateImpactPercentages(demands);
    return demands.map((demand) => ({
      ...demand,
      impactPercentage: impactMap.get(demand.id),
    }));
  }, [demands]);

  const handleDemandCreate = useCallback(
    (data: { title: string; priority: DemandPriority; storyPoints?: number }) => {
      const newDemand: Demand = {
        id: `demand-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        title: data.title,
        priority: data.priority,
        createdAt: new Date(),
        storyPoints: data.storyPoints,
        // impactPercentage será calculado automaticamente pelo useMemo
      };
      setDemands((prev) => [...prev, newDemand]);
    },
    []
  );

  const handleTaskClick = useCallback((task: Demand) => {
    // Future: Handle task click (e.g., open details, move to canvas)
    console.log('Task clicked:', task);
  }, []);

  const handleDemandUpdate = useCallback(
    (taskId: string, updates: Partial<Demand>) => {
      setDemands((prev) =>
        prev.map((demand) =>
          demand.id === taskId ? { ...demand, ...updates } : demand
        )
      );
    },
    []
  );

  const handleDemandDelete = useCallback(
    (taskId: string) => {
      setDemands((prev) => {
        const demandToComplete = prev.find((d) => d.id === taskId);
        if (demandToComplete) {
          // Verificar se já não existe no histórico antes de adicionar
          setCompletedDemands((completed) => {
            const alreadyExists = completed.some((d) => d.id === taskId);
            if (alreadyExists) {
              return completed; // Já existe, não adicionar novamente
            }
            return [...completed, { ...demandToComplete, completedAt: new Date() }];
          });
        }
        return prev.filter((demand) => demand.id !== taskId);
      });
    },
    []
  );


  const handleDemandClick = useCallback((demand: Demand) => {
    // Future: Handle demand click in canvas
    console.log('Demand clicked:', demand);
  }, []);

  const handleCompletedDemandClick = useCallback((demand: Demand) => {
    // Future: Handle completed demand click
    console.log('Completed demand clicked:', demand);
  }, []);

  return (
    <div className="flex h-screen pt-16">
      {/* Left Column - Pending Tasks */}
      <PendingTasksSidebar
        tasks={demandsWithImpact}
        onTaskClick={handleTaskClick}
        onDemandUpdate={handleDemandUpdate}
        onDemandDelete={handleDemandDelete}
      />

      {/* Center Column - Main Workspace */}
      <main className="flex-1 ml-80 mr-[332px] overflow-y-auto">
        <div className="p-8 px-12 h-full flex flex-col">
          {/* Demand Input */}
          <NewDemandInput onDemandCreate={handleDemandCreate} />

          {/* Hawk e Canvas em grid de 2 colunas */}
          <div className="grid grid-cols-2 gap-4">
            {/* Hawk - Inteligência Artificial */}
            <Hawk messages={[]} />

            {/* Canvas */}
            <Canvas demands={demandsWithImpact} onDemandClick={handleDemandClick} />
          </div>

          {/* Histórico de Demandas Concluídas */}
          <CompletedDemandsHistory
            completedDemands={completedDemands}
            onDemandClick={handleCompletedDemandClick}
          />
        </div>
      </main>

      {/* Right Column - Daily Timeline */}
      <DailyTimeline />
    </div>
  );
}
