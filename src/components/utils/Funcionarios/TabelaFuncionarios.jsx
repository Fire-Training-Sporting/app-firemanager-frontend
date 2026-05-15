import TableBase from '../TableBase';

export default function TabelaFuncionarios({ funcionarios = [], onEdit = () => {}, onDelete = () => {} }) {
  const columns = [
    { label: 'ID', key: 'id', className: 'w-12 text-left' },
    { label: 'Nome', key: 'nome', className: 'text-left' },
    { label: 'Email', key: 'email', className: 'text-left' },
    { label: 'Telefone', key: 'telefone', className: 'text-left' },
    { label: 'Tipo', key: 'tipoUsuario', className: 'text-left', render: (row) => (row.tipoUsuario?.cargo || row.perfil || '') },
    {
      label: 'Ações',
      key: 'acoes',
      className: 'text-center w-40',
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button onClick={() => onEdit(row)} className="px-4 py-2 bg-[#2563EA] text-white text-xs font-medium rounded-md hover:bg-[#1E40AF] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">Editar</button>
          <button onClick={() => onDelete(row.id)} className="px-4 py-2 bg-[#DC2625] text-white text-xs font-medium rounded-md hover:bg-[#B91C1C] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">Excluir</button>
        </div>
      ),
    },
  ];

  return <TableBase columns={columns} data={funcionarios} />;
}
