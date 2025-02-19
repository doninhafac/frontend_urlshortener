import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [errorLoadingLinks, setErrorLoadingLinks] = useState(null);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editedOriginalUrl, setEditedOriginalUrl] = useState("");
  const [editedShortenedUrl, setEditedShortenedUrl] = useState("");
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchLinks();
    } else {
      setLoadingLinks(false); // If no user, don't try to fetch indefinitely
    }
  }, [user]);

  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redireciona para login se não estiver autenticado
    }
  }, [user, navigate]);

  const fetchLinks = async () => {
    setLoadingLinks(true);
    setErrorLoadingLinks(null);
    try {
      const response = await api.get("/list");
      if (response.status === 200) {
        setLinks(response.data);
      } else {
        setErrorLoadingLinks("Erro ao carregar links.");
        console.error("Erro ao carregar links:", response.data);
      }
    } catch (error) {
      setErrorLoadingLinks("Erro ao conectar ao backend para carregar links.");
      console.error("Erro ao conectar ao backend para carregar links:", error);
    } finally {
      setLoadingLinks(false);
    }
  };

  const handleShorten = async () => {
    if (!url.trim()) {
      alert("Por favor, insira um link válido.");
      return;
    }

    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;

    if (!urlPattern.test(url)) {
      alert("URL inválida. Certifique-se de incluir http:// ou https://");
      return;
    }

    try {
      const response = await api.post("/shorten", { url });

      if (response.status === 201) {
        setShortenedUrl(response.data.shortened_url);
        setUrl(""); // Limpa o input após encurtar
        if (user?.id) {
          fetchLinks(); // Recarrega os links após encurtar um novo
        }
      } else {
        console.error("Erro ao encurtar URL:", response.data);
      }

      if (!user) {
        setShowSignupPrompt(true);
      }
    } catch (error) {
      console.error("Erro ao conectar ao backend:", error);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copiado para a área de transferência!");
  };

  const handleEditClick = (link) => {
    setEditingLinkId(link.id);
    setEditedOriginalUrl(link.original_url);
    setEditedShortenedUrl(link.shortened_url);
  };

  const handleSaveEdit = async (linkId) => {
    try {
      const response = await api.put(`/links/${linkId}`, {
        original_url: editedOriginalUrl,
        shortened_url: editedShortenedUrl,
      });

      if (response.status === 200) {
        setEditingLinkId(null);
        fetchLinks(); // Recarrega os links após a edição
      } else {
        console.error("Erro ao atualizar link:", response.data);
        alert("Erro ao atualizar o link.");
      }
    } catch (error) {
      console.error("Erro ao conectar ao backend para atualizar link:", error);
      alert("Erro ao conectar ao backend ao atualizar o link.");
    }
  };

  const handleCancelEdit = () => {
    setEditingLinkId(null);
  };

  const [successMessage, setSuccessMessage] = useState(null);

  const saveEditing = async (id) => {
    setError(null); // Clear any previous errors
    setSuccessMessage(null); // Clear any previous success messages
    try {
      const response = await api.put(`/links/${id}`, {
        original_url: editedOriginalUrl,
        short_url: editedShortUrl, // Corrected to use short_url as per backend and previous code
      });
      if (response.status !== 200) {
        throw new Error("Falha ao atualizar o link.");
      }
      setLinks(links.map((link) => (link.id === id ? response.data : link)));
      setEditingLinkId(null);
      setSuccessMessage("Link atualizado com sucesso!"); // Set success message
      setTimeout(() => setSuccessMessage(null), 3000); // Clear after 3 seconds
    } catch (err) {
      setError(err.message || "Erro ao atualizar link.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sem expiração";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 via-purple-400 to-purple-500">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Seu Dashboard de Links
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Gerencie e personalize seus links encurtados.
          </p>
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

          {shortenedUrl && (
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-xl font-semibold">{shortenedUrl}</div>
                <button
                  onClick={() => handleCopyToClipboard(shortenedUrl)}
                  className="px-6 py-2 bg-white text-purple-600 rounded-full hover:bg-purple-100 transition"
                >
                  Copiar
                </button>
              </div>
              {!user && showSignupPrompt && (
                <div className="mt-4 text-sm bg-white/10 rounded-lg p-4">
                  Crie uma conta para personalizar seus links e acessar
                  estatísticas avançadas!
                  <Link
                    to="/register"
                    className="ml-4 text-purple-200 hover:text-white transition"
                  >
                    Criar conta agora
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <h2 className="text-2xl font-semibold mb-4">
              Seus Links Encurtados
            </h2>

            {loadingLinks && <p>Carregando seus links...</p>}
            {errorLoadingLinks && (
              <p className="text-red-500">{errorLoadingLinks}</p>
            )}

            {!loadingLinks && !errorLoadingLinks && links.length === 0 && (
              <p>
                Nenhum link encurtado ainda. Comece encurtando um link acima!
              </p>
            )}

            {!loadingLinks && !errorLoadingLinks && links.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="border-b border-white/20">
                    <tr>
                      <th className="text-left p-3 font-semibold">
                        Link Original
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Link Encurtado
                      </th>
                      <th className="text-left p-3 font-semibold">Clicks</th>
                      <th className="text-left p-3 font-semibold">Expiração</th>
                      <th className="text-right p-3 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((link) => (
                      <tr key={link.id} className="border-b border-white/10">
                        <td className="p-3">
                          {editingLinkId === link.id ? (
                            <input
                              type="url"
                              value={editedOriginalUrl}
                              onChange={(e) =>
                                setEditedOriginalUrl(e.target.value)
                              }
                              className="bg-white/5 text-white p-2 rounded focus:outline-none"
                            />
                          ) : (
                            <a
                              href={link.original_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {link.original_url}
                            </a>
                          )}
                        </td>
                        <td className="p-3">
                          {editingLinkId === link.id ? (
                            <input
                              type="text"
                              value={editedShortenedUrl}
                              onChange={(e) =>
                                setEditedShortenedUrl(e.target.value)
                              }
                              className="bg-white/5 text-white p-2 rounded focus:outline-none"
                            />
                          ) : (
                            <div className="flex items-center justify-between">
                              <a
                                href={link.shortened_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {link.shortened_url}
                              </a>
                              <button
                                onClick={() =>
                                  handleCopyToClipboard(link.shortened_url)
                                }
                                className="ml-2 px-3 py-1 bg-white text-purple-600 rounded-full hover:bg-purple-100 transition text-sm"
                              >
                                Copiar
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-3">{link.clicks}</td>
                        <td className="p-3">
                          {formatDate(link.expiration_date)}
                        </td>
                        <td className="p-3 text-right">
                          {editingLinkId === link.id ? (
                            <div className="space-x-2">
                              <button
                                onClick={() => handleSaveEdit(link.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(link)}
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                            >
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {successMessage && (
                    <p className="text-green-500 mt-2 text-center">
                      {successMessage}
                    </p>
                  )}
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
