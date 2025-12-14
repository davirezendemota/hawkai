'use client';

import { useEffect, useState, useRef } from 'react';

export default function DailyTimeline() {
  // Inicializar como null para evitar erro de hidratação
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hourHeight, setHourHeight] = useState(60);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Marcar como montado e definir o tempo inicial apenas no cliente
    setIsMounted(true);
    setCurrentTime(new Date());
    
    // Update every second for smooth animation
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calcular altura de cada hora baseado na altura disponível
  useEffect(() => {
    const updateHourHeight = () => {
      if (timelineRef.current) {
        const appHeaderHeight = 64; // Altura do header do app (h-16 = 64px)
        const timelineHeaderHeight = 64; // Altura do header da timeline (p-4 + border-b)
        const padding = 32; // Padding top e bottom (p-4 = 16px cada)
        const availableHeight = window.innerHeight - appHeaderHeight - timelineHeaderHeight - padding;
        const calculatedHeight = availableHeight / 24;
        setHourHeight(Math.max(calculatedHeight, 20)); // Mínimo de 20px por hora
      }
    };

    updateHourHeight();
    window.addEventListener('resize', updateHourHeight);
    return () => window.removeEventListener('resize', updateHourHeight);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Usar valores padrão até que o componente esteja montado no cliente
  const currentHour = currentTime?.getHours() ?? 0;
  const currentMinute = currentTime?.getMinutes() ?? 0;
  const currentSecond = currentTime?.getSeconds() ?? 0;
  // Calculate position based on total seconds in the day
  const totalSecondsInDay = 24 * 60 * 60;
  const currentSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;
  const currentPosition = (currentSeconds / totalSecondsInDay) * 100;

  return (
    <div className="w-[332px] bg-white border-l border-[var(--border)] h-screen flex flex-col fixed right-0 top-16">
      <div className="p-4 border-b border-[var(--border)] flex-shrink-0">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wide">
          Timeline do Dia
        </h2>
      </div>
      <div className="relative p-4 flex-1 overflow-hidden" ref={timelineRef}>
        <div className="relative h-full">
          {/* Hour blocks */}
          <div className="space-y-0 h-full flex flex-col">
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex items-start border-b border-[var(--border)] last:border-b-0 flex-shrink-0"
                style={{ height: `${hourHeight}px` }}
              >
                <div className="w-16 text-xs text-[var(--text-secondary)] font-mono flex-shrink-0 pt-1">
                  {String(hour).padStart(2, '0')}:00
                </div>
                <div className="flex-1 h-full border-l border-[var(--border)]"></div>
              </div>
            ))}
          </div>

          {/* Current time indicator - só renderiza após montagem no cliente */}
          {isMounted && (
            <div
              className="absolute left-0 right-0 pointer-events-none z-10"
              style={{
                top: `${currentPosition}%`,
                transition: 'top 0.3s ease-out',
              }}
            >
              <div className="flex items-center">
                <div className="w-16 text-xs text-red-600 font-mono font-semibold flex-shrink-0 bg-white px-1">
                  {String(currentHour).padStart(2, '0')}:
                  {String(currentMinute).padStart(2, '0')}
                </div>
                <div className="flex-1 relative">
                  <div className="absolute left-0 right-0 h-0.5 bg-red-600"></div>
                  <div className="absolute left-0 w-3 h-3 bg-red-600 rounded-full -translate-x-1.5 -translate-y-1.5 border-2 border-white"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
