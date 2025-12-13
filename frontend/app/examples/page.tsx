import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';

export default function ExamplesPage() {
  return (
    <>
      <Sidebar />
      <MainContent>
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-[var(--text-primary)]">
            Exemplos
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-[var(--border)]">
            <p className="text-[var(--text-secondary)]">
              Esta é uma página de exemplo. Adicione seu conteúdo aqui.
            </p>
          </div>
        </div>
      </MainContent>
    </>
  );
}

