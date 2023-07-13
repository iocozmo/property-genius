// import UserContext from '@/lib/UserContext';
// import { supabase } from '@/lib/client';
import '@/styles/globals.css';
import theme from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';


// const config = {
//   initialColorMode: 'light',
//   useSystemColorMode: false,
// }

// export const theme = extendTheme({ config })


export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  // const [session, setSession] = useState();
  // const [user, setUser] = useState();
  // const router = useRouter();
  // 1. Import the extendTheme function

  return (
    <ChakraProvider theme={theme}>
      {/* <UserProvider> */}
      <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
      >
        <Component {...pageProps}/>
        </SessionContextProvider>
      {/* </UserProvider> */}
    </ChakraProvider>
  )

  // const saveSession = async () => {
  //   try {
  //     // const {data, error} = await supabase.auth.getSession();
  //     const currentUser = session?.user;
  //     setUser(currentUser ?? null)
  //     setSession(data);
  //     if (currentUser) {
  //       router.push('/dashboard')
  //     }
  //     if (error) {
  //       console.log(error)
  //     }
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }

  // useEffect(() => {
  //   // getAuthSession();
  //   supabase.auth.getSession().then(({ data: { session }}) => saveSession(session))
  //   const {subscription: authListener} = supabase.auth.onAuthStateChange(async (event, session) => saveSession(session))

  //   return () => {
  //     authListener.unsubscribe()
  //   }
  // },[])
  
  // return (
  // <ChakraProvider>
    {/* <UserContext.Provider
    value={{
      user
    }}
    > */}
    {/* <Component {...pageProps} /> */}
      {/* <Component {...pageProps} session={session} /> */}
    {/* </UserContext.Provider> */}
      
  // </ChakraProvider>
  // )
}
