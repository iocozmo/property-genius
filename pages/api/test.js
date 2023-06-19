import Navbar from "@/components/navbar";
import { supabase } from "@/lib/client";
import { Button, Card, CardBody, CardHeader, Divider, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const calculations = [
    {
        "propertyName": "San Antonio",
        "propertyPrice": 100,
        "propertyLocation": "Nashville",
        "propertyRate": "5%"
    },
    {
        "propertyName": "San Antonio",
        "propertyPrice": 100,
        "propertyLocation": "Nashville",
        "propertyRate": "5%"
    },
    {
        "propertyName": "San Antonio",
        "propertyPrice": 100,
        "propertyLocation": "Nashville",
        "propertyRate": "5%"
    },
    {
        "propertyName": "San Antonio",
        "propertyPrice": 100,
        "propertyLocation": "Nashville",
        "propertyRate": "5%"
    },
    {
        "propertyName": "San Antonio",
        "propertyPrice": 100,
        "propertyLocation": "Nashville",
        "propertyRate": "5%"
    },
    {
        "propertyName": "San Antonio",
        "propertyPrice": 100,
        "propertyLocation": "Nashville",
        "propertyRate": "5%"
    },
    {
        "propertyName": "San Antonio",
        "propertyPrice": 100,
        "propertyLocation": "Nashville",
        "propertyRate": "5%"
    },
    {
        "propertyName": "San Antonio",
        "propertyPrice": 100,
        "propertyLocation": "Nashville",
        "propertyRate": "5%"
    },
    {
        "propertyName": "San Antonio",
        "propertyPrice": 100,
        "propertyLocation": "Nashville",
        "propertyRate": "5%"
    },
    
]

export default function Test() {
    // const [hasCalculations, ]
    const [user, setUser] = useState(null)
    const [hasCalculations, setCalculations] = useState()
    useEffect(() => {
        setCalculations(false)
        // fetchUser()
    }, [])
    async function fetchProfile() {
        const userData = await supabase.auth.user()
        if (!userData) {
            router.push('/login')
        } else {
            
        }
    }
    return (
        <>
        <Navbar isLanding={false} />
        <Flex width={'100%'} px={'16'} direction={'column'}>
            <Flex direction={'column'} justifyContent={'space-between'} mt={'16'} > 
                <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Heading>2 Your Calculators</Heading>
                    <Button> + New calculation</Button>                    
                </Flex>
                <Flex justifyContent={'flex-start'}>
                <Text fontSize={'2xl'}>Search existing property calculations or create new ones with our property AI tool</Text>                
                </Flex>
                <Divider mt={'4'}/>
            </Flex>
            <Flex>
            <SimpleGrid columns={6} spacing={10} >
                {/* <Divider /> */}
                {/* <Flex alignItems={'start'}> */}
                {calculations.map((item) => {
                    return (
                        <Card size={'lg'} p='2' m='4'>
                            <CardHeader>
                                <Heading size={'md'}>{item.propertyName}</Heading>
                                </CardHeader>
                            <CardBody>
                                <Flex direction={'column'}>
                                    <Text>{item.propertyLocation}</Text>
                                    <Text>{item.propertyPrice}</Text>
                                    <Text>{item.propertyRate}</Text>
                                </Flex>
                            </CardBody>
                        </Card>
                    )
                })}

                {/* </Flex>   */}
                </SimpleGrid>              
            </Flex>

        </Flex>
        </>        
    )
}