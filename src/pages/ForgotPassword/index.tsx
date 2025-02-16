import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Footer from '../../components/Footer';
import { api } from '../../services/api';
import { Header } from '../../components/Header';

function ForgotPassword() {
    const { token } = useParams();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);

    useEffect(() => {
        if (token) {
            setShowResetForm(true);
        }
    }, [token]);

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setMessage('O e-mail é obrigatório.');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/forgotpassword/forgot-password/', { email });
            setMessage(response.data.message || 'Se o e-mail existir, um link será enviado.');
        } catch (error) {
            setMessage('Erro ao enviar o e-mail. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setMessage('Ambas as senhas são obrigatórias.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('As senhas não coincidem.');
            return;
        }

        if (!token) {
            setMessage('Link inválido. Tente novamente.');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post(`/forgotpassword/reset-password/${token}/`, {
                password: newPassword,
            });

            setMessage(response.data.message || 'Senha redefinida com sucesso!');
        } catch (error) {
            setMessage('Erro ao redefinir senha. O link pode ter expirado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-5xl">
                    <h1 className="text-4xl font-bold text-white text-center mb-16">
                        {showResetForm ? 'Redefina sua senha' : 'Recupere sua senha'}
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-8 justify-center">
                        <div className="w-full lg:w-1/2 max-w-md">
                            {showResetForm ? (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <input
                                        type="password"
                                        placeholder="Nova Senha"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-4 rounded-lg bg-purple-500/50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirmar Senha"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full p-4 rounded-lg bg-purple-500/50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full p-4 rounded-lg bg-purple-500/50 text-white hover:bg-purple-500/70 transition-all duration-300 flex items-center justify-between group"
                                    >
                                        <span>{loading ? 'Redefinindo...' : 'Redefinir Senha'}</span>
                                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleRequestReset} className="space-y-4">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-4 rounded-lg bg-purple-500/50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full p-4 rounded-lg bg-purple-500/50 text-white hover:bg-purple-500/70 transition-all duration-300 flex items-center justify-between group"
                                    >
                                        <span>{loading ? 'Enviando...' : 'Enviar'}</span>
                                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            )}

                            <div className="text-center space-y-4 mt-8">
                                <p className="text-white">
                                    Não tem uma conta?{' '}
                                    <Link to="/register" className="underline hover:text-purple-200 transition-colors">
                                        Registre-se!
                                    </Link>
                                </p>
                                <Link
                                    to="/"
                                    className="block text-white underline hover:text-purple-200 transition-colors"
                                >
                                    Voltar para o login
                                </Link>
                            </div>

                            {message && <p className="text-white text-center mt-4">{message}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ForgotPassword;
