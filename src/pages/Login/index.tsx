import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SocialButton } from '../../components/SocialButton';
import { ArrowRight } from 'lucide-react';
import Footer from '../../components/Footer';
import { api } from '../../services/api';
import { signInWithGoogle } from '../../services/firebaseConfig';
import { Header } from '../../components/Header';
import { AuthContext } from '../../context/AuthContext'; // Importe o AuthContext

function Login() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const auth = useContext(AuthContext); // Use o AuthContext

    // Redireciona o usuário se ele já estiver autenticado
    useEffect(() => {
        if (auth?.user) {
            navigate('/dashboard'); // Redireciona para o dashboard se o usuário estiver autenticado
        }
    }, [auth, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            username_or_email: usernameOrEmail,
            password,
        };

        try {
            const response = await api.post('/autenticacao/login/', data);
            if (response.status === 200) {
                console.log(response.data);
                navigate('/dashboard');
            } else {
                console.error('Login failed:', response.data);
            }
        } catch (err) {
            console.error('Erro ao fazer login:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-5xl">
                    <h1 className="text-4xl font-bold text-white text-center mb-16">Faça login na sua conta</h1>

                    <div className="flex flex-col lg:flex-row gap-8 justify-center">
                        {/* Login Form */}
                        <div className="w-full lg:w-1/2 max-w-md">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Email / Username"
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
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
                                    <span>Logar</span>
                                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            <div className="text-center space-y-4 mt-8">
                                <p className="text-white">
                                    Não tem uma conta?{' '}
                                    <Link to="/register" className="underline hover:text-purple-200 transition-colors">
                                        Registre-se!
                                    </Link>
                                </p>
                                <Link
                                    to="/forgot-password"
                                    className="block text-white underline hover:text-purple-200 transition-colors"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>
                        </div>

                        {/* Alternative Login Methods */}
                        <div className="w-full lg:w-1/2 max-w-md space-y-4">
                            <SocialButton
                                icon="google"
                                onClick={async () => {
                                    const user = await signInWithGoogle();
                                    if (user) {
                                        console.log('Usuário logado:', user);
                                        // Aqui você pode enviar o token do Firebase para o backend Django para autenticação
                                    }
                                }}
                                label="Login com Google"
                            />
                            <SocialButton icon="facebook" onClick={() => {}} label="Login com Facebook" />
                            <SocialButton icon="apple" onClick={() => {}} label="Login com Conta Apple" />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Login;