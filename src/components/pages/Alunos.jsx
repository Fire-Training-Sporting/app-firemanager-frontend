import Header from '../utils/Header'
import { AlunosTable } from '../utils/Alunos/AlunosTable'

export default function Alunos(){
    return(
        <>
            <Header />
            <main className='w-full h-136 flex items-center justify-center'>
                <div className='w-full h-130 bg-white pt-2 pb-2 pl-12 pr-12 rounded-xl'>
                    <p className='text-4xl font-bold mb-6 ml-0.5'>Alunos</p>
                    <AlunosTable />
                </div>
            </main>
        </>
    )
}