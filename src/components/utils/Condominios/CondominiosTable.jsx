import { CondominiosRow } from './CondominiosRow.jsx';
import CondominiosTh from './CondominiosTh';

const condominios = [
  { id: 1, nome: "Condomínio Jardins do Sol", cep: "01234-567", logradouro: "Rua das Flores", numero: "123", cidade: "São Paulo", bairro: "Centro" },
  { id: 2, nome: "Condomínio Vista Alegre", cep: "89012-345", logradouro: "Av. Paulista", numero: "456", cidade: "Rio de Janeiro", bairro: "Leblon" },
  { id: 3, nome: "Condomínio Reserva Natural", cep: "56789-012", logradouro: "Rua Verde, 789", numero: "789", cidade: "Belo Horizonte", bairro: "Serra" },
];

export function CondominiosTable() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="max-h-115 overflow-y-auto">
        <table className="w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
          <thead className="sticky top-0 z-10">
            <tr className="border-b-2 border-gray-200">
              <CondominiosTh className="w-12">ID</CondominiosTh>
              <CondominiosTh>Nome</CondominiosTh>
              <CondominiosTh>CEP</CondominiosTh>
              <CondominiosTh>Logradouro</CondominiosTh>
              <CondominiosTh>Número</CondominiosTh>
              <CondominiosTh>Cidade</CondominiosTh>
              <CondominiosTh>Bairro</CondominiosTh>
              <CondominiosTh className="w-40">Ações</CondominiosTh>
            </tr>
          </thead>
          <tbody className="bg-white">
            {condominios.map((cond) => (
              <CondominiosRow key={cond.id} {...cond} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
