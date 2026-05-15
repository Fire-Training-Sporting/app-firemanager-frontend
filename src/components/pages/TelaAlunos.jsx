import { useState, useEffect } from "react";
import PageLayout from "../utils/PageLayout";
import { AlunosTable } from "../utils/Alunos/AlunosTable";
import ModalAluno from "../utils/Alunos/ModalAlunos";
import api from "../../provider/api";

export default function TelaAlunos() {
  const [showModal, setShowModal] = useState(false);
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    buscarAlunos();
  }, []);

    const buscarAlunos = async () => {
      try {
        const resp = await api.get('/usuarios');
        const usuarios = resp.data || [];
        const alunosFiltrados = usuarios
          .filter(u => u.tipoUsuario?.cargo === 'Aluno')
          .map(u => ({
            id: u.id,
            nome: u.nome,
            email: u.email,
            telefone: u.telefone,
            endereco: u.endereco || (u.condominio?.nome) || ''
          }));

        setAlunos(alunosFiltrados);
      } catch (err) {
        console.error('Erro ao buscar alunos:', err);
      }
    };

  const handleAdd = () => setShowModal(true);

  const handleSearch = () => {};

  return (
    <div className={showModal ? "modal-open" : ""}>
      <PageLayout
        title="Alunos"
        searchPlaceholder="Pesquisar aluno..."
        onSearch={handleSearch}
        onAdd={showModal ? () => setShowModal(false) : handleAdd}
        addLabel={showModal ? "Voltar" : "Cadastrar aluno"}
      >
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          {showModal ? (
            <ModalAluno isOpen={showModal} onClose={() => setShowModal(false)} />
          ) : (
            <AlunosTable alunos={alunos} />
          )}
        </div>
      </PageLayout>
    </div>
  );
}