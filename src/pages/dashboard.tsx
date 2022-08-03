import { useContext, useEffect } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { api } from "../services/api"
import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
    const { user } = useContext(AuthContext)

    useEffect(() => {
            api.get('/me')
                .then(response => {console.log(response)})
                .catch(err => console.log(err));
    }, [])

    return (
        <div>
            <h1>Dashboard </h1>
            <h4>User: {user?.email}</h4>
        </div>
    )
}

// Verifica se o usuario esta autenticado
export const getServerSideProps = withSSRAuth(async (ctx) => {
    return {
      props: {}
    }
  });