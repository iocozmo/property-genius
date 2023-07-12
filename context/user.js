import { supabase } from "@/lib/client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const Context = createContext();

const Provider = ({children}) => {
    // const [session, setSession] = useState(supabase.auth.getSession());
    const [session, setSession] = useState()
    const [user, setUser] = useState()
    //  const saveSession = (session) => {
    //     try {
    //         const currentUser = session?.user;
    //         setUser(currentUser ?? null)
    //         setSession(session);                        
    //     } catch(e) {
    //         console.log(e);
    //     }
    // }

    // useEffect(() => {
    //     supabase.auth.getSession().then(({ data: { session }}) => saveSession(session))
    //     supabase.auth.onAuthStateChange(() => {
    //         supabase.auth.getSession().then(({ data: { session }}) => saveSession(session))
    //     })
    // }, [])

    useEffect(() => {
        const getUserProfile = async () => {
            const session = await supabase.auth.getSession();
            setSession(session);
            const userData = session.data.session?.user;
            // setUser(user);
            if (userData) {
                // const {data: properties} = await supabase
                // .from('Properties')
                // .select('*')
                // .eq('user_id', user.id)

                const {data} = await supabase
                .from('Users')
                .select('*')
                .eq('user_id', userData?.id)
                
                setUser({
                    ...userData,
                    ...data                    
                })
            }            
        }
        getUserProfile();
        supabase.auth.onAuthStateChange(() => {
            supabase.auth.onAuthStateChange((event, session) => {
                // if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
                //   // delete cookies on sign out
                //   const expires = new Date(0).toUTCString()
                //   document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`
                //   document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`
                // } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                //   const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
                //   document.cookie = `my-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
                //   document.cookie = `my-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
                // }
                getUserProfile()
              })              
            }

        );

    },[]);

    useEffect(() => {
        axios.post('/api/set', {
            // event: user ? 'SIGNED_IN' : 'SIGNED_OUT',
            // session: session
        })
    },[user])
    
    const exposed = {
        session, 
        user,
    }

    return (
        <Context.Provider value={exposed}>
            {children}
        </Context.Provider>
    )
}

export const useSession = () => useContext(Context)

export default Provider;