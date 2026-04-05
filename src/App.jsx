import './App.css'
import Header from './components/utils/Header'
import TelaFuncionarios from './components/pages/TelaFuncionarios'
import CadastroFuncionario from './components/pages/CadastroFuncionario'

// import { Servico } from './components/pages/Servico'

function App() {
  return (
    <>
      <Header/>
      <TelaFuncionarios />
      {/* <Servico /> */}
    </>
  )
}

export default App