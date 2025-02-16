import { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('@CoisaLinks:user');
        const token = localStorage.getItem('@CoisaLinks:token');

        if (storedUser && token) {
            api.defaults.headers.authorization = `Bearer ${token}`;
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const response = await api.post('/autenticacao/login/', {
                email,
                password,
            });

            const { token, user: userData } = response.data;

            localStorage.setItem('@CoisaLinks:token', token);
            localStorage.setItem('@CoisaLinks:user', JSON.stringify(userData));

            api.defaults.headers.authorization = `Bearer ${token}`;
            setUser(userData);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    };

    const signOut = () => {
        localStorage.removeItem('@CoisaLinks:token');
        localStorage.removeItem('@CoisaLinks:user');
        api.defaults.headers.authorization = '';
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, signIn, signOut, loading }}>{children}</AuthContext.Provider>;
}
