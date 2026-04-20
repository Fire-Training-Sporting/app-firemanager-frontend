import { useState } from "react"
import InputComponent from "../utils/InputComponent"
import { BtnGreen } from "../utils/Buttons/BtnGreen"

const API_URL = "http://localhost:8080";

export async function login(email, senha) {
    const response = await fetch(`${API_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
    }); //FETCH PADRAO

    if (!response.ok) throw new Error("Credenciais inválidas");

    const data = await response.json();

    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("usuario", JSON.stringify(data));
    return data;
}

export function TelaLogin({ onLoginSucesso }) { 
    // ESSE ONLOGINSUCESSO É MEIO QUE UMA FUNÇÃO/PARAMETRO 
    // VAZIO QUE SERVE SÓ PARA ALTERAR O ESTADO E MUDAR PAGINA
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleLogin() {
        setErro("")
        setLoading(true)
        try {
            await login(email, senha)
            onLoginSucesso()
        } catch (e) {
            setErro("Email ou senha inválidos")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <InputComponent
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputComponent
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />
            {erro && <p className="text-red-500 text-sm">{erro}</p>}
            <BtnGreen
                content={loading ? "Entrando..." : "Entrar"}
                onClick={handleLogin}
                disabled={loading}
            />
        </>
    )
}