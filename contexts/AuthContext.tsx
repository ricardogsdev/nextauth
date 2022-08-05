import { createContext, ReactNode, useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie} from 'nookies'
import Router from "next/router";
import { api } from "../src/services/apiClient";



type User = {
    email: string;
    permissions: string[];
    roles: string[];
};

type SignInCredentials = {
    email: string;
    password: string;
}

type AuthContextData = {
  singIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;  
};

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel 

export function signOut() {
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')

    authChannel.postMessage('signOut');

    Router.push('/')   
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() => {
        // Deslogando de todas as páginas.
        authChannel = new BroadcastChannel('auth')

        authChannel.onmessage = (message) => {
           switch (message.data) {
            case 'signOut':
                Router.push('/');
                break;
            default:
                break;
           }
        }
    }, [])

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()

        if (token) {
            // Buscando informações do usuario, sempre que ele faz o login
            api.get('/me').then(response => {
                const { email, permissions, roles } = response.data
                setUser({email, permissions, roles})
            })
            .catch(() => {
                signOut();
            })
        }

    }, [])

    async function singIn({ email, password }: SignInCredentials) {
        try {
            const response = await api.post('sessions', {
                email,
                password
            })

            const { token, refreshToken, permissions, roles } = response.data;

            // sessionStorage
            // localStorage
            // cookies

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //  30 days  //tempo que ficara salvo
                path: '/'
            });

            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30, //  30 days  //tempo que ficara salvo
                path: '/'
            })
    
            setUser({
                email,
                permissions,
                roles
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;// atualizando os headers do axios com novo token

            Router.push('/dashboard'); // enviando o usuario para pagina de dashboard

            

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider value={{ singIn, signOut, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    )
}