'use client';

import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import MainContent from '../../components/MainContent';

export default function ExampleDetailPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <Sidebar />
      <MainContent>
        <div className="max-w-4xl">
          <button
            onClick={() => router.back()}
            className="mb-4 text-[var(--accent)] hover:underline"
          >
            ← Voltar
          </button>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--border)]">
            <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">
              Exemplo {params.id}
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-6">
              Esta é uma página de exemplo com ID dinâmico. Adicione seu conteúdo aqui.
            </p>
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <p>
                <strong>ID:</strong> {params.id}
              </p>
            </div>
          </div>
        </div>
      </MainContent>
    </>
  );
}

