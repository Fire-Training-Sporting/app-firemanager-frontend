import { useState } from "react";
import ModalEmployeeRegistration from "./ModalEmployeeRegistration";

const mockEmployees = [
  { id: 1, nome: "Bruno Caique", email: "brunocaique@email.com", perfil: "Quadra" },
  { id: 2, nome: "Kalleb Belizario", email: "kallebbelizario@email.com", perfil: "Quadra" },
  { id: 3, nome: "Giovana Zaneti", email: "giozanet@email.com", perfil: "Escritório" },
  { id: 4, nome: "Beatriz Nascimento", email: "beatriznascimento@email.com", perfil: "Administrador" },
  { id: 5, nome: "Lucas da Silva", email: "lucassilva@email.com", perfil: "Quadra" },
  { id: 6, nome: "João Pedro", email: "jpedro@email.com", perfil: "Quadra" },
  { id: 7, nome: "Vitor Ramos", email: "vitorramos@email.com", perfil: "Quadra" },
];

const colors = {
  bg: {
    gray: "bg-[#4F4F4F]",
    darkGray: "bg-[#363636]",
    orange: "bg-[#F99A4D]",
    darkOrange: "bg-[#F8821E]",
    white: "bg-[#F3F4F8]",
    green: "bg-[#17A34A]",
    red: "bg-[#DC2625]",
    blue: "bg-[#2563EA]",
    yellow: "bg-[#E9B308]",
  },
  text: {
    red: "text-[#DC2625]",
    blue: "text-[#2563EA]",
    green: "text-[#17A34A]",
    gray: "text-[#4F4F4F]",
  },
  hoverBg: {
    red: "hover:bg-[#B91C1C]",      
    blue: "hover:bg-[#1E40AF]",     
    green: "hover:bg-[#166534]",    
    orange: "hover:bg-[#EA580C]",   
    gray: "hover:bg-[#2E2E2E]",     
    yellow: "hover:bg-[#CA8A04]",   
  },
  hoverText: {
    red: "hover:text-[#B91C1C]",
  }
};

function TableEmployees() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (newEmployee) => {
    setEmployees([...employees, { id: employees.length + 1, ...newEmployee }]);
    setIsModalOpen(false);
  };

  return (
    <div className={`${colors.bg.white} p-12`}>
      <p className="text-4xl font-bold mb-6 ml-0.5">Funcionários</p>
      <div className={`${colors.bg.gray} p-6 rounded-2xl text-white`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-semibold">Filtrar:</span>
            <button className={`text-2xl ${colors.bg.white} text-black px-4 py-1 rounded-2xl font-semibold`}>
              Todos
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`text-xl ${colors.bg.blue} ${colors.hoverBg.blue} px-4 py-2 rounded-lg font-semibold`}
          >
            + Cadastrar funcionário
          </button>
        </div>

        <div className="grid grid-cols-[1.6fr_2.4fr_1.5fr_100px_100px] gap-2 mb-4">
          <div className={`text-xl ${colors.bg.darkGray} p-3 rounded-lg text-center font-semibold`}>Nome</div>
          <div className={`text-xl ${colors.bg.darkGray} p-3 rounded-lg text-center font-semibold`}>Email</div>
          <div className={`text-xl ${colors.bg.darkGray} p-3 rounded-lg text-center font-semibold`}>Perfil</div>
          <div className={`text-xl ${colors.bg.darkGray} p-3 rounded-lg text-center font-semibold`}>Editar</div>
          <div className={`text-xl ${colors.bg.darkGray} p-3 rounded-lg text-center font-semibold`}>Excluir</div>
        </div>

        <div className="flex flex-col gap-3">
          {employees.map((emp, index) => {
            const bg = index % 2 === 0 ? colors.bg.orange : colors.bg.darkOrange;

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
                  <button className={`w-full h-13 ${colors.bg.green} ${colors.hoverBg.green} rounded-lg text-white font-semibold`}>
                    Editar
                  </button>
                </div>
                <div className={`text-xl p-0 rounded-lg`}>
                  <button className={`w-full h-13 ${colors.bg.red} ${colors.hoverBg.red} rounded-lg text-white font-semibold`}>
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ModalEmployeeRegistration
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default TableEmployees;