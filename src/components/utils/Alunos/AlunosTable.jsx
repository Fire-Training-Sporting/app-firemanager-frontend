import { AlunosRow } from './AlunosRow'

export function AlunosTable(){
    return(
        <div className="w-full overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-stone-800 border-b-2">
                        <th className="px-6 py-4 text-left font-semibold text-white text-md">Nome</th>
                        <th className="px-6 py-4 text-left font-semibold text-white text-md">Email</th>
                        <th className="px-6 py-4 text-left font-semibold text-white text-md">Telefone</th>
                        <th className="px-6 py-4 text-left font-semibold text-white text-md">Endereço</th>
                        <th className="px-6 py-4 text-center font-semibold text-white text-md">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    <AlunosRow nome="João Silva" email="joao@email.com" telefone="(11) 98765-4321" endereco="Rua das Flores, 123"/>
                    <AlunosRow nome="Maria Santos" email="maria@email.com" telefone="(11) 99876-5432" endereco="Av. Principal, 456"/>
                    <AlunosRow nome="Pedro Costa" email="pedro@email.com" telefone="(11) 98765-4321" endereco="Rua das Flores, 789"/>
                    <AlunosRow nome="Ana Paula" email="ana@email.com" telefone="(11) 98765-4321" endereco="Rua das Rosas, 101"/>
                </tbody>
            </table>
        </div>
    )
}