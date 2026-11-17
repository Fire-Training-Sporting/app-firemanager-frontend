import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logoFire from "../../assets/logo2.png";
import lockIcon from "../../assets/lock.png";
import visibilityIcon from "../../assets/visibility.png";
import visibilityOffIcon from "../../assets/visibility-off.png";
import InputComponent from "../utils/InputComponent";
import { BtnGreen } from "../utils/Buttons/BtnGreen";
import api from "../../provider/api";

export default function TelaRedefinirSenha() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState(() => searchParams.get("token") || "");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [senhaError, setSenhaError] = useState("");
    const [confirmarError, setConfirmarError] = useState("");
    const [requestError, setRequestError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [concluido, setConcluido] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        if (loading) return;

        let valido = true;
        if (!novaSenha) {
            setSenhaError("Informe a nova senha.");
            valido = false;
        } else if (novaSenha.length < 6) {
            setSenhaError("A senha deve ter no mínimo 6 caracteres.");
            valido = false;
        } else {
            setSenhaError("");
        }

        if (!confirmarSenha) {
            setConfirmarError("Confirme a nova senha.");
            valido = false;
        } else if (novaSenha !== confirmarSenha) {
            setConfirmarError("As senhas não coincidem.");
            valido = false;
        } else {
            setConfirmarError("");
        }

        if (!token) {
            setRequestError("O link é inválido, expirou ou já foi utilizado. Solicite uma nova recuperação.");
            return;
        }
        if (!valido) return;

        setRequestError("");
        setLoading(true);
        try {
            const response = await api.post(
                "/recuperacao-senha/redefinir",
                { token, novaSenha },
                { skipAuth: true, withCredentials: false }
            );

            if (response.status === 204) {
                setConcluido(true);
                setToken("");
                navigate("/reset-password", { replace: true });
            } else {
                setRequestError("Não foi possível redefinir a senha. O link pode ser inválido, expirado ou já utilizado.");
            }
        } catch {
            setRequestError("Não foi possível redefinir a senha. O link pode ser inválido, expirado ou já utilizado. Confira os requisitos da senha ou solicite um novo link.");
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
                        <h1 className="mb-6 text-[clamp(2rem,2.8vw,3rem)] leading-[1.08] font-extrabold text-white">
                            Redefinir senha
                        </h1>

                        {concluido ? (
                            <>
                                <p role="status" aria-live="polite" className="mb-6 rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-sm leading-5 text-green-800">
                                    Sua senha foi redefinida com sucesso.
                                </p>
                                <Link to="/" className="block text-center font-semibold text-white underline underline-offset-2 hover:text-white/80">
                                    Voltar ao login
                                </Link>
                            </>
                        ) : !token ? (
                            <>
                                <p role="alert" className="mb-5 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-sm leading-5 text-red-800">
                                    O link é inválido, expirou ou já foi utilizado. Solicite uma nova recuperação.
                                </p>
                                <Link to="/recuperar-senha" className="block text-center font-semibold text-white underline underline-offset-2 hover:text-white/80">
                                    Solicitar novo link
                                </Link>
                            </>
                        ) : (
                            <form noValidate onSubmit={handleSubmit}>
                                <InputComponent
                                    label="Nova senha"
                                    id="reset-password"
                                    name="novaSenha"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Digite sua nova senha"
                                    value={novaSenha}
                                    onChange={(event) => {
                                        setNovaSenha(event.target.value);
                                        setSenhaError("");
                                        setRequestError("");
                                    }}
                                    containerClassName="mb-0"
                                    labelClassName="mb-[0.55rem] mt-[0.65rem] block text-[clamp(1rem,1.2vw,1.2rem)] font-medium text-white"
                                    leftIcon={<img src={lockIcon} alt="" className="h-5 w-5 object-contain" />}
                                    rightIcon={<img src={showPassword ? visibilityOffIcon : visibilityIcon} alt="" className="h-5 w-5 object-contain" />}
                                    rightAction={() => setShowPassword((previous) => !previous)}
                                    rightActionAriaLabel={showPassword ? "Ocultar nova senha" : "Mostrar nova senha"}
                                    inputClassName="w-full rounded-[9px] border-0 bg-[#e6e7ed] py-[0.88rem] pl-11 pr-12 text-base text-[#1f1f1f] outline-none focus:ring-3 focus:ring-white/25"
                                    required
                                    minLength={6}
                                    ariaInvalid={Boolean(senhaError)}
                                    ariaDescribedBy={senhaError ? "reset-password-error" : "reset-password-hint"}
                                />
                                <p id="reset-password-hint" className="mt-1 text-xs text-white/75">
                                    A senha deve ter no mínimo 6 caracteres.
                                </p>
                                {senhaError && (
                                    <p id="reset-password-error" role="alert" className="mt-1 text-sm text-red-200">
                                        {senhaError}
                                    </p>
                                )}

                                <InputComponent
                                    label="Confirmar nova senha"
                                    id="reset-password-confirmation"
                                    name="confirmarSenha"
                                    type={showConfirmation ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="Digite novamente sua senha"
                                    value={confirmarSenha}
                                    onChange={(event) => {
                                        setConfirmarSenha(event.target.value);
                                        setConfirmarError("");
                                        setRequestError("");
                                    }}
                                    containerClassName="mb-0"
                                    labelClassName="mb-[0.55rem] mt-[0.65rem] block text-[clamp(1rem,1.2vw,1.2rem)] font-medium text-white"
                                    leftIcon={<img src={lockIcon} alt="" className="h-5 w-5 object-contain" />}
                                    rightIcon={<img src={showConfirmation ? visibilityOffIcon : visibilityIcon} alt="" className="h-5 w-5 object-contain" />}
                                    rightAction={() => setShowConfirmation((previous) => !previous)}
                                    rightActionAriaLabel={showConfirmation ? "Ocultar confirmação da senha" : "Mostrar confirmação da senha"}
                                    inputClassName="w-full rounded-[9px] border-0 bg-[#e6e7ed] py-[0.88rem] pl-11 pr-12 text-base text-[#1f1f1f] outline-none focus:ring-3 focus:ring-white/25"
                                    required
                                    ariaInvalid={Boolean(confirmarError)}
                                    ariaDescribedBy={confirmarError ? "reset-password-confirmation-error" : undefined}
                                />
                                {confirmarError && (
                                    <p id="reset-password-confirmation-error" role="alert" className="mt-1 text-sm text-red-200">
                                        {confirmarError}
                                    </p>
                                )}
                                {requestError && (
                                    <p role="alert" className="mt-3 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-sm leading-5 text-red-800">
                                        {requestError}
                                    </p>
                                )}

                                <BtnGreen
                                    content={<span>{loading ? "Redefinindo..." : "Redefinir senha"}</span>}
                                    type="submit"
                                    disabled={loading}
                                    ariaBusy={loading}
                                    className="mt-[1.35rem] w-full py-3 text-base font-semibold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                                />
                                <Link to="/recuperar-senha" className="mt-5 block text-center text-sm font-medium text-white underline underline-offset-2 hover:text-white/80">
                                    Solicitar novo link
                                </Link>
                            </form>
                        )}
                    </div>
                </section>
            </section>
        </main>
    );
}