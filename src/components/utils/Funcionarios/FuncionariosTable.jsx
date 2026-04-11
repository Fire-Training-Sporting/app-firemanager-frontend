import TableBase from '../TableBase';

const funcionarios = [
  { id: 1, nome: 'João Silva', email: 'joao.silva@email.com', telefone: '(11) 99999-1234', tipo: 'Administrativo' },
  { id: 2, nome: 'Maria Santos', email: 'maria.santos@email.com', telefone: '(21) 98888-5678', tipo: 'Quadra' },
  { id: 3, nome: 'Carlos Souza', email: 'carlos.souza@email.com', telefone: '(31) 97777-9012', tipo: 'Admin' },
  { id: 4, nome: 'Ana Costa', email: 'ana.costa@email.com', telefone: '(11) 91234-5678', tipo: 'Administrativo' },
  { id: 5, nome: 'Fernanda Lima', email: 'fernanda.lima@email.com', telefone: '(21) 93456-7890', tipo: 'Quadra' },
  { id: 6, nome: 'Lucas Pereira', email: 'lucas.pereira@email.com', telefone: '(31) 94567-8901', tipo: 'Admin' },
  { id: 7, nome: 'Juliana Alves', email: 'juliana.alves@email.com', telefone: '(11) 95678-9012', tipo: 'Administrativo' },
  { id: 8, nome: 'Paulo Henrique', email: 'paulo.henrique@email.com', telefone: '(21) 96789-0123', tipo: 'Quadra' },
  { id: 9, nome: 'Mariana Rocha', email: 'mariana.rocha@email.com', telefone: '(31) 97890-1234', tipo: 'Admin' },
  { id: 10, nome: 'Rafael Costa', email: 'rafael.costa@email.com', telefone: '(11) 98901-2345', tipo: 'Administrativo' },
];

const columns = [
  { label: 'ID', key: 'id', className: 'w-12 text-left' },
  { label: 'Nome', key: 'nome', className: 'text-left' },
  { label: 'Email', key: 'email', className: 'text-left' },
  { label: 'Telefone', key: 'telefone', className: 'text-left' },
  { label: 'Tipo', key: 'tipo', className: 'text-left' },
  {
    label: 'Ações',
    key: 'acoes',
    className: 'text-center w-40',
    render: (row) => (
      <div className="flex justify-center gap-2">
        <button className="px-4 py-2 bg-[#2563EA] text-white text-xs font-medium rounded-md hover:bg-[#1E40AF] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">Editar</button>
        <button className="px-4 py-2 bg-[#DC2625] text-white text-xs font-medium rounded-md hover:bg-[#B91C1C] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer">Excluir</button>
      </div>
    ),
  },
];

export default function FuncionariosTable() {
  return <TableBase columns={columns} data={funcionarios} />;
}
