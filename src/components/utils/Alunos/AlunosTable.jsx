import { AlunosRow } from './AlunosRow'
import AlunosTh from './AlunoTh'

const alunos = [
  { id: 1, nome: "Maria Silva", email: "maria.silva@email.com", telefone: "(11) 99999-1234", endereco: "Rua A, 123, São Paulo - SP" },
  { id: 2, nome: "João Santos", email: "joao.santos@email.com", telefone: "(21) 98888-5678", endereco: "Av. B, 456, Rio de Janeiro - RJ" },
  { id: 3, nome: "Ana Costa", email: "ana.costa@email.com", telefone: "(31) 97777-9012", endereco: "Rua C, 789, Belo Horizonte - MG" },
  { id: 4, nome: "Carlos Souza", email: "carlos.souza@email.com", telefone: "(11) 91234-5678", endereco: "Rua D, 321, Campinas - SP" },
  { id: 5, nome: "Fernanda Lima", email: "fernanda.lima@email.com", telefone: "(21) 93456-7890", endereco: "Av. E, 654, Niterói - RJ" },
  { id: 6, nome: "Lucas Pereira", email: "lucas.pereira@email.com", telefone: "(31) 94567-8901", endereco: "Rua F, 987, Contagem - MG" },
  { id: 7, nome: "Juliana Alves", email: "juliana.alves@email.com", telefone: "(11) 95678-9012", endereco: "Rua G, 159, Santos - SP" },
  { id: 8, nome: "Paulo Henrique", email: "paulo.henrique@email.com", telefone: "(21) 96789-0123", endereco: "Av. H, 753, Duque de Caxias - RJ" },
  { id: 9, nome: "Mariana Rocha", email: "mariana.rocha@email.com", telefone: "(31) 97890-1234", endereco: "Rua I, 357, Uberlândia - MG" },
  { id: 10, nome: "Rafael Costa", email: "rafael.costa@email.com", telefone: "(11) 98901-2345", endereco: "Rua J, 951, São Bernardo - SP" },
  { id: 11, nome: "Patrícia Gomes", email: "patricia.gomes@email.com", telefone: "(21) 99012-3456", endereco: "Av. K, 258, Nova Iguaçu - RJ" },
  { id: 12, nome: "Bruno Martins", email: "bruno.martins@email.com", telefone: "(31) 90123-4567", endereco: "Rua L, 654, Betim - MG" },
  { id: 13, nome: "Aline Souza", email: "aline.souza@email.com", telefone: "(11) 91234-5678", endereco: "Rua M, 852, Guarulhos - SP" },
  { id: 14, nome: "Ricardo Dias", email: "ricardo.dias@email.com", telefone: "(21) 92345-6789", endereco: "Av. N, 456, São Gonçalo - RJ" },
  { id: 15, nome: "Camila Freitas", email: "camila.freitas@email.com", telefone: "(31) 93456-7890", endereco: "Rua O, 123, Montes Claros - MG" },
];

export function AlunosTable() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="max-h-115 overflow-y-auto">
        <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
          <thead className="sticky top-0 z-10">
            <tr className="border-b-2 border-gray-200">
              <AlunosTh className="text-left w-12">ID</AlunosTh>
              <AlunosTh className="text-left">Nome</AlunosTh>
              <AlunosTh className="text-left">Email</AlunosTh>
              <AlunosTh className="text-left">Telefone</AlunosTh>
              <AlunosTh className="text-left">Endereço</AlunosTh>
              <AlunosTh className="text-left w-40">Ações</AlunosTh>
            </tr>
          </thead>
          <tbody className="bg-white">
            {alunos.map((aluno) => (
              <AlunosRow key={aluno.id} {...aluno} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}