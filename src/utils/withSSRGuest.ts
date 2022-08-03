import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

// verifica se o usuario é convidado
export function withSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
  
        //verifica se esta logado
        // Redireciona o usuario para o dashboard se ja estiver logado.
        
        if ( cookies['nextauth.token']) {
            return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            }
            }
        }

        return await fn(ctx)
    }
}