'use client';

import { useState, useCallback } from 'react';
import { Demand, DemandGroup, DemandPriority } from '../types/demand';
import PendingTasksSidebar from './PendingTasksSidebar';
import NewDemandInput from './NewDemandInput';
import Canvas from './Canvas';
import DemandGroups from './DemandGroups';
import DailyTimeline from './DailyTimeline';

export default function Dashboard() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [groups, setGroups] = useState<DemandGroup[]>([]);

  const handleDemandCreate = useCallback(
    (data: { title: string; priority: DemandPriority; storyPoints?: number }) => {
      const newDemand: Demand = {
        id: `demand-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        title: data.title,
        priority: data.priority,
        createdAt: new Date(),
        impactPercentage: undefined,
        storyPoints: data.storyPoints,
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


  const handleDemandClick = useCallback((demand: Demand) => {
    // Future: Handle demand click in canvas
    console.log('Demand clicked:', demand);
  }, []);

  const handleGroupClick = useCallback((group: DemandGroup) => {
    // Future: Handle group click
    console.log('Group clicked:', group);
  }, []);

  return (
    <div className="flex h-screen pt-16">
      {/* Left Column - Pending Tasks */}
      <PendingTasksSidebar
        tasks={demands}
        onTaskClick={handleTaskClick}
        onDemandUpdate={handleDemandUpdate}
      />

      {/* Center Column - Main Workspace */}
      <main className="flex-1 ml-80 mr-64 overflow-y-auto">
        <div className="p-6 h-full flex flex-col">
          {/* Demand Input */}
          <NewDemandInput onDemandCreate={handleDemandCreate} />

          {/* Canvas */}
          <Canvas demands={demands} onDemandClick={handleDemandClick} />

          {/* Demand Groups */}
          <DemandGroups
            groups={groups}
            onGroupClick={handleGroupClick}
          />
        </div>
      </main>

      {/* Right Column - Daily Timeline */}
      <DailyTimeline />
    </div>
  );
}
