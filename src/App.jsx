import './App.css'
import Header from './components/utils/Header'
import TelaFuncionarios from './components/pages/TelaFuncionarios'
import TelaAgendamentos from './components/pages/TelaAgendamentos'

// import { Servico } from './components/pages/Servico'

function App() {
  return (
    <>
      <Header/>
      {/* <TelaFuncionarios /> */}
      <TelaAgendamentos />
      {/* <Servico /> */}
    </>
  )
}

export default App