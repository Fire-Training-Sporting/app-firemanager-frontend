import { useState } from "react";
import logoFire from "../../assets/logo2.png";
import emailIcon from "../../assets/email.png";
import lockIcon from "../../assets/lock.png";
import loginIcon from "../../assets/login.png";
import visibilityIcon from "../../assets/visibility.png";
import visibilityOffIcon from "../../assets/visibility-off.png";
import InputComponent from "../utils/InputComponent";
import { BtnGreen } from "../utils/Buttons/BtnGreen";

export function TelaLogin(){
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="min-h-screen font-[Montserrat,sans-serif]">
            <section className="grid min-h-screen md:grid-cols-[34%_66%]">
                <aside className="flex items-center justify-center bg-white px-8 py-16 md:px-8 md:py-12">
                    <img
                        className="h-auto w-[min(470px,80%)] object-contain md:w-[min(540px,84%)]"
                        src={logoFire}
                        alt="Logo Fire Training Sporting"
                    />
                </aside>

                <section className="flex items-center justify-center bg-[#ec7200] px-9 py-12 md:px-10 md:py-14">
                    <div className="w-full max-w-125 rounded-2xl bg-[#242525] p-8 shadow-[0_16px_35px_rgba(0,0,0,0.16)] md:p-10">
                        <h1 className="mb-6 text-[clamp(2rem,2.8vw,3rem)] leading-[1.08] font-extrabold text-white">
                            Olá,
                            <br />
                            Bem-vindo!
                        </h1>

                            <InputComponent
                                label="Email"
                                id="login-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="seuemail@email.com"
                                containerClassName="mb-0"
                                labelClassName="my-2 block text-[clamp(1rem,1.2vw,1.2rem)] font-medium text-white"
                                leftIcon={<img src={emailIcon} alt="" className="h-5 w-5 object-contain" />}
                                inputClassName="w-full rounded-[9px] border-0 bg-[#e6e7ed] py-[0.88rem] pl-11 pr-4 text-base text-[#1f1f1f] outline-none focus:ring-3 focus:ring-white/25"
                            />

                            <InputComponent
                                label="Senha"
                                id="login-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Digite sua senha"
                                containerClassName="mb-0"
                                labelClassName="mb-[0.55rem] mt-[0.65rem] block text-[clamp(1rem,1.2vw,1.2rem)] font-medium text-white"
                                leftIcon={<img src={lockIcon} alt="" className="h-5 w-5 object-contain" />}
                                rightIcon={
                                    <img
                                        src={showPassword ? visibilityOffIcon : visibilityIcon}
                                        alt=""
                                        className="h-5 w-5 object-contain"
                                    />
                                }
                                rightAction={() => setShowPassword((prev) => !prev)}
                                inputClassName="w-full rounded-[9px] border-0 bg-[#e6e7ed] py-[0.88rem] pl-11 pr-12 text-base text-[#1f1f1f] outline-none focus:ring-3 focus:ring-white/25"
                            />

                            <BtnGreen
                                content={(
                                    <span className="flex items-center justify-center gap-2 pt-1 pb-1">
                                        <img src={loginIcon} alt="" className="h-5 w-5" />
                                        <p>Entrar</p>
                                    </span>
                                )}
                                type="submit"
                                className="mt-[1.35rem] w-full py-2 text-base font-semibold transition hover:brightness-95"
                            />
                    </div>
                </section>
            </section>
        </main>
    );
}