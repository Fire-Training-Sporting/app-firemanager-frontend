import Header from '../utils/Header'
import { AlunosTable } from '../utils/Alunos/AlunosTable'

export default function Alunos(){
    return(
        <>
            <Header />
            <main className='w-full h-136 flex items-center justify-center'>
                <div className='max-w-6xl h-130 bg-stone-600 p-8 pt-4 rounded-xl'>
                    <div className='mb-4'>
                        <h1 className='text-3xl text-white font-bold mb-2'>Alunos</h1>
                    </div>
                    <div className='bg-white rounded-lg shadow-md border overflow-hidden'>
                        <AlunosTable />
                    </div>
                </div>
            </main>
        </>
    )
}