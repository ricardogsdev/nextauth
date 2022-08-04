import { setupAPIClient } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Metrics() {
    

    return (
        <div>
            <h1>Metrics </h1>
            
        </div>
    )
}

// Verifica se o usuario esta autenticado e se pode acessar a pagina
export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/me');

    return {
      props: {}
    }
  }, {
    // Opcional, envia as permissões para acessar a pagina.
    permissions: ['metrics.list'],
    roles: ['administrator'],
  });