import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

//verifica se o usuario é autenticado
export function withSSRAuth<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
  
        //verifica se não esta logado
        // Redireciona o usuario para a pagina de login se não estiver logado.
        
        if ( !cookies['nextauth.token']) {
            return {
            redirect: {
                destination: '/', //pagina de login
                permanent: false,
            }
            }
        }

        return await fn(ctx)
    }
}