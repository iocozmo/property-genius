import { supabase } from "@/lib/client";
import { Alert, AlertIcon, Button, Center, Container, Flex, FormControl, Input, Text, chakra } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function SignUp() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        "name": '',
        "city": '',
        "email": '',
    })

    useEffect(() => {
        console.log(formData)
    }, [formData])
    
    const changeHandler = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({...prevState, [name]: value}))
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        setError(null)

        try {
            const {error} = await supabase.auth.signInWithOtp({
               email: formData.email,               
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
    
    return (
        <Flex direction={'column'} height={'100vh'} alignItems={'center'} justifyContent={'center'} gap={'6'}>
            <Text as="b" fontSize={'5xl'} color={'black'}>
                PropertyGenius.ai
            </Text>
            <Flex alignItems={'center'} justifyContent={'center'} direction={'column'} width={'100%'}>
                <Container maxW={'2xl'} borderColor={'blue.400'} p={'16'} borderRadius={'4px'} mt={'4'}>                
                    <Flex direction={'column'} gap={'4'}>
                        <Text fontSize={'4xl'} color={'blue.600'} as='b' textAlign={'center'} >
                            Sign Up 
                        </Text>
                        { error && (
                                <Alert status={'error'} mb={'6'}>
                                    <AlertIcon /> 
                                    <Text textAlign={'center'}>{error}</Text>
                                </Alert>
                            )
                        } 
                        {isSubmitted ? (
                            <Text fontSize={'xl'} color={'blue.600'} as='b'>
                                Please check your {formData.email} for login link
                            </Text>
                        ): (

                            <chakra.form onSubmit={submitHandler}>
                            <Flex direction={'column'} gap={'4'}>
                            <Text as='b'>Full Name</Text>
                            <FormControl>
                                <Input 
                                placeholder="Warren Buffet" 
                                variant={'filled'}
                                name={'name'}
                                required
                                onChange={changeHandler}
                                >
                                </Input>
                            </FormControl>
                                <Text as='b'>City</Text>
                            <FormControl>
                                <Input 
                                placeholder="Austin" 
                                variant={'filled'} 
                                name={'city'} 
                                required
                                onChange={changeHandler}
                                >
                                </Input>
                            </FormControl>                                
                                <Text as='b'>Email</Text>
                            <FormControl>
                                <Input  
                                type={'email'}
                                autoComplete={'email'} 
                                placeholder="hello@propertygenius.com" 
                                variant={'filled'} 
                                name={'email'}  
                                required
                                onChange={changeHandler}
                                >
                                </Input>
                            </FormControl>    
                            <Button 
                            colorScheme="messenger" 
                            mt='2'
                            type={'submit'}
                            >
                                Sign Up
                            </Button>
                            </Flex>
                            </chakra.form>

                        )}
                        
                    </Flex>            
            </Container>
            <Container>
                <Center>
                    {/* <Image boxSize={'200px'} src="buy_house.svg" /> */}
                </Center>
            </Container>
            
            </Flex>
        </Flex>
    );
}