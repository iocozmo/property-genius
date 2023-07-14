import Navbar from '@/components/navbar';
import { useSession } from '@/context/user';
import { supabase } from '@/lib/client';
import { Button, Container, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';
const inter = Inter({ subsets: ['latin'] })

// export default function Home({session}) {
  export default function Home() {
  const supabaseClient = useSupabaseClient();
  console.log(supabaseClient)
  const user = useUser()
  console.log("User from useUser()", user)
  const session = useSession();
  console.log("session", session)  
  
  const router = useRouter()

  async function handleNavigateToDashboard() {
    // console.log('CLICKED OPEN APPLICATION')
    if (user) {
      if (user['role'] === 'authenticated')  {
        router.push('/dashboard')      
      }  
    }
     else {
      router.push('/login')
    }
  }

  const checkUserSession = async () => {
    try {
      const {data, error} = await supabase.auth.getSession();
      console.log("DATA FROM SESSIOON: ", data)
      if (data.session.user) {
        router.push('/dashboard')
      }
      
    } catch (e) {
      console.log(e)
    }
  } 
  
  return (
    <>
      <Head>
      </Head>
      <Navbar isLanding={true} />
      <Flex px={'16'} direction={'column'} width={'100%'}>
        <Heading as='h1' fontSize={'5xl'} textAlign={'center'} mt={'16'} >
          Invest Smarter with <Heading as='span' color='messenger.500' size='5xl' >PropertyGenius.ai</Heading>
        </Heading>
        <Container mt={'6'} maxW={'4xl'}>
          <Text fontSize={'xl'} textAlign={'center'} >
          With PropertyGenius.ai, you can analyze properties and save them for future reference. Plus, our GPT integration allows you to ask questions about your deals and get instant answers. Start making smarter investment decisions today.
          </Text>
        </Container>
        <Flex alignItems={'center'} justifyContent={'center'} mt='6'>
          <Button colorScheme='messenger'
          onClick={handleNavigateToDashboard}
          >
            Open Application
          </Button>
        </Flex>
        <Flex  direction={'row'} alignItems={'center'} justifyContent={'space-between'} px={'60'}>
          <Image boxSize={'375px'} src="buy_house.svg" />
          <Image boxSize={'425px'} src="calculator.svg" />
        </Flex>
      </Flex>
    </>
  )
} 

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session)
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
  }

  return {
    props: {
    },
  }
}