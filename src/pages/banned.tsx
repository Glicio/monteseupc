import { NextPage } from "next";
import { signOut } from "next-auth/react";

const Banned: NextPage = () => {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold" style={{ fontFamily: "arial" }}>
        Não tão rápido!
      </h1>
      <h2
        className="w-[50vw] text-xl font-bold text-justify"
        style={{ fontFamily: "arial" }}
      >
        Sua conta está suspensa, se você acha que isso é um erro entre em
        contato com o suport ou mande um email para {" "}
        <a href="mailto:glicioo@outlook.com" className="text-blue-600">glicioo@outlook.com</a>
      </h2>
      <button className="secondary-button" onClick={() => void signOut({callbackUrl: "/"})}>sair</button>
    </main>
  );
};

export default Banned;
