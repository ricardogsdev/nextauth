import { useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { Can } from "../components/Can"
import { useCan } from "../hooks/useCan"
import { setupAPIClient } from "../services/api"
import { api } from "../services/apiClient"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
    const { user, signOut, isAuthenticated } = useContext(AuthContext)

   
    useEffect(() => {
            api.get('/me')
                .then(response => {console.log(response)})
                .catch(err => console.log(err));
    }, [])

    return (
        <div>
            <h1>Dashboard </h1>
            <h4>User: {user?.email}</h4>

            <button onClick={signOut}>Sing out</button>

            <Can permissions={['metrics.list']}>
                <div> Métricas </div>
            </Can>
            
        </div>
    )
}

// Verifica se o usuario esta autenticado
export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/me');

    return {
      props: {}
    }
  });