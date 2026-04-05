import React, { useState } from "react";
import InputComponent from "../utils/InputComponent";
import Header from "../utils/Header";

function CadastroFuncionario() {
  const [form, setForm] = useState({
    nome: "Filipe Mazet",
    email: "filipe.mazet@email.com",
    telefone: "11 9 9999-9999",
    perfil: ""
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", form);
  };

  return (
    <>
      {/* <Header /> */}
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md mx-auto relative">
        <button className="absolute top-2 right-2 text-red-500 font-bold">X</button>

        <h2 className="text-white text-xl font-bold mb-4">Cadastrar funcionário</h2>

        <form onSubmit={handleSubmit}>
          <InputComponent
            label="Nome"
            value={form.nome}
            onChange={handleChange("nome")}
          />
          <InputComponent
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
          />
          <InputComponent
            label="Telefone"
            type="tel"
            value={form.telefone}
            onChange={handleChange("telefone")}
          />
          <InputComponent
            label="Perfil"
            value={form.perfil}
            onChange={handleChange("perfil")}
          />

          <button
            type="submit"
            className="mt-4 bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 w-full"
          >
            Cadastrar funcionário
          </button>
        </form>
      </div>
    </>
  );
}

export default CadastroFuncionario;
