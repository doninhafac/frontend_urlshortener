import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SocialButton } from '../../components/SocialButton';
import { ArrowRight } from 'lucide-react';
import Footer from '../../components/Footer';
import { api } from '../../services/api';
import { Header } from '../../components/Header';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            name,
            username,
            email,
            password,
        };

        const response = await api.post('/registros/register/', data);
        console.log(response.data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-5xl">
                    <h1 className="text-4xl font-bold text-white text-center mb-16">Crie sua conta</h1>

                    <div className="flex flex-col lg:flex-row gap-8 justify-center">
                        {/* Registration Form */}
                        <div className="w-full lg:w-1/2 max-w-md">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nome completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-4 rounded-lg bg-purple-500/50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white transform transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02]"
                                />

                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full p-4 rounded-lg bg-purple-500/50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white transform transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02]"
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-4 rounded-lg bg-purple-500/50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white transform transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02]"
                                />

                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-4 rounded-lg bg-purple-500/50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white transform transition-all duration-300 hover:scale-[1.02] focus:scale-[1.02]"
                                />

                                <button
                                    type="submit"
                                    className="w-full p-4 rounded-lg bg-purple-500/50 text-white hover:bg-purple-500/70 transition-all duration-300 flex items-center justify-between group hover:scale-[1.02] hover:shadow-lg"
                                >
                                    <span>Registrar</span>
                                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            <div className="text-center space-y-4 mt-8">
                                <p className="text-white">
                                    Já tem uma conta?{' '}
                                    <Link to="/" className="underline hover:text-purple-200 transition-colors">
                                        Faça login!
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Alternative Registration Methods */}
                        <div className="w-full lg:w-1/2 max-w-md space-y-4">
                            <SocialButton icon="google" onClick={() => {}} label="Registrar com Google" />
                            <SocialButton icon="facebook" onClick={() => {}} label="Registrar com Facebook" />
                            <SocialButton icon="apple" onClick={() => {}} label="Registrar com Conta Apple" />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Register;
