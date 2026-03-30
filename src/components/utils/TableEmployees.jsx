import React from "react";

function TableEmployees() {
    const employees = [
    { id: 1, nome: "João Silva", email: "joao@example.com", perfil: "Admin", acao: "Editar" },
    { id: 2, nome: "Maria Oliveira", email: "maria@example.com", perfil: "Editor", acao: "Editar" },
    { id: 3, nome: "Carlos Santos", email: "carlos@example.com", perfil: "Visualizador", acao: "Editar" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-8">Funcionários</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Nome</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Perfil</th>
            <th className="border border-gray-300 p-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{employee.nome}</td>
              <td className="border border-gray-300 p-2">{employee.email}</td>
              <td className="border border-gray-300 p-2">{employee.perfil}</td>
              <td className="border border-gray-300 p-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded">{employee.acao}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableEmployees;
