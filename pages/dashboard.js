import ChatContainer from "@/components/ChatContainer";
import { supabase } from "@/lib/client";
import { ArrowRightIcon, CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Card, CardBody, Center, Divider, Flex, Heading, IconButton, Input, InputGroup, InputRightElement, Stack, StackDivider, Text } from "@chakra-ui/react";
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

function DeleteBox({propertyId}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const confirmDelete = async () => {
    console.log("PROP ID", propertyId)
    try {
      const {data, error} = await supabase
      .from('Properties')
      .delete()
      .eq('id', propertyId);
      if (error) {
        console.log(error)
      }
    } catch (error) {
      console.log("Could not delete property", error)
    }
  }
  
  const handleDeleteAttempt = () => {
    setIsDeleting(!isDeleting);
  }  
  if  (isDeleting) {
    return (
      <Flex>
        <IconButton
          bgColor={'gray.50'}
          color={'black'}
          boxSize={6}
          icon={<CheckIcon />}
          onClick={confirmDelete}
        ></IconButton>
        <IconButton
          bgColor={'gray.50'}
          color={'black'}
          boxSize={6}
          icon={<CloseIcon />}
          onClick={handleDeleteAttempt}
        ></IconButton>  
      </Flex>
    )
  }
  return (
    <Flex>
      <IconButton
        bgColor={'gray.50'}
        color={'black'}
        boxSize={6}
        icon={<DeleteIcon />}
        onClick={handleDeleteAttempt}
        ></IconButton>  
    </Flex>
  )
}


function PropertyCard({hasList, property, isSelected, onClick}) {
  const propertyId = property.id;
  const [isDeleting, setIsDeleting] = useState();
  const handleDeleteAttempt = () => {
    setIsDeleting(!isDeleting)
  }
  if (hasList) {
    return (
      <Card my={'4'} bgColor={isSelected ? 'gray.50' : 'gray.200'} cursor={'pointer'} onClick={onClick}>
              <CardBody>
                <Stack divider={<StackDivider />} spacing='2'>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Heading size='md'>{property.property_name}</Heading>
                {isSelected && (
                  <DeleteBox propertyId={propertyId} /> 
                )                  
                }                
                </Flex>
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
    const [newProperty, setNewProperty] = useState()
    const [deleteProperty, setDeleteProperty]  = useState();

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
      console.log("Property ID", id)
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
        const getAllProperties= async () => {
          try {
            await supabase
            .from('Properties')
            .select("*")
            .order('created_at', {ascending: false})
            .then(res => {
              // console.log("Response data", res.data)
              // console.log(res.data)
              if (res.data.length > 0) {
                setSelectedProperty(res.data[0].id)
              }
              setProperties(res.data)
              setNumProperties(res.data.length)
            })
          } catch (e) {
            console.log("Error fetching properties", error);
          }         
        };
        getAllProperties()
        const propertySubscription = supabase
        .channel("any")
        .on("postgres_changes", {event: "INSERT", schema: "public", table: "Properties"}, (payload) => {
          console.log("New Property insert received", payload);                  
          setNewProperty(payload.new)
          // setSelectedProperty(payload.new.id);
        })
        .on("postgres_changes", {event: "DELETE", schema: "public", table: "Properties"}, (payload) => {
          console.log("New Property delete received", payload);                  
          setDeleteProperty(payload.old)
          // setSelectedProperty(payload.new.id);
        })
        .subscribe();                        

         // Clean up the subscription when the component unmounts
        return () => {
          supabase.removeChannel(propertySubscription)
        };
    }, [])

    // Property deleted
    useEffect(() => {
      if (deleteProperty) setProperties(properties.filter((property) => property.id !== deleteProperty.id))
    }, [deleteProperty])

    // New property added
    useEffect(() => {
      if (newProperty) {
        let tempList = [...properties]
        tempList.unshift(newProperty);
        setProperties([...tempList]);
        setSelectedProperty(newProperty.id)
      } 
    }, [newProperty])

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