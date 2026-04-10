import InputComponent from "../utils/InputComponent"
import { BtnGreen } from "../utils/Buttons/BtnGreen"

export function TelaLogin(){
    return(
        <>
            <InputComponent label="Email" />
            <InputComponent label="Senha" type="password" />
            <BtnGreen content="Entrar" />
        </>
    )
}