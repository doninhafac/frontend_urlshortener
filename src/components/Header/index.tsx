import { Link } from 'react-router-dom';
import { Link2, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export function Header() {
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    return (
        <header className="absolute w-full p-4 z-10">
            <nav className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2 text-white">
                    <Link2 className="h-6 w-6" />
                    <span className="text-xl font-bold">Coisa Links</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6 text-white">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
                            >
                                <User className="h-5 w-5" />
                                <span>{user.name}</span>
                            </button>

                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                                    <Link to="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-purple-50">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={signOut}
                                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-50"
                                    >
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition"
                            >
                                Entrar
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-full bg-white text-purple-600 hover:bg-purple-100 transition"
                            >
                                Criar Conta
                            </Link>
                        </>
                    )}
                </div>

                <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </nav>

            {isMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white/10 backdrop-blur-lg shadow-lg rounded-b-lg md:hidden">
                    <div className="flex flex-col p-4 space-y-3">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-white hover:text-purple-200">
                                    Dashboard
                                </Link>
                                <button onClick={signOut} className="text-white hover:text-purple-200 text-left">
                                    Sair
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-full bg-white text-purple-600 hover:bg-purple-100 transition"
                                >
                                    Criar Conta
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
