import { useState } from 'react';
import './App.css';
import { TelaLogin } from './components/pages/TelaLogin';
import { TelaDashboard } from './components/pages/TelaDashboard';

function App() {
  const [telaAtiva, setTelaAtiva] = useState("login");

  //LOGICA DE MUDAR DE TELA ATRAVES DO ESTADO
  return (
<<<<<<< HEAD
    <div className="App">
      {telaAtiva === "login" && (
        <TelaLogin onLoginSucesso={() => setTelaAtiva("dashboard")} />
      )}

      {telaAtiva === "dashboard" && (
        <TelaDashboard onLogout={() => setTelaAtiva("login")} />
      )}
    </div>
  );
=======
    <>
      {/* <TelaAlunos /> */}
      {/* <TelaFuncionarios /> */}
      <TelaAgendamentos />
      {/* <TelaCondominios /> */}
      {/* <TelaLogin /> */}
    </>
  )
>>>>>>> feature/components/modal
}

export default App;