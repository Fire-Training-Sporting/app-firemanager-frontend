import { useState } from 'react';
import PageLayout from '../PageLayout';
import TableBase from '../TableBase';
import { BtnBlue } from '../Buttons/BtnBlue';
import { BtnRed } from '../Buttons/BtnRed';

export default function ServicoLista() {
  const servicosIniciais = [
    { id: 1, nome: 'Tênis' },
    { id: 2, nome: 'Beach Tennis' },
    { id: 3, nome: 'Personal Trainer' },
  ];

  const [servicos, setServicos] = useState(servicosIniciais);
  const [busca, setBusca] = useState('');

  const servicosFiltrados = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const manipularBusca = (evento) => {
    setBusca(evento.target.value);
  };

  const colunas = [
    {
      key: 'nome',
      label: 'Serviço',
      className: 'text-left',
    },
    {
      key: 'acoes',
      label: 'Ações',
      className: 'flex justify-end mr-14',
      render: (servico) => (
        <div className="w-full flex justify-end items-center gap-2">
          <BtnBlue content="Editar" />
          <BtnRed content="Excluir" />
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Serviços"
      searchPlaceholder="Pesquisar nome do serviço"
      onSearch={manipularBusca}
      addLabel="Cadastrar Serviço"
    >
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <TableBase columns={colunas} data={servicosFiltrados} />
      </div>
    </PageLayout>
  );
}