'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HawkProps {
  messages?: string[];
}

export default function Hawk({ messages = [] }: HawkProps) {
  return (
    <Card className="h-[300px] mb-4 flex flex-col w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Hawk
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden items-center justify-between pb-4">
        {/* Foto do falcão centralizada */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src="/hawk.png"
              alt="Hawk - Inteligência Artificial"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Balão de mensagem abaixo do hawk */}
        <div className="flex-shrink-0 w-full mb-6">
          <div className="relative bg-white rounded-lg p-3 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-lg text-[var(--text-secondary)] text-center">
                  Hawk está observando suas pendências...
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="text-lg text-[var(--text-primary)] leading-relaxed"
                  >
                    {message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
