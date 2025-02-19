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
    signInWithGoogle: () => Promise<void>;
    signInWithEmailPassword: (email: string, password: string) => Promise<void>; // New function for email/password login
    signOut: () => Promise<void>;
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
        const loadStoredUser = () => {
            const storedToken = localStorage.getItem('@CoisaLinks:token');
            const storedUser = localStorage.getItem('@CoisaLinks:user');

            if (storedToken && storedUser) {
                api.defaults.headers.authorization = `Bearer ${storedToken}`;
                setUser(JSON.parse(storedUser));
            }
        };

        loadStoredUser(); // Load from localStorage initially
        setLoading(false); // Initial loading complete after attempting to load from storage

        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();

                const storedFirebaseToken = localStorage.getItem('@CoisaLinks:firebaseToken'); // Store firebase token separately
                if (storedFirebaseToken === token) {
                    return; // Avoid repeated backend call if firebase token is the same
                }
                localStorage.setItem('@CoisaLinks:firebaseToken', token); // Store firebase token

                try {
                    const response = await api.post('/autenticacao/google-login/', { id_token: token });
                    const { token: backendToken, usuario } = response.data;

                    localStorage.setItem('@CoisaLinks:token', backendToken);
                    localStorage.setItem('@CoisaLinks:user', JSON.stringify(usuario));
                    api.defaults.headers.authorization = `Bearer ${backendToken}`;
                    setUser(usuario);
                } catch (error) {
                    console.error('Erro ao validar o token do Firebase no backend:', error);
                    setUser(null);
                    localStorage.removeItem('@CoisaLinks:token');
                    localStorage.removeItem('@CoisaLinks:user');
                    localStorage.removeItem('@CoisaLinks:firebaseToken'); // Clear firebase token as well
                }
            } else {
                // Firebase user logged out, but check if we have user from other login methods
                if (!localStorage.getItem('@CoisaLinks:user')) { // Only clear if no user from other methods
                    setUser(null);
                    localStorage.removeItem('@CoisaLinks:token');
                    localStorage.removeItem('@CoisaLinks:user');
                    localStorage.removeItem('@CoisaLinks:firebaseToken'); // Clear firebase token as well
                    api.defaults.headers.authorization = '';
                }
            }
            setLoading(false); // Ensure loading is set to false after Firebase auth check
        });

        return () => unsubscribe();
    }, []);


    const handleSignInWithGoogle = async () => {
        try {
            const result = await signInWithGoogle();
            if (result) {
                const { token: firebaseToken } = result; // Get Firebase token from result
                localStorage.setItem('@CoisaLinks:firebaseToken', firebaseToken); // Store firebase token

                try {
                    const response = await api.post('/autenticacao/google-login/', { id_token: firebaseToken });
                    const { token: backendToken, usuario } = response.data;
                    localStorage.setItem('@CoisaLinks:token', backendToken);
                    localStorage.setItem('@CoisaLinks:user', JSON.stringify(usuario));
                    api.defaults.headers.authorization = `Bearer ${backendToken}`;
                    setUser(usuario);
                } catch (backendError) {
                    console.error('Erro ao validar o token do Firebase no backend:', backendError);
                    // Handle backend error after successful Google sign-in
                    localStorage.removeItem('@CoisaLinks:firebaseToken'); // Clear firebase token on backend error
                    throw backendError; // Re-throw to be caught by component if needed
                }
            }
        } catch (googleSignInError) {
            console.error('Erro ao fazer login com o Google:', googleSignInError);
            // Handle Google Sign-In error
            localStorage.removeItem('@CoisaLinks:firebaseToken'); // Clear firebase token on google sign-in error
            throw googleSignInError; // Re-throw to be caught by component if needed
        }
    };


    const handleSignInWithEmailPassword = async (email, password) => {
        console.log('signInWithEmailPassword called', email, password);
        setLoading(true);
        try {
            const response = await api.post('/autenticacao/login/', { username_or_email: email, password }); // Corrected key to username_or_email
            console.log('Backend response status:', response.status); // Log status
            console.log('Backend response data:', response.data);     // Log data
            const { token: backendToken, usuario } = response.data;
    
            localStorage.setItem('@CoisaLinks:token', backendToken);
            localStorage.setItem('@CoisaLinks:user', JSON.stringify(usuario));
            api.defaults.headers.authorization = `Bearer ${backendToken}`;
            setUser(usuario);
        } catch (error) {
            console.error('Erro ao fazer login com e-mail e senha:', error);
            console.error('Login failed:', error); // Keep this for the AxiosError
            // ... rest of your error handling ...
        } finally {
            setLoading(false);
        }
    };


    const signOut = async () => {
        try {
            await auth.signOut(); // Firebase sign out - this might resolve even if not signed in via firebase
        } catch (firebaseSignOutError) {
            console.error("Erro ao fazer logout do Firebase (pode não estar logado via Firebase):", firebaseSignOutError);
            // It's okay if Firebase sign-out fails if user didn't log in with Firebase
        }
        localStorage.removeItem('@CoisaLinks:token');
        localStorage.removeItem('@CoisaLinks:user');
        localStorage.removeItem('@CoisaLinks:firebaseToken'); // Also clear firebase token on sign out
        api.defaults.headers.authorization = '';
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, signInWithGoogle: handleSignInWithGoogle, signInWithEmailPassword: handleSignInWithEmailPassword, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}