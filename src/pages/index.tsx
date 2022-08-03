import { GetServerSideProps } from 'next';
import { parse } from 'node:path/win32';
import { parseCookies } from 'nookies';
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import styles from '../styles/Home.module.css'
import { withSSRGuest } from '../utils/withSSRGuest';

export default function Home(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { singIn } = useContext(AuthContext)

  async function handleSubmit(event: FormEvent){
    event.preventDefault();

    const data = {
      email,
      password
    }

    await singIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h1 className={styles.title}>Login</h1>

      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
      <button type="submit">Entrar</button>
    </form>
  )
}

// Verifica se o usuario é convidado
export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});


