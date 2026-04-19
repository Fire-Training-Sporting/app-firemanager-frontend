import PageLayout from '../utils/PageLayout';
import { CondominiosTable } from '../utils/Condominios/CondominiosTable.jsx';

export default function TelaCondominios() {
  const handleSearch = () => {};
  const handleAdd = () => {};

  return (
    <PageLayout
      title="Condomínios"
      searchPlaceholder="Pesquisar condomínio..."
      onSearch={handleSearch}
      onAdd={handleAdd}
      addLabel="Cadastrar condomínio"
    >
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <CondominiosTable />
      </div>
    </PageLayout>
  );
}
