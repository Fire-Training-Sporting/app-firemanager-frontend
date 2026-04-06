import './App.css'
import Header from './components/utils/Header'
import { TelaDashboard } from './components/pages/TelaDashboard'

import TelaFuncionarios from './components/pages/TelaFuncionarios'
import TelaAgendamentos from './components/pages/TelaAgendamentos'

// import { Servico } from './components/pages/Servico'

function App() {
  return (
    <>
      <TelaDashboard />
      <Header/>
      {/* <TelaFuncionarios /> */}
      <TelaAgendamentos />
      {/* <Alunos /> */}
      {/* <Servico /> */}
    </>
  )
}

export default App