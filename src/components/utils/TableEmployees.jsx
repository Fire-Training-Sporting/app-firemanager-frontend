import { useState } from "react";

const mockEmployees = [
  { id: 1, nome: "Bruno Caique", email: "brunocaique@email.com", perfil: "Quadra" },
  { id: 2, nome: "Kalleb Belizario", email: "kallebbelizario@email.com", perfil: "Quadra" },
  { id: 3, nome: "Giovana Zaneti", email: "giozanet@email.com", perfil: "Escritório" },
  { id: 4, nome: "Beatriz Nascimento", email: "beatriznascimento@email.com", perfil: "Administrador" },
  { id: 5, nome: "Lucas da Silva", email: "lucassilva@email.com", perfil: "Quadra" },
  { id: 6, nome: "João Pedro", email: "jpedro@email.com", perfil: "Quadra" },
  { id: 7, nome: "Vitor Ramos", email: "vitorramos@email.com", perfil: "Quadra" },
];

function TableEmployees() {
  const [employees] = useState(mockEmployees);

  return (
    <div className="bg-white p-12">
      <p className="text-4xl font-bold mb-6 ml-0.5">Funcionários</p>
      <div className="bg-[#5a5a5a] p-6 rounded-2xl text-white">
        {/* Topo */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-semibold">Filtrar:</span>
            <button className="text-2xl bg-white text-black px-4 py-1 rounded-2xl font-semibold">
              Todos
            </button>
          </div>

          <button className="text-xl bg-blue-600 px-4 py-2 rounded-lg font-semibold">
            + Cadastrar funcionário
          </button>
        </div>

        {/* Cabeçalho */}
        <div className="grid grid-cols-[1.6fr_2.4fr_1.5fr_100px_100px] gap-2 mb-4">
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Nome</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Email</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Perfil</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Editar</div>
          <div className="text-xl bg-[#3f3f3f] p-3 rounded-lg text-center font-semibold">Excluir</div>
        </div>

        {/* Linhas */}
        <div className="flex flex-col gap-3">
          {employees.map((emp, index) => {
            const bg = index % 2 === 0 ? "bg-orange-300" : "bg-orange-500";

            return (
              <div key={emp.id} className="grid grid-cols-[1.6fr_2.4fr_1.5fr_100px_95px] gap-3 items-center">
                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
                  {emp.nome}
                </div>
                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
                  {emp.email}
                </div>
                <div className={`text-xl ${bg} p-3 rounded-lg text-center font-semibold`}>
                  {emp.perfil}
                </div>
                <div className={`text-xl p-0 rounded-lg`}>
                  <button className="w-full h-13 bg-green-600 rounded-lg text-white font-semibold">
                    Editar
                  </button>
                </div>
                <div className={`text-xl p-0 rounded-lg`}>
                  <button className="w-full h-13 bg-red-600 rounded-lg text-white font-semibold">
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TableEmployees;