import ChatContainer from "@/components/ChatContainer";
import { supabase } from "@/lib/client";
import { ArrowRightIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Card, CardBody, Center, Divider, Flex, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputRightElement, Select, Stack, StackDivider, Text } from "@chakra-ui/react";
// import { error } from "console";
import { useEffect, useState } from "react";

function NoProperties({hasProperties, propertyCallBack}) {
  if (!hasProperties) {
    return (
      <Flex height={'100%'} alignItems={'center'} justifyContent={'center'}> 
        <Center>
          <Button  width={'100%'} height={'50px'} onClick={() => propertyCallBack()} colorScheme="blackAlpha" variant={'outline'}>
            + Add New Property
          </Button>
        </Center>
      </Flex>
    )
  }   
}

function PropertyChat({hasChat}) {
  if (hasChat) {
    return (
      <Flex flexGrow={1} direction={'column'}>
        <Flex height={'750px'} width={'100%'}  alignItems={'center'} justifyContent={'center'}>          
            <Heading size={'lg'}>Chat with your property here!</Heading>
        </Flex>
        <Flex flex={1}> 
          <Box  width={'100%'} position="sticky" bottom="0" bg="white" zIndex="1" height={'75px'} bgColor={'white'} mx={'4'} mb={'2'}>
            <InputGroup size='lg'>
              <Input
                  variant={
                      'filled'
                  }
                  // pr='4.5rem'                    
                  placeholder='Chat with your property here'
              />
              <InputRightElement>    
              <IconButton
              colorScheme='messenger'
              icon={<ArrowRightIcon />}
              >
                  
              </IconButton>        
              </InputRightElement>
              </InputGroup>              
          </Box>
        </Flex>
      </Flex>          
)
  }

}

function PropertyForm({isNew, newPropertyCallback}) {
  if (isNew) {
    return (
      <Flex direction={'column'} p={'4'}>
              <Heading textAlign={'center'} size="lg" mb={'4'}>Add Your New Property</Heading>
              <Heading size="md" mb={'4'}>Enter Your Property Details</Heading>
                      <FormControl mt={4}>
                        <FormLabel>Property Name</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl mt={4}>
                        <FormLabel>Property Price ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Monthly Rent</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Down Payment (%)</FormLabel>
                        <Select placeholder='Select Percent'>
                          <option>0%</option>
                          <option>5%</option>
                          <option>10%</option>
                          <option>15%</option>
                          <option>20%</option>
                          <option>25%</option>
                      </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Closing Costs ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Seller Credits ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Interest Rate (%)</FormLabel>
                        <Input />
                      </FormControl> 
                      <FormControl>
                        <FormLabel>Loan Term (years)</FormLabel>
                        <Select placeholder='Select Years'>
                          <option>15</option>
                          <option>20</option>
                          <option>25</option>
                          <option>30</option>
                          <option>40</option>
                      </Select>
                      </FormControl>       
                      <Heading size="md" mb={'4'}>Property Expenses</Heading>
                      <FormControl>
                        <FormLabel>Property Taxes ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Property Management ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Maintenance ($)</FormLabel>
                        <Input/>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Vacancy ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl >
                        <FormLabel>Insurance ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Association Fees ($)</FormLabel>
                        <Input/>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Electricity ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Flood Insurance ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Gas ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Janitorial Service ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Landscaping ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Liability Insurance ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Mortgage Insurance ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Other Utilities ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Supplies ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Trash ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Miscellaneous ($)</FormLabel>
                        <Input />
                      </FormControl>
                      <Button colorScheme="messenger" my={'4'}
                      onClick={() => newPropertyCallback()}
                      >Calculate Property</Button>
            </Flex>
    )
  }
  
}

