import { useState } from 'react';
import { Header } from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

function MainPage() {
    const { user } = useAuth();
    const [url, setUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [showSignupPrompt, setShowSignupPrompt] = useState(false);

    const handleShorten = async () => {
        if (!url.trim()) {
            alert("Por favor, insira um link válido.");
            return;
        }
    
        // Expressão regular para validar URLs
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;
        
        if (!urlPattern.test(url)) {
            alert("URL inválida. Certifique-se de incluir http:// ou https://");
            return;
        }
    
        try {
            const response = await api.post('/shorten/', { url });
    
            if (response.status === 201) {
                setShortenedUrl(response.data.shortened_url);
            } else {
                console.error('Erro ao encurtar URL:', response.data);
            }
    
            if (!user) {
                setShowSignupPrompt(true);
            }
        } catch (error) {
            console.error('Erro ao conectar ao backend:', error);
        }
    };
    
    

    return (
        <div className="h-screen bg-gradient-to-br from-purple-500 via-purple-400 to-purple-500 relative overflow-hidden">
            <Header />

            <main className="h-full flex flex-col items-center justify-center px-4">
                <div className="text-center text-white mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Encurte seus links</h1>
                    <p className="text-xl md:text-2xl opacity-90">Simples, rápido e poderoso</p>
                </div>

                <div className="w-full max-w-2xl space-y-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Cole seu link aqui"
                            className="flex-1 px-6 py-4 rounded-lg text-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <button
                            onClick={handleShorten}
                            className="px-8 py-4 bg-white text-purple-600 rounded-lg text-lg font-semibold hover:bg-purple-100 transition md:w-auto w-full"
                        >
                            Encurtar
                        </button>
                    </div>

                    {shortenedUrl && (
                        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-xl font-semibold">{shortenedUrl}</div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(shortenedUrl)}
                                    className="px-6 py-2 bg-white text-purple-600 rounded-full hover:bg-purple-100 transition"
                                >
                                    Copiar
                                </button>
                            </div>

                            {!user && showSignupPrompt && (
                                <div className="mt-4 text-sm bg-white/10 rounded-lg p-4">
                                    Crie uma conta para personalizar seus links e acessar estatísticas avançadas!
                                    <Link to="/register" className="ml-4 text-purple-200 hover:text-white transition">
                                        Criar conta agora
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default MainPage;
