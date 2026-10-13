import { useState } from "react";
import { Link } from "react-router-dom";
import logoFire from "../../assets/logo2.png";
import emailIcon from "../../assets/email.png";
import InputComponent from "../utils/InputComponent";
import { BtnGreen } from "../utils/Buttons/BtnGreen";
import api from "../../provider/api";

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function TelaRecuperarSenha() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [requestError, setRequestError] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        if (loading) return;

        const emailNormalizado = email.trim();
        if (!emailNormalizado) {
            setEmailError("Informe seu e-mail.");
            return;
        }
        if (!validarEmail(emailNormalizado)) {
            setEmailError("Digite um e-mail válido.");
            return;
        }

        setEmailError("");
        setRequestError("");
        setLoading(true);
        try {
            const response = await api.post(
                "/recuperacao-senha",
                { email: emailNormalizado },
                { skipAuth: true, withCredentials: false }
            );

            if (response.status === 202) {
                setEnviado(true);
            } else {
                setRequestError("Não foi possível processar a solicitação. Tente novamente.");
            }
        } catch {
            setRequestError("Não foi possível processar a solicitação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen font-[Montserrat,sans-serif]">
            <section className="grid min-h-screen md:grid-cols-[34%_66%]">
                <aside className="hidden items-center justify-center bg-white px-8 py-16 md:flex md:px-8 md:py-12">
                    <img
                        className="h-auto w-[min(470px,80%)] object-contain md:w-[min(540px,84%)]"
                        src={logoFire}
                        alt="Logo Fire Training Sporting"
                    />
                </aside>

                <section className="flex items-center justify-center bg-[#ec7200] px-9 py-12 md:px-10 md:py-14">
                    <div className="w-full max-w-125 rounded-2xl bg-[#242525] p-8 shadow-[0_16px_35px_rgba(0,0,0,0.16)] md:p-10">
                        <h1 className="mb-4 text-[clamp(2rem,2.8vw,3rem)] leading-[1.08] font-extrabold text-white">
                            Esqueceu sua senha?
                        </h1>

                        {enviado ? (
                            <>
                                <p role="status" aria-live="polite" className="mb-6 rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-sm leading-5 text-green-800">
                                    Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha.
                                </p>
                                <Link to="/" className="block text-center font-semibold text-white underline underline-offset-2 hover:text-white/80">
                                    Voltar ao login
                                </Link>
                            </>
                        ) : (
                            <form noValidate onSubmit={handleSubmit}>
                                <InputComponent
                                    label="Email"
                                    id="recovery-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="seuemail@email.com"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        setEmailError("");
                                        setRequestError("");
                                    }}
                                    containerClassName="mb-0"
                                    labelClassName="my-2 block text-[clamp(1rem,1.2vw,1.2rem)] font-medium text-white"
                                    leftIcon={<img src={emailIcon} alt="" className="h-5 w-5 object-contain" />}
                                    inputClassName="w-full rounded-[9px] border-0 bg-[#e6e7ed] py-[0.88rem] pl-11 pr-4 text-base text-[#1f1f1f] outline-none focus:ring-3 focus:ring-white/25"
                                    required
                                    ariaInvalid={Boolean(emailError)}
                                    ariaDescribedBy={emailError ? "recovery-email-error" : undefined}
                                />
                                {emailError && (
                                    <p id="recovery-email-error" role="alert" className="mt-1 text-sm text-red-200">
                                        {emailError}
                                    </p>
                                )}
                                {requestError && (
                                    <p role="alert" className="mt-3 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-800">
                                        {requestError}
                                    </p>
                                )}

                                <BtnGreen
                                    content={<span>{loading ? "Enviando..." : "Enviar link"}</span>}
                                    type="submit"
                                    disabled={loading}
                                    ariaBusy={loading}
                                    className="mt-[1.35rem] w-full py-3 text-base font-semibold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                                />
                                <Link to="/" className="mt-5 block text-center text-sm font-medium text-white underline underline-offset-2 hover:text-white/80">
                                    Voltar ao login
                                </Link>
                            </form>
                        )}
                    </div>
                </section>
            </section>
        </main>
    );
}