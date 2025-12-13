import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="ml-64 min-h-screen">
      <div className="p-8">
        {children}
      </div>
    </main>
  );
}

