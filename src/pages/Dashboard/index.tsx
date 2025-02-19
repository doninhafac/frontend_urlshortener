import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
    const { user } = useAuth();
    const [url, setUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [links, setLinks] = useState([]);
    const [loadingLinks, setLoadingLinks] = useState(true);
    const [errorLoadingLinks, setErrorLoadingLinks] = useState(null);
    const [showSignupPrompt, setShowSignupPrompt] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const fetchLinks = async () => {
        setLoadingLinks(true);
        setErrorLoadingLinks(null);
        try {
            const response = await api.get('/list');
            if (response.status === 200) {
                setLinks(response.data);
            } else {
                setErrorLoadingLinks('Erro ao carregar links.');
                console.error('Erro ao carregar links:', response.data);
            }
        } catch (error) {
            setErrorLoadingLinks('Erro ao conectar ao backend para carregar links.');
            console.error('Erro ao conectar ao backend para carregar links:', error);
        } finally {
            setLoadingLinks(false);
        }
    };

    const handleShorten = async () => {
        if (!url.trim()) {
            alert('Por favor, insira um link válido.');
            return;
        }

        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;

        if (!urlPattern.test(url)) {
            alert('URL inválida. Certifique-se de incluir http:// ou https://');
            return;
        }

        try {
            const response = await api.post('/shorten', { url });

            if (response.status === 201) {
                setShortenedUrl(response.data.shortened_url);
                setUrl('');
                if (user?.id) {
                    fetchLinks();
                }
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

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Link copiado para a área de transferência!');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 via-purple-400 to-purple-500">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center px-4">
                <div className="text-center text-white mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Seu Dashboard de Links</h1>
                    <p className="text-xl md:text-2xl opacity-90">Gerencie e personalize seus links encurtados.</p>
                </div>

                <div className="w-full max-w-3xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Cole seu link para encurtar"
                            className="flex-1 px-6 py-4 rounded-lg text-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <button
                            onClick={handleShorten}
                            className="px-8 py-4 bg-white text-purple-600 rounded-lg text-lg font-semibold hover:bg-purple-100 transition md:w-auto w-full"
                        >
                            Encurtar
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Dashboard;