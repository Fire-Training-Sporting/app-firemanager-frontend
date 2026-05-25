import Header from "../utils/Header";

const saldoPorModalidadeMock = [
  { modalidade: "Beach Tennis", aulas: 12, cor: "bg-orange-500" },
  { modalidade: "Tênis", aulas: 8, cor: "bg-blue-500" },
  { modalidade: "Funcional", aulas: 5, cor: "bg-emerald-500" },
];

const resumoAgendamentosMock = {
  total: 34,
  concluidos: 28,
  pendentes: 4,
  cancelados: 2,
};

function gerarIniciais(nomeCompleto = "") {
  const partes = nomeCompleto
    .split(" ")
    .map((parte) => parte.trim())
    .filter(Boolean);

  if (!partes.length) {
    return "US";
  }

  const iniciais = `${partes[0][0] || ""}${partes[1]?.[0] || ""}`.toUpperCase();
  return iniciais || "US";
}

function nomeCargo(cargo = "") {
  const cargoNormalizado = cargo.toLowerCase();

  if (cargoNormalizado === "aluno") {
    return "Aluno ativo";
  }

  if (!cargo) {
    return "Sem cargo definido";
  }

  return cargo;
}

export function TelaPerfil() {
  const usuarioString = sessionStorage.getItem("usuario");
  const usuario = usuarioString ? JSON.parse(usuarioString) : {};

  const nome = usuario?.nome || "Usuário";
  const sobrenome = usuario?.sobrenome || "";
  const nomeCompleto = `${nome} ${sobrenome}`.trim();
  const cargo = sessionStorage.getItem("cargo") || usuario?.cargo || "";
  const telefone = usuario?.telefone || "(00) 00000-0000";
  const email = usuario?.email || "usuario@email.com";
  const condominio = usuario?.condominio?.nome || usuario?.condominio || "Condomínio não informado";
  const observacoes =
    usuario?.observacoes ||
    "Aluno com restrição no joelho direito. Evitar exercícios de alto impacto. Prefere agendamentos no período da manhã.";

  const resumo = usuario?.resumoAgendamentos || resumoAgendamentosMock;
  const saldoPorModalidade = usuario?.saldoPorModalidade || saldoPorModalidadeMock;

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
        <section className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-[#23272F]">Meu Perfil</h1>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <article className="rounded-2xl border border-[#D9D9D4] bg-[#FBFBFA] p-6 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#FF6F00] text-3xl font-bold text-white">
                    {gerarIniciais(nomeCompleto)}
                  </div>
                  <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border border-[#CFCFC8] bg-[#EFEFE9] text-[#5F5F57]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 8.5C4 7.67157 4.67157 7 5.5 7H7.17157C7.5694 7 7.95093 6.84196 8.23223 6.56066L8.93934 5.85355C9.12688 5.66601 9.38122 5.56066 9.64645 5.56066H14.3536C14.6188 5.56066 14.8731 5.66601 15.0607 5.85355L15.7678 6.56066C16.0491 6.84196 16.4306 7 16.8284 7H18.5C19.3284 7 20 7.67157 20 8.5V16.5C20 17.3284 19.3284 18 18.5 18H5.5C4.67157 18 4 17.3284 4 16.5V8.5Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-[#23272F]">{nomeCompleto || "Usuário"}</h2>
                <p className="mt-1 text-base text-[#5A5F66]">{nomeCargo(cargo)}</p>

                <span className="mt-4 rounded-full border border-[#FFB07B] bg-[#FFF4EA] px-3 py-1 text-xs font-semibold text-[#D36000]">
                  {condominio}
                </span>
              </div>
            </article>

            <article className="rounded-2xl border border-[#D9D9D4] bg-[#FBFBFA] p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-[#23272F] uppercase">
                Saldo por modalidade
              </h3>

              <div className="space-y-3">
                {saldoPorModalidade.map((item) => (
                  <div
                    key={item.modalidade}
                    className="rounded-xl border border-[#D5D5CF] bg-[#EFEFE9] px-4 py-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${item.cor}`} />
                      <div className="leading-tight">
                        <p className="text-base text-[#23272F]">{item.modalidade}</p>
                        <p className="text-[26px] font-bold text-[#23272F]">
                          {item.aulas}
                          <span className="ml-1 text-base font-normal">aulas</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <article className="rounded-2xl border border-[#D9D9D4] bg-[#FBFBFA] p-5 shadow-sm md:p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-[#23272F] uppercase">
              Informações pessoais
            </h3>

            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#5A5F66]">Nome</p>
                <p className="mt-1 text-2xl font-semibold text-[#23272F]">{nome}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#5A5F66]">Sobrenome</p>
                <p className="mt-1 text-2xl font-semibold text-[#23272F]">{sobrenome || "-"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#5A5F66]">Telefone</p>
                <p className="mt-1 text-2xl font-semibold text-[#23272F]">{telefone}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-[#5A5F66]">E-mail</p>
                <p className="mt-1 break-all text-2xl font-semibold text-[#23272F]">{email}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs uppercase tracking-wide text-[#5A5F66]">Condomínio</p>
                <p className="mt-1 text-2xl font-semibold text-[#23272F]">{condominio}</p>
              </div>
            </div>

            <hr className="my-6 border-[#D8D8D2]" />

            <h3 className="mb-3 text-sm font-semibold tracking-wide text-[#23272F] uppercase">
              Observações
            </h3>
            <div className="rounded-xl border border-[#D5D5CF] bg-[#EFEFE9] p-4 text-lg leading-relaxed text-[#23272F]">
              {observacoes}
            </div>

            <hr className="my-6 border-[#D8D8D2]" />

            <h3 className="mb-4 text-sm font-semibold tracking-wide text-[#23272F] uppercase">
              Resumo de agendamentos
            </h3>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-xl border border-[#D8D8D2] bg-[#F2F2EE] p-3 text-center">
                <p className="text-[34px] font-bold leading-none text-[#23272F]">{resumo.total ?? 0}</p>
                <p className="mt-1 text-sm text-[#4D535B]">Total</p>
              </div>

              <div className="rounded-xl border border-[#87D6B4] bg-[#E7F8EF] p-3 text-center">
                <p className="text-[34px] font-bold leading-none text-[#0A8A55]">{resumo.concluidos ?? 0}</p>
                <p className="mt-1 text-sm text-[#0A8A55]">Concluídos</p>
              </div>

              <div className="rounded-xl border border-[#F4CC7D] bg-[#FFF7E8] p-3 text-center">
                <p className="text-[34px] font-bold leading-none text-[#A06D00]">{resumo.pendentes ?? 0}</p>
                <p className="mt-1 text-sm text-[#A06D00]">Pendentes</p>
              </div>

              <div className="rounded-xl border border-[#F1B19E] bg-[#FFF1ED] p-3 text-center">
                <p className="text-[34px] font-bold leading-none text-[#B5411D]">{resumo.cancelados ?? 0}</p>
                <p className="mt-1 text-sm text-[#B5411D]">Cancelados</p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