function PropertyCard({hasList, property, isSelected, onClick}) {
  if (hasList) {
    return (
      <Card my={'4'} bgColor={isSelected ? 'gray.50' : 'gray.200'} cursor={'pointer'} onClick={onClick}>
              <CardBody>
                <Stack divider={<StackDivider />} spacing='2'>
                <Heading size='md'>{property.property_name}</Heading>
                <Box>
                    <Text pt='2' fontSize='md'>
                    <b>Cash Needed to Close:</b> {property.cash_needed_to_close}
                    </Text>
                    <Text pt='2' fontSize='md'>
                    <b>Cash Received at Closing: </b> {property.cash_received_at_closing}
                    </Text>
                </Box>                  
                </Stack>
              </CardBody>
        </Card>            
    )
  }
  
}


export default function Dashboard() {

    const [isNew, setIsNew] = useState(false)
    const [hasProperties, setHasProperties] = useState(false)
    const [hasChat, setHasChat] = useState(false)
    const [hasList, setHasList] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [numProperties, setNumProperties] = useState()

    function createNewProperty() {
      setIsNew(true)
      // setHasList(true)
      // setHasChat(true)
    }    
    function handleNewProperty() {
      setHasProperties(true)
      setIsNew(true)
    }
    const handleCardClick = (id) => {
      console.log("PRoperrty IDD", id)
      setSelectedProperty(id)
      setIsNew(false)
    }
    const [isOpen, setOpen] = useState(true)
    const [user, setUser] = useState(null)
    const [hasCalculations, setCalculations] = useState()
    const [createdProperty, setCreatedProperty] = useState()
    const [propertyError, setPropertyError] = useState()
    // let properties = []
    const [initialProperties, setInitialProperties] = useState()
    const [properties, setProperties] = useState()
    const [isLoadingProperties, setIsLoadingProperties] = useState(false)
    useEffect(() => {
        const getInitialProperties = async () => {
          await supabase
          .from('Properties')
          .select("*")
          .order('created_at', {ascending: false})
          .then(res => {
            // console.log("Response data", res.data)
            console.log(res.data)
            if (res.data.length > 0) {
              setSelectedProperty(res.data[0].id)
            }
            setProperties(res.data)
            setNumProperties(res.data.length)
          })
        }
        console.log(properties)
        getInitialProperties()
        setCalculations(false)
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
        {/* <Box height="100vh" overflow="hidden" bgColor={'red.100'}> */}
      {/* <Navbar isLanding={false} /> */}
      <Flex height={"100vh"} width="100%" direction="column" overflow={'hidden'}>
        <Flex mx={'4'} direction="column" justifyContent="space-between" mt="8">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Heading>Property Calculations</Heading>
          </Flex>
          <Flex justifyContent="flex-start">
            <Text fontSize="2xl">Search existing property calculations or create new ones with our property AI tool</Text>
          </Flex>
          <Divider mt="4" />
        </Flex>
        <Flex flexGrow={1}>
          <Box flex={'1'} overflowY="auto" maxHeight="calc(100vh - 120px)" bgColor={'gray.200'} px={'4'} >
            <Flex  gap={2} justifyContent={'space-between'} position="sticky" top="0" zIndex="1"  bgColor={'gray.200'} >
                <Button color={"black"} flex={4}  height={'50px'} onClick={() => createNewProperty()} colorScheme="blackAlpha" variant={'outline'}>
                  + Add New Property
                </Button>
                
                {/* <Button > */}
                <IconButton
                flex={1}  onClick={() => createNewProperty()} colorScheme="blackAlpha" variant={'outline'}
                // colorScheme="gray.300"
                color={"black"}
                boxSize={12}
                icon={<EditIcon />}
                // onClick={handleSend}
              >
                  
              </IconButton>
              
                {/* </Button> */}
            </Flex>
            {/* {isLoadingProperties && {
              
            }} */}
            {properties && properties.map((property) => {
              return (
                <PropertyCard hasList={true} property={property} key={property.id} isSelected={selectedProperty === property.id} onClick={() => handleCardClick(property.id)} />
              )
            })}
          </Box>          
          <ChatContainer numProperties={numProperties} isNew={isNew} selectedProperty={selectedProperty} />          
        </Flex>
      </Flex>
    {/* </Box>         */}
        </>        
    )
}