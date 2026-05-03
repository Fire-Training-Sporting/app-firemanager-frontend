import { useState } from 'react';
import './App.css';
import { TelaLogin } from './components/pages/TelaLogin';
import { TelaDashboard } from './components/pages/TelaDashboard';

function App() {
  const [telaAtiva, setTelaAtiva] = useState("login");

  //LOGICA DE MUDAR DE TELA ATRAVES DO ESTADO
  return (
    <div className="App">
      {telaAtiva === "login" && (
        <TelaLogin onLoginSucesso={() => setTelaAtiva("dashboard")} />
      )}

      {telaAtiva === "dashboard" && (
        <TelaDashboard onLogout={() => setTelaAtiva("login")} />
      )}
    </div>
  );
}

export default App;