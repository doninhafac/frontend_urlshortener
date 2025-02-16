import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


const Dashboard = () => {
    const auth = useContext(AuthContext);

    if (!auth) {
        return <p>Erro: AuthContext não está definido.</p>;
    }

    const { user, signOut } = auth;

    return (
        <div>
            {user ? (
                <>
                    <h1>Bem-vindo, {user.name}!</h1>
                    <button onClick={signOut}>Sair</button>
                </>
            ) : (
                <p>Você não está logado.</p>
            )}
        </div>
    );
};

export default Dashboard;
