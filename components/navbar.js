import { supabase } from "@/lib/client";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

function handleLogin() {
    
}

export default function Navbar({isLanding}) {
    async function signOut() {
        await supabase.auth.signOut();
        router.push('/')
    }
    
    const router = useRouter();
    
    return (
        <Flex
        direction={'row'}
        justify={'space-between'}
        pt='16'
        px='16'
        >
            <Flex>
                <Text fontSize={'3xl'} as='b'>
                    Property Genius
                </Text>
            </Flex>
            {isLanding ? 
                <Flex gap={'2'}>
                    <Button  colorScheme="messenger" variant={'outline'}
                    onClick={() => router.push('/login')}
                    >    
                        Sign in
                    </Button>
                    <Button colorScheme="messenger"
                    onClick={() => router.push('/signup')}
                    >
                        Sign up
                    </Button>
                </Flex> :
                <Flex>                        
                    <Button colorScheme="messenger"
                    onClick={signOut}
                    >
                        Sign out
                    </Button>
                </Flex>
            }


        </Flex>
    );
}