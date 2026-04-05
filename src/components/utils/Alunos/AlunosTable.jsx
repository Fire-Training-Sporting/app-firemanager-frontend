export function AlunosTable(){
    const alunos = [
        { nome: "João Silva", email: "joao@email.com", telefone: "(11) 98765-4321", endereco: "Rua das Flores, 123"},
        { nome: "Maria Santos", email: "maria@email.com", telefone: "(11) 99876-5432", endereco: "Av. Principal, 456"},
        { nome: "Pedro Costa", email: "pedro@email.com", telefone: "(11) 98765-4321", endereco: "Rua das Flores, 789"},
        { nome: "Ana Paula", email: "ana@email.com", telefone: "(11) 98765-4321", endereco: "Rua das Rosas, 101"},
        { nome: "Carlos Oliveira", email: "carlos@email.com", telefone: "(11) 91234-5678", endereco: "Rua do Sol, 202"},
        { nome: "Fernanda Lima", email: "fernanda@email.com", telefone: "(11) 92345-6789", endereco: "Av. das Árvores, 303"},
        { nome: "Roberto Alves", email: "roberto@email.com", telefone: "(11) 93456-7890", endereco: "Rua da Praia, 404"},
        { nome: "Juliana Pereira", email: "juliana@email.com", telefone: "(11) 94567-8901", endereco: "Rua dos Ventos, 505"}
    ];

    return(
        <div className="bg-[#5a5a5a] p-6 rounded-2xl text-white">
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full border-separate border-spacing-1">
                    <thead>
                        <tr className="bg-[#3f3f3f]">
                            <th className="text-lg p-3 text-center font-bold rounded-sm min-w-48">Nome</th>
                            <th className="text-lg p-3 text-center font-bold rounded-sm min-w-48">Email</th>
                            <th className="text-lg p-3 text-center font-bold rounded-sm min-w-48">Telefone</th>
                            <th className="text-lg p-3 text-center font-bold rounded-sm min-w-48">Endereço</th>
                            <th className="text-lg p-3 text-center font-bold rounded-sm min-w-24">Editar</th>
                            <th className="text-lg p-3 text-center font-bold rounded-sm min-w-24">Excluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map((aluno, index) => {
                            const bg = index % 2 === 0 ? "bg-orange-300" : "bg-orange-500";
                            return (
                                <tr key={index}>
                                    <td className={`text-md p-3 text-center font-bold rounded-sm min-w-48 ${bg}`}>{aluno.nome}</td>
                                    <td className={`text-md p-3 text-center font-bold rounded-sm min-w-48 ${bg}`}>{aluno.email}</td>
                                    <td className={`text-md p-3 text-center font-bold rounded-sm min-w-48 ${bg}`}>{aluno.telefone}</td>
                                    <td className={`text-md p-3 text-center font-bold rounded-sm min-w-48 ${bg}`}>{aluno.endereco}</td>
                                    <td className="text-center min-w-24">
                                        <button className="w-full bg-green-600 pb-3 pt-3 rounded-sm text-white font-semibold hover:cursor-pointer">Editar</button>
                                    </td>
                                    <td className="text-center min-w-24">
                                        <button className="w-full bg-red-600 pb-3 pt-3 rounded-sm text-white font-semibold hover:cursor-pointer">Excluir</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}