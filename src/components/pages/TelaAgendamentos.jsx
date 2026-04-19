import PageLayout from '../utils/PageLayout';
import { AgendamentosTable } from '../utils/Agendamentos/AgendamentosTable';

export default function TelaAgendamentos() {
  const handleSearch = () => {};
  const handleAdd = () => {};

  return (
    <PageLayout
      title="Agendamentos"
      searchPlaceholder="Pesquisar agendamento..."
      onSearch={handleSearch}
      onAdd={handleAdd}
      addLabel="Agendar serviço"
    >
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <AgendamentosTable />
      </div>
    </PageLayout>
  );
}