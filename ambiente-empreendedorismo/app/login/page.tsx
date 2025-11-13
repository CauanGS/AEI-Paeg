"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserCircleIcon, UserIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostraSenha, setMostraSenha] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    setCarregando(true);

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_usuario: nomeUsuario, senha }), 
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("✅ Login bem-sucedido!");
        localStorage.setItem("token", data.token);

        // Aguarda 1 segundo e redireciona
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else {
        setMensagem(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{backgroundImage: "url('/assets/background.jpg')"}}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm overflow-hidden p-10">

            <div className="flex items-center justify-center gap-4 p-4 bg-white" style={{userSelect: "none"}}>
                <img src="/assets/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                <div className="text-left">
                    <h1 className="text-lg font-semibold leading-tight text-[#2E2B82]">
                    Ambiente de <br /> empreendedorismo <br /> e inovação
                    </h1>
                </div>
            </div>

            <div className="text-center px-6 mt-1" style={{userSelect: "text"}}>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem vindo de volta</h2>
                <p className="text-gray-600 text-sm">A tua jornada empreendedora te aguarda!</p>
            </div>

            <div className="p-1 mt-3">
                <form onSubmit={handleLogin} className="flex flex-col gap-3">

                    <div className="flex flex-col mb-2" style={{userSelect: "none"}}>
                        <label htmlFor="nomeUsuario" className="text-sm font-medium text-gray-700 mb-2">Nome de usuário</label>
                        
                        <div className="flex items-center border border-gray-300 rounded p-2 focus-within:border-blue-500">
                            <UserIcon className="w-4 h-4 text-black mr-2 flex-shrink-0"/>
                            <input
                                id="nomeUsuario"
                                type="text"
                                placeholder="Nome de usuário"
                                className="w-full outline-none text-black text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col mb-3" style={{userSelect: "none"}}>
                        <label htmlFor="senha" className="text-sm font-medium text-gray-700 mb-2">Senha</label>
                        
                        <div className="flex items-center border border-gray-300 rounded p-2 focus-within:border-blue-500">
                            <LockClosedIcon className="w-4 h-4 text-black mr-2 flex-shrink-0"/>
                            <input
                                id="senha"
                                type={mostraSenha ? "text" : "password"}
                                placeholder="Senha"
                                className="w-full outline-none text-black text-sm"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setMostraSenha(!mostraSenha)}
                                className="ml-2 focus: outline-none"
                                >
                                {mostraSenha? (
                                    <EyeSlashIcon className="w-5 h-5 text-gray-600"/>
                                ): (
                                    <EyeIcon className="w-5 h-5 text-gray-600"/>
                                )}
                            </button>
                        </div>
                    </div>  

                     {mensagem && (
                            <p className="text-center text-sm text-red-600 -mt-5 -mb-1">{mensagem}</p>
                    )} 

                    <div className="flex item-center justify-between mb-1">
                        <label className="flex items-center text-sm text-gray-700 select-none cursor-pointer">
                            <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 focus:ring-blue-500"/>
                            Lembre-me
                        </label>

                        <a style={{userSelect: "none"}} href="/recuperar-senha" className="text-sm text-blue-600 hover:underline">Esqueceu a senha?</a>
                    </div>

                    <button 
                        style={{userSelect: "none"}}
                        type="submit"
                        disabled={carregando}
                        className={`font-bold cursor-pointer p-2 rounded text-white transition ${
                        carregando ? "bg-gray-400" : "bg-[#2E2B82] hover:bg-[#292570]"
                        }`}
                    >
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>

                    <div className="flex items-center mt-2" style={{userSelect: "none"}}>
                        <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-2 text-gray-500 text-sm" style={{userSelect: "text"}}>ou continue com</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div className="flex gap-4 mt-2" style={{userSelect: "none"}}>
                        <div className="flex-1 flex items-center justify-center gap-2 p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
                            <img src="/assets/google.png" alt="Google" className="w-5 h-5" />
                            <span className="text-sm font-medium text-gray-700">Google</span>
                        </div>

                        <div className="flex-1 flex items-center justify-center gap-2 p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
                            <img src="/assets/github.png" alt="GitHub" className="w-5 h-5" />
                            <span className="text-sm font-medium text-gray-700">GitHub</span>
                        </div>
                    </div>

                    <div className="text-center mt-1" style={{userSelect: "none"}}>
                        <p className="text-gray-600 text-xs">Não tem uma conta? <span className="font-bold text-blue-600 hover:underline cursor-pointer">Cadastrar</span></p>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}