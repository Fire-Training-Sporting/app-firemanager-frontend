import './App.css'
import Header from './components/utils/Header';
import { BtnRed } from './components/utils/buttons/btnRed';
import { BtnGreen } from './components/utils/Buttons/BtnGreen';
import { BtnBlue } from './components/utils/Buttons/BtnBlue';

function App() {
  return (
    <>
      <Header />
      <BtnRed content="Excluir" />
      <BtnGreen content="Salvar" />
      <BtnBlue content="Editar" />
    </>
  )
}

export default App