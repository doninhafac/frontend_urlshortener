import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SocialButton } from '../../components/SocialButton';
import { ArrowRight } from 'lucide-react';
import Footer from '../../components/Footer';
import { Header } from '../../components/Header';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

function Login() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(''); // State for login error message
    const navigate = useNavigate();
    const auth = useContext(AuthContext); // Use AuthContext
    const [loading, setLoading] = useState(false); // State for loading state during login

    // Redireciona o usuário se ele já estiver autenticado
    useEffect(() => {
        if (auth?.user) {
            navigate('/dashboard'); // Redirect to dashboard if user is authenticated
        }
    }, [auth, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoading(true);
    
        try {
            const user = await auth.signInWithEmailPassword(usernameOrEmail, password);
            if (user) {
                navigate('/dashboard'); // Redireciona somente se o login for bem-sucedido
            }
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('Falha ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
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
                                    disabled={loading} // Disable button while loading
                                >
                                    <span>{loading ? 'Entrando...' : 'Logar'}</span> {/* Show loading text */}
                                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            {loginError && <p className="text-red-500 mt-2 text-center">{loginError}</p>} {/* Display error message */}

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
                                onClick={() => { // Removed async and direct signInWithGoogle import
                                    setLoginError(''); // Clear any previous error message before Google login
                                    setLoading(true); // Start loading
                                    auth.signInWithGoogle() // Use signInWithGoogle from AuthContext
                                        .then(() => {
                                            navigate('/dashboard'); // Navigate on success
                                        })
                                        .catch((error) => {
                                            console.error('Google login error:', error);
                                            setLoginError('Erro ao fazer login com o Google.'); // Set error message
                                        })
                                        .finally(() => {
                                            setLoading(false); // End loading
                                        });
                                }}
                                label="Login com Google"
                                disabled={loading} // Disable button while loading
                            />
                            <SocialButton icon="facebook" onClick={() => {}} label="Login com Facebook" disabled={loading} /> {/* Disable button while loading */}
                            <SocialButton icon="apple" onClick={() => {}} label="Login com Conta Apple" disabled={loading} /> {/* Disable button while loading */}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Login;