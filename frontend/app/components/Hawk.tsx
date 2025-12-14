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
      <CardContent className="flex-1 flex gap-4 overflow-hidden items-center">
        {/* Foto do falcão à esquerda */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <img
              src="/hawk.png"
              alt="Hawk - Inteligência Artificial"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Balão de mensagem à direita */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="relative flex-1 bg-white rounded-lg p-3 min-h-[120px] overflow-y-auto">
            {/* Triângulo do balão apontando para a foto */}
            <div className="absolute left-0 top-6 -ml-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent"></div>
            
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center pl-2">
                <p className="text-sm text-[var(--text-secondary)] text-center">
                  Hawk está observando suas pendências...
                </p>
              </div>
            ) : (
              <div className="space-y-2 pl-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="text-sm text-[var(--text-primary)] leading-relaxed"
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
