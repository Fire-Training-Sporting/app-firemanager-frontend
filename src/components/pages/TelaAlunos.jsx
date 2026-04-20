import PageLayout from '../utils/PageLayout';
import { AlunosTable } from '../utils/Alunos/AlunosTable';

export default function Alunos() {
    // Funções de pesquisa e cadastro podem ser implementadas conforme necessário
    const handleSearch = () => {};
    const handleAdd = () => {};
    return (
        <PageLayout
            title="Alunos"
            searchPlaceholder="Pesquisar aluno..."
            onSearch={handleSearch}
            onAdd={handleAdd}
            addLabel="Cadastrar aluno"
        >
            <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <AlunosTable />
            </div>
        </PageLayout>
    );
}