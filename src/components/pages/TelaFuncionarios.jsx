import PageLayout from '../utils/PageLayout';
import FuncionariosTable from '../utils/Funcionarios/FuncionariosTable';

export default function TelaFuncionarios() {
  const handleSearch = () => {};
  const handleAdd = () => {};
  return (
    <PageLayout
      title="Funcionários"
      searchPlaceholder="Pesquisar funcionário"
      onSearch={handleSearch}
      onAdd={handleAdd}
      addLabel="Cadastrar funcionário"
    >
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <FuncionariosTable />
      </div>
    </PageLayout>
  );
}