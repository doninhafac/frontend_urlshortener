// context/AuthContext.js
import { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api'; // Sua instância do axios
import { auth, signInWithGoogle } from '../services/firebaseConfig'; // Importe do seu arquivo Firebase
import { User as FirebaseUser } from 'firebase/auth'; // Importante para tipagem

interface User {
    id: number; // Ou number, dependendo do seu backend
    name: string;
    email: string;
    perfil?: string; // Adicione outros campos do usuário, se necessário
    username?: string; // Adicione, se você tiver username
}

interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => Promise<void>; // Função de login do Google
    signOut: () => Promise<void>;  // signOut agora é assíncrono
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
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // 1. Obter o token do Firebase
                const token = await firebaseUser.getIdToken();

                // 2. Verificar se o token já está no localStorage (evitar chamada repetida)
                const storedToken = localStorage.getItem('@CoisaLinks:token');
                if (storedToken === token) {
                  const storedUser = localStorage.getItem('@CoisaLinks:user');
                  if (storedUser){
                    setUser(JSON.parse(storedUser));
                    setLoading(false);
                    return; // Sai do useEffect se o token já estiver no localStorage
                  }
                }


                // 3. Enviar o token para o backend (se não estiver no localStorage)
                try {
                    const response = await api.post('/autenticacao/google-login/', { id_token: token });
                    const { token: backendToken, usuario } = response.data;

                    // 4. Armazenar o token e os dados do usuário
                    localStorage.setItem('@CoisaLinks:token', backendToken);
                    localStorage.setItem('@CoisaLinks:user', JSON.stringify(usuario));
                    api.defaults.headers.authorization = `Bearer ${backendToken}`;
                    setUser(usuario);
                } catch (error) {
                    console.error('Erro ao validar o token do Firebase no backend:', error);
                    // Trate o erro, por exemplo, redirecionando para uma página de erro
                    // ou mostrando uma mensagem ao usuário.
                    setUser(null); // Desloga o usuário em caso de erro.
                    localStorage.removeItem('@CoisaLinks:token');
                    localStorage.removeItem('@CoisaLinks:user');
                }
            } else {
                // Usuário não está logado no Firebase
                setUser(null);
                localStorage.removeItem('@CoisaLinks:token');
                localStorage.removeItem('@CoisaLinks:user');
                api.defaults.headers.authorization = '';
            }
            setLoading(false);
        });

        // Limpar a inscrição quando o componente for desmontado
        return () => unsubscribe();
    }, []);


    const handleSignInWithGoogle = async () => {
        try {
            const result = await signInWithGoogle();
            if (result) { // Verifica se o login com Google foi bem-sucedido
                const { token, usuario } = result;
                localStorage.setItem('@CoisaLinks:token', token);
                localStorage.setItem('@CoisaLinks:user', JSON.stringify(usuario));
                api.defaults.headers.authorization = `Bearer ${token}`;
                setUser(usuario);
            }
        } catch (error) {
            console.error('Erro ao fazer login com o Google:', error);
            // Trate o erro aqui, por exemplo, exibindo uma mensagem para o usuário
        }
    };

    const signOut = async () => { // signOut agora é assíncrono
        try {
            await auth.signOut(); // Desloga do Firebase
            localStorage.removeItem('@CoisaLinks:token');
            localStorage.removeItem('@CoisaLinks:user');
            api.defaults.headers.authorization = '';
            setUser(null);
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            // Trate o erro, se necessário
        }
    };
    return (
        <AuthContext.Provider value={{ user, signInWithGoogle: handleSignInWithGoogle, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}