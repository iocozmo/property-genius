import Navbar from '@/components/navbar'
import { Button, Container, Flex, Heading, Image, Text } from '@chakra-ui/react'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
const inter = Inter({ subsets: ['latin'] })

function handleOpenApp() {
  
}

export default function Home() {
  const router = useRouter()
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
          onClick={() => router.push('/dashboard')}
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
