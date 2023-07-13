import { supabase } from "@/lib/client";
import { Alert, AlertIcon, Button, Center, Container, Flex, FormControl, Input, Text, chakra } from "@chakra-ui/react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_KEY
)

export default function SignUp() {
    // const toast = useToast();
    const router = useRouter();
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
    
    // Handle form fields updates
    const changeHandler = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({...prevState, [name]: value}))
    }

    // Handle submit: Handle signing up user with Supabase OTP & Handle routing user to Stripe checkout
    const submitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        setError(null)    
        try {
            // Sign up user with Supabase OTP
            const {error} = await supabase.auth.signInWithOtp({
               email: formData.email,
               options: {
                data: {
                    name: formData.name,
                    city: formData.city
                }
               }               
            })
            if (error) {
                console.log(error)
                setError(error.message)
            }             
            // Get user_id for newly signed up user
            let { data: User, e } = await supabase
            .from('Users')
            .select()
            .eq('email', formData.email)
            .single()
            const userId = User['user_id']           
            const config = {                
                headers: { originUrl: '/signup'}
            };
            // Create stripe checkouot sessioon
            const res = await axios.post('/api/stripe-checkout', {email: formData.email, user_id: userId}, config)             
            
            // Get stripe checkout url from Stripe checkout session
            const url = res.data['url'];
            
            // Send user to Stripe checkout session
            router.push(url)
        } catch (error) {
            console.log(error)
            setError(error.message)
        } 
        setIsLoading(false)
        // try {
        //     const stripe = await stripePromise;
        //     const response = await fetch("/api/stripe-checkout", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     }).then(() => console.log("RESPOONSEE", response));
        //     // const {sessionId} = await response.json();
        //     // console.log("sessionId", sessionId)
        //     // const {error} = await stripe.redirectToCheckout({
        //     //     sessionId
        //     // })
        //     if (error) {
        //         console.log("ERROR", error)
        //         router.push("http://localhost:3000/login-failed")
        //     }
        // } catch (err) {
        //     console.log("Error in creating session", err);
        //     router.push("http://localhost:3000/login-failed")
        // }

        

        // try {
        //     const {error} = await supabase.auth.signInWithOtp({
        //        email: formData.email,
        //        options: {
        //         data: {
        //             name: formData.name,
        //             city: formData.city
        //         }
        //        }               
        //     })
        //     if (error) {
        //         console.log(error)
        //         setError(error.message)
        //     } else {    
        //         setIsSubmitted(true)
        //     }
        // } catch (error) {
        //     console.log(error)
        //     setError(error.message)
        // } finally {
        //     setIsLoading(false)
        // }
    };
    
    return (
        <Flex direction={'column'} height={'100vh'} alignItems={'center'} justifyContent={'center'} gap={'6'}>
            <Text as="b" fontSize={'5xl'} color={'black'}>
                PropertyGenius.ai
            </Text>
            {/* <chakra.form action="/api/stripe-checkout" method="POST">
                <Button type="submit" role="link">
                    Stripe Checkout
                </Button>
            </chakra.form>             */}
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