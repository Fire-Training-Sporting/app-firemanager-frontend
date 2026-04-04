import { useEffect, useState } from "react";

function TableEmployees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Exemplo de fetch para uma API fictícia
    fetch("https://api.exemplo.com/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Erro ao buscar funcionários:", error));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-8">Funcionários</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Nome</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Perfil</th>
            <th className="border border-gray-300 p-2">Editar</th>
            <th className="border border-gray-300 p-2">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{employee.nome}</td>
              <td className="border border-gray-300 p-2">{employee.email}</td>
              <td className="border border-gray-300 p-2">{employee.perfil}</td>
              <td className="border border-gray-300 p-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
              </td>
              <td className="border border-gray-300 p-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableEmployees;
