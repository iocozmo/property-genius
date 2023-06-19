import { supabase } from "@/lib/client";
import { Alert, AlertIcon, Button, Center, Container, Flex, FormControl, Image, Input, Text, chakra } from "@chakra-ui/react";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState(null)
    
    const submitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null)
        
        try {
            const {error} = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: 'localhost:3000/dashboard'
                }
            })
            if (error) {
                setError(error.message)
            } else {
                setIsSubmitted(true)
            } 
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    };
    
    
    const changeHandler = (event) => {
        setEmail(event.target.value)
    }
    
    async function signIn() {
        const {error, data} = await supabase.auth.signIn({
            email
        })
        if (error) {
            console.log({error})
        } else {
            setSubmitted(true)
        }
        if (submitted) {
            return (
                <Center>
                    <Flex>
                        <Heading>Pleasee check your email to sign in</Heading>
                    </Flex>
                </Center>
            )
        }
    }
    return (
        <Flex direction={'column'} height={'100vh'} width={'100%'} alignItems={'center'} justifyContent={'center'} gap={'6'}>
            <Text as="b" fontSize={'5xl'} color={'black'}>
            PropertyGenius.ai
            </Text>
            <Container maxW={'lg'} border={'4px'} borderColor={'blue.400'} p={'6'} borderRadius={'4px'}>                
            <Flex direction={'column'} gap={'4'}>
                {error && (
                    <Alert status={'error'} mb={'6'}>
                        <AlertIcon /> 
                        <Text textAlign={'center'}>{error}</Text>
                    </Alert>
                )}
            {isSubmitted ? (
                <Text fontSize={'xl'} color={'blue.600'} as='b'>
                    Please check your {email} for login link
                </Text>
            ): (            
                <chakra.form onSubmit={submitHandler}>
                        <Flex direction={'column'} gap={'4'}>
                            <FormControl>
                                <Text fontSize={'xl'} color={'blue.600'} as='b'>
                                    Login with your magic link 
                                </Text>
                                <Input 
                                placeholder="hello@propertygenius.com"
                                name={'email'}
                                type={'email'}
                                autoComplete={'email'}
                                required
                                value={email}
                                onChange={changeHandler}
                                mt={'4'}
                                >
                                </Input>
                            </FormControl>
                            <Button                         
                            type={'submit'}
                            colorScheme="messenger"
                            isLoading={isLoading}
                            >
                                Send Email
                            </Button>                        
                        </Flex>
                </chakra.form>

            )}                
            </Flex>            
            </Container>
            <Image boxSize={'300px'} src="buy_house.svg" />
        </Flex>
    );
}