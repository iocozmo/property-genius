import '@/styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { supabase } from '../lib/client';


export default function App({ Component, pageProps }) {
  const router = useRouter();
  // const user = supabase.auth.getUser()

  useEffect(() => {
    const {data: authListener} = supabase.auth.onAuthStateChange(
      (event, session) => {
        // handleAuthSession(event, session);
        // if (event == 'SIGNED_IN')
      }
    )
  })

  return (
  <ChakraProvider>
      <Component {...pageProps} />
  </ChakraProvider>
  )
}
