import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { api } from "../services/api"; // Certifique-se de que a API está corretamente importada

const firebaseConfig = {
  apiKey: "AIzaSyAWjTPAABQlSTxakbGNhOyD3_rVNbOr6Q4",
  authDomain: "urlshortnerad.firebaseapp.com",
  projectId: "urlshortnerad",
  storageBucket: "urlshortnerad.firebasestorage.app",
  messagingSenderId: "316763126375",
  appId: "1:316763126375:web:8f4cad71ca0c9255b332c2",
  measurementId: "G-W4LX3ZT2VF",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    name: string;
    username: string;
    email: string;
    perfil?: string;
  };
}

const signInWithGoogle = async (): Promise<AuthResponse | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user: User = result.user;
    const id_token = await user.getIdToken(); // Obtém o token do Firebase

    console.log("Token do Firebase:", id_token); // Adicione este log para verificar o token

    // Enviar para o backend para armazenar no banco
    const response = await api.post<AuthResponse>("/autenticacao/google-login/", {
      id_token,
    });

    console.log("Usuário autenticado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro no login com Google:", error);
    return null;
  }
};


export { auth, provider, signInWithGoogle };
