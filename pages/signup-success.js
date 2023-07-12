import { supabase } from "@/lib/client";
import { Alert, AlertIcon, Center, Container, Flex, Image, Spinner, Text } from '@chakra-ui/react';
import axios from "axios";
import { useEffect, useState } from "react";


function signUpSuccess() {
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  
  // getSupabaseData: get user email from Supabase with user_id in query params
  async function getUserEmail(userId) {
    const { data, error: getUserError } = await supabase
      .from('Users')
      .select()
      .eq('user_id', userId)
      .single();
    // console.log('Email retrieved', data['email']);
    if (getUserError) {
      console.log('ERRROR')
      setError('Error getting user')
      setIsLoading(false);
      return;
    }
    setEmail(data['email']);
    setIsLoading(false);
    axios.post('/api/update-stripe-user', { user_id: userId });
  }

  useEffect(() => {    
    
    // Get user_id from query params on load
    const query = new URLSearchParams(window.location.search);
    const idParams = query.getAll('id');
    if (query.get('success')) {
      const userId = idParams[0];
      getUserEmail(userId);
      // Update newly signed up user's Supabase row to include their stripe_id
      // axios.post('/api/update-stripe-user', { user_id: userId });
    }
  }, []);

  if (error) {
    <Flex direction={'column'} height={'100vh'} width={'100%'} alignItems={'center'} justifyContent={'center'} gap={'6'}>
    <Text as="b" fontSize={'5xl'} color={'black'}>
      PropertyGenius.ai
    </Text>
    <Container maxW={'lg'} border={'4px'} borderColor={'blue.400'} p={'6'} borderRadius={'4px'}>
      <Center>
        <Alert status={'error'} mb={'6'}>
            <AlertIcon /> 
            <Text textAlign={'center'}>{error}</Text>
        </Alert>
      </Center>        
    </Container>
    <Image boxSize={'300px'} src="buy_house.svg" />
  </Flex>
  }

  else if (isLoading) {
    return (
      <Flex direction={'column'} height={'100vh'} width={'100%'} alignItems={'center'} justifyContent={'center'} gap={'6'}>
        <Text as="b" fontSize={'5xl'} color={'black'}>
          PropertyGenius.ai
        </Text>
        <Container maxW={'lg'} border={'4px'} borderColor={'blue.400'} p={'6'} borderRadius={'4px'}>
          <Center>
              <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          </Center>        
        </Container>
        <Image boxSize={'300px'} src="buy_house.svg" />
      </Flex>
    );
  }

  return (
    <Flex direction={'column'} height={'100vh'} width={'100%'} alignItems={'center'} justifyContent={'center'} gap={'6'}>
      <Text as="b" fontSize={'5xl'} color={'black'}>
        PropertyGenius.ai
      </Text>
      <Container maxW={'xl'} border={'4px'} borderColor={'blue.400'} p={'6'} borderRadius={'4px'}>
        <Flex direction={'column'} gap={'4'}>
          {!error && (
            <>
            <Text fontSize={'2xl'} as='b' color={'blue.600'} >
              Congrats! Your account has been created.
            </Text>
            <Text fontSize={'xl'} >
              Please check your <b>{email}</b> to confirm your account.
            </Text>
            </>
            
          )}
          {error && (
            <Alert status={'error'} mb={'6'}>
            <AlertIcon /> 
              <Text textAlign={'center'}>{error}</Text>
            </Alert>
          )}
          {/* <Text fontSize={'2xl'} as='b' color={'blue.600'} >
            Congrats! Your account has been created.
          </Text>
          <Text fontSize={'xl'} >
            Please check your <b>{email}</b> to confirm your account.
          </Text> */}
        </Flex>
      </Container>
      <Image boxSize={'300px'} src="buy_house.svg" />
    </Flex>
  );
};

export default signUpSuccess