"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon, SparklesIcon, UserCircleIcon, UserIcon } from '@heroicons/react/24/outline';

export default function CadastroPage() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostraSenha, setMostraSenha] = useState(false);
  const [mostraConfirmarSenha, setMostraConfirmarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const router = useRouter();

    useEffect(() => {
        const salvo = localStorage.getItem("lembrarUsuario");
        if (salvo) {
            setNomeUsuario(salvo);
            setLembrar(true);
        }
    }, []);

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setMensagem("");
    setCarregando(true);

    if(
        nome.trim() === "" ||
        nomeUsuario.trim() === "" ||
        email.trim() === "" ||
        senha.trim() === "" ||
        confirmarSenha.trim() === ""
    ) {
        setMensagem("Por favor, preencha todos os campos");
        setCarregando(false);
        return;
    }

    if(senha !== confirmarSenha) {
        setMensagem("As senhas não coincidem");
        setCarregando(false);
        return;
    }

    try {
      const response = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_usuario: nomeUsuario, nome, email, senha }), 
      });

      const data = await response.json();

      if (response.ok) {
        if(lembrar) localStorage.setItem("lembrarUsuario", nomeUsuario);
        else localStorage.removeItem("lembrarUsuario");
        router.push("/login");
      } else {
        setMensagem(`${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{backgroundImage: "url('/assets/background_cadastro.jpg')"}}>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Junte-se a AEI</h2>
                <p className="text-gray-600 text-[13px]">Comece hoje a tua jornada empreendedora</p>
            </div>

            <div className="p-1 mt-3">
                <form onSubmit={handleCadastro} className="flex flex-col gap-3">
                    <div className="flex flex-col mb-2" style={{userSelect: "none"}}>
                        <label htmlFor="nome" className="text-sm font-medium text-gray-700 mb-2">Nome completo</label>
                        
                        <div className="flex items-center border border-gray-300 rounded p-2 focus-within:border-blue-500">
                            <SparklesIcon className="w-4 h-4 text-black mr-2 flex-shrink-0"/>
                            <input
                                id="nome"
                                type="text"
                                maxLength={200}
                                placeholder="Nome completo"
                                className="w-full outline-none text-black text-sm"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col mb-2" style={{userSelect: "none"}}>
                        <label htmlFor="nomeUsuario" className="text-sm font-medium text-gray-700 mb-2">Nome de usuário</label>
                        
                        <div className="flex items-center border border-gray-300 rounded p-2 focus-within:border-blue-500">
                            <UserIcon className="w-4 h-4 text-black mr-2 flex-shrink-0"/>
                            <input
                                id="nomeUsuario"
                                type="text"
                                maxLength={20}
                                placeholder="Nome de usuário"
                                className="w-full outline-none text-black text-sm"
                                value={nomeUsuario}
                                onChange={(e) => setNomeUsuario(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col mb-2" style={{userSelect: "none"}}>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">Email</label>
                        
                        <div className="flex items-center border border-gray-300 rounded p-2 focus-within:border-blue-500">
                            <EnvelopeIcon className="w-4 h-4 text-black mr-2 flex-shrink-0"/>
                            <input
                                id="email"
                                type="email"
                                maxLength={200}
                                placeholder="Email"
                                className="w-full outline-none text-black text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                    <div className="flex flex-col mb-3" style={{userSelect: "none"}}>
                        <label htmlFor="confirmarSenha" className="text-sm font-medium text-gray-700 mb-2">Confirmar senha</label>
                        
                        <div className="flex items-center border border-gray-300 rounded p-2 focus-within:border-blue-500">
                            <LockClosedIcon className="w-4 h-4 text-black mr-2 flex-shrink-0"/>
                            <input
                                id="confirmarSenha"
                                type={mostraConfirmarSenha ? "text" : "password"}
                                placeholder="Confirmar senha"
                                className="w-full outline-none text-black text-sm"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setMostraConfirmarSenha(!mostraConfirmarSenha)}
                                className="ml-2 focus: outline-none"
                                >
                                {mostraConfirmarSenha? (
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

                    <div className="flex mb-1 items-start text-sm text-gray-700" style={{userSelect: "none"}}>
                        <input
                            id="aceiteTermos"
                            type="checkbox"
                            checked={lembrar}
                            onChange={(e) => setLembrar(e.target.checked)}
                            className="mr-2 mt-1 w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
                            required
                        />

                        <label htmlFor="aceiteTermos" className="flex-1 select-none cursor-pointer">
                            Ao criar uma conta, você concorda com os nossos{" "}
                            <a
                                href="/termos"
                                className="font-bold text-blue-600 hover:underline"
                                onClick={(e) => {
                                    // abrir modal, navegar, etc — não altera o checkbox
                                }}
                            >Termos de Serviço</a>{" "}
                            
                            e a{" "}

                            <a
                                href="/privacidade"
                                className="font-bold text-blue-600 hover:underline"
                            >Política de Privacidade</a>.
                        </label>
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
                        <p className="text-gray-600 text-xs">Ja possui uma conta? <a href="/login"><span className="font-bold text-blue-600 hover:underline cursor-pointer">Entrar</span></a></p>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}