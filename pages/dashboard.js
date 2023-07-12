import ChatContainer from "@/components/ChatContainer";
// import { supabase } from "@/lib/client";
import { ArrowRightIcon, CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Card, CardBody, Center, Divider, Flex, Heading, IconButton, Input, InputGroup, InputRightElement, Stack, StackDivider, Text, useToast } from "@chakra-ui/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
// import { error } from "console";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
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
  const supabase = useSupabaseClient();
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


function PropertyCard({isComparing, hasList, property, isSelected, onClick, propertiesSelected}) {
  const propertyId = property.id;
  const [isDeleting, setIsDeleting] = useState();
  let showDeleteBox;
  // const [isChecked, setIsChecked] = useState(false)
  let isChecked = false
  // const handleClick = () => {
  //   setIsChecked(isChecked => !isChecked)
  // }
  const handleDeleteAttempt = () => {
    setIsDeleting(!isDeleting)
  }

  if (propertiesSelected.includes(property)) {
    isChecked = true
  }

  isSelected = isComparing ? false : isSelected
  showDeleteBox = isComparing ? false : isSelected;

  if (hasList) {
    if (isComparing) {
      return (
          <Card my={'4'} bgColor={isChecked ? 'gray.50' : 'gray.200'} cursor={'pointer'} onClick={onClick}>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='2'>
                    <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <Heading size='md'>{property.property_name}</Heading>                               
                    {isComparing && (
                      // <Checkbox onChange={handleClick} isChecked={isChecked}></Checkbox>
                      <Box borderRadius={'2px'} border={isChecked ? '' : '2px solid gray'} bg={isChecked ? 'gray' : 'gray.100'} height={'15px'} width={'15px'}>
                        
                      </Box>
                    )}   
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
    return (
      <Card my={'4'} bgColor={isSelected ? 'gray.50' : 'gray.200'} cursor={'pointer'} onClick={onClick}>
              <CardBody>
                <Stack divider={<StackDivider />} spacing='2'>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Heading size='md'>{property.property_name}</Heading>
                {showDeleteBox && (
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


export default function Dashboard({user, propertiesFetched}) {
    const [isNew, setIsNew] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [numProperties, setNumProperties] = useState()
    const [newProperty, setNewProperty] = useState()
    const [deleteProperty, setDeleteProperty]  = useState();
    const [selectCount, setSelectCount] = useState(0);
    const [propertiesSelected, setPropertiesSelected] = useState([]);
    const [isComparable, setIsComparable] = useState(false);
    const [isComparing, setIsComparing] = useState();
    // const supabase = createServerComponentClient({cookies})    
    const [properties, setProperties] = useState(propertiesFetched ?? [])
    const [userData, setUserData] = useState()
    const [invalidCompareAlert, setInvalidCompareAlert] = useState(false);
    const supabase = useSupabaseClient();
    const toast = useToast()
    console.log(user)
    console.log(propertiesFetched)
    
    const router = useRouter();

    async function signOut() {
      // await axios.post('/api/auth/logout')
      await supabase.auth.signOut()
      router.push('/')
    } 
    
    const handleCompareClick = () => {
      setIsComparing(isComparing => !isComparing)
    }

    const compareProperties = async () => {
      // Iterate through the propertiesSelected
      const propertyOne = propertiesSelected[0]
      const propertyTwo = propertiesSelected[1]
      const propertyOneResults = propertyOne.property_results_string;
      const propertyTwoResults = propertyTwo.property_results_string;
      const combinedResultsObj = {
        propertyOne: propertyOneResults,
        propertyTwo: propertyTwoResults
      }
      // `Property one results: ${propertyOneResults}. Property two results: ${propertyTwoResults}`
      const combinedResultsString = JSON.stringify(combinedResultsObj)
      const propertyOneDetails = propertyOne.property_details_string;
      const propertyTwoDetails = propertyTwo.property_details_string;
      const combindPropertyDetailsObj= {
        propertyOne: propertyOneDetails,
        propertyTwo: propertyTwoDetails
      }
      const combinedDetailsString = JSON.stringify(combindPropertyDetailsObj)
      const combinedName = `${propertyOne.property_name} & ${propertyTwo.property_name}`
      const newPropertyObj = {
        user_id: user.id,
        property_name: combinedName,
        property_results_string: combinedResultsString,
        property_details_string: combinedDetailsString,
        is_combined: true
      }      
      // console.log(newPropertyObj);
      
      try {
        const {data: submittedProperty, error: comparePropertyError}  = await supabase
        .from('Properties')
        .insert(newPropertyObj)
        if (comparePropertyError) {
          console.log('Error uploading compare property', comparePropertyError.message)
        }
      } catch(error) {
        console.log('Error uploading compare property', error.message)
      } finally {
        setIsComparing(false)
        setPropertiesSelected([])
      }
    }
    
    function handleCreateNewProperty() {
      if (isComparing) {
        if (propertiesSelected.length != 2) {
          // setInvalidCompareAlert(true)
          toast({
            title: 'You can only compare two properties',
            status: 'info',
            isClosable: true,
          })
        }
        if (propertiesSelected.length === 2) {
          compareProperties();
        }
      } else {
        setIsNew(isNew => !isNew)  
        // setHasList(true)
        // setHasChat(true)
      }   
      // setIsNew(isNew => !isNew)
      // setHasList(true)
      // setHasChat(true)
    }    
    function handleNewProperty() {
      setHasProperties(true)
      setIsNew(true)
    }
    useEffect(() => {
      console.log("Properties selected", propertiesSelected)
      console.log("Select count", selectCount)
      
    },[propertiesSelected])
    const handleCardClick = (property, id) => {
      const currentCount = selectCount;      
      console.log("Property Clicked", property)
      let tempList = propertiesSelected;            
      if (!isComparing) {
        setSelectedProperty(id)
        return;
      }       
      if (propertiesSelected.includes(property)) {
        // Remove from the list of properties selected
        tempList = tempList.filter(addedProperty => property !== addedProperty)
        setPropertiesSelected([...tempList])
        setSelectCount(prevCount => prevCount -= 1)
        if ((currentCount - 1 < 2)) {
          setIsComparable(false)
        }
        if ((currentCount - 1 === 2)) {
          setIsComparable(true)
        }
      } else {
          setPropertiesSelected(prevData => [...prevData, property])
          setSelectCount(prevCount => prevCount += 1)                           
      }      
  
      setIsNew(false)
    }    
    
    const getInitialData = async () => {
      await setPropertiesData();
      // await fetchProfile()
      // await getAllProperties()
    }

    const fetchProfile = async () => {
      setUserData(user)
    }

    const setPropertiesData = async () => {
      if (propertiesFetched.length > 0) {
        setSelectedProperty(propertiesFetched[0].id)
        setProperties(propertiesFetched)
        setNumProperties(propertiesFetched.length)
      }
    }

    const getAllProperties = async () => {
      try {          
        const {data, error} = await supabase
        .from('Properties')
        .select("*")
        .eq('user_id', user.id)
        .order('created_at', {ascending: false})          
        if (error) {
          console.log("Supabase error fetching properties", error)
        }
        if (data) {
          console.log("Logging data", data);
          if (data.length > 0) {
            setSelectedProperty(data[0].id)
          }
          setProperties(data);
          setNumProperties(data.length)
        }
        if (error) {
          console.log("Error fetching proprties", error)
        }
        
      } catch (error) {
        console.log("Error fetching properties", error);
      }         
    };
    
    useEffect(() => {
        // console.log("USER_ID", user)
        // fetchProfile()
        // getAllProperties()
        getInitialData()
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

    
    useEffect(() => {
      console.log(isComparable)
    }, [isComparable])

    return (
        <>
        {/* <Box height="100vh" overflow="hidden" bgColor={'red.100'}> */}
      {/* <Navbar isLanding={false} /> */}
      <Flex height={"100vh"} width="100%" direction="column" overflow={'hidden'}>
        <Flex mx={'4'} direction="column" justifyContent="space-between" mt="8">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Heading>Property Calculations</Heading>
            <Button onClick={signOut}>Sign out</Button>
          </Flex>
          <Flex justifyContent="flex-start">
            <Text fontSize="2xl">Search existing property calculations or create new ones with our property AI tool</Text>
          </Flex>
          <Divider mt="4" />
        </Flex>
        <Flex flexGrow={1}>
          <Box flex={'1'} overflowY="auto" maxHeight="calc(100vh - 120px)" bgColor={'gray.200'} px={'4'} >
            <Flex  gap={2} justifyContent={'space-between'} position="sticky" top="0" zIndex="1"  bgColor={'gray.200'} >
                <Button color={"black"} flex={4}  height={'50px'} onClick={() => handleCreateNewProperty()} colorScheme="blackAlpha" variant={'outline'}>
                  {isComparing ? 'Compare Properties' : '+ Add new property'} 
                </Button>
                
                {/* <Button > */}
                <IconButton
                flex={1}  onClick={() => handleCompareClick()} colorScheme="blackAlpha" variant={'outline'}
                // colorScheme="gray.300"
                color={"black"}
                boxSize={12}
                icon={<EditIcon />}
                // onClick={handleSend}
              >
                  
              </IconButton>              
              
                {/* </Button> */}
            </Flex>
            {isComparing && (
                <Box mt={'4'}>
                  <Text>
                    Select <b>two</b> properties to compare
                  </Text>
                </Box>
              )}
            {/* {isComparing && (
              <Button>Compare</Button>
            )} */}
            {/* {isLoadingProperties && {
              
            }} */}
            {properties && properties.map((property) => {
              return (
                <PropertyCard isComparing={isComparing} hasList={true} property={property} key={property.id} isSelected={selectedProperty === property.id} onClick={() => handleCardClick(property, property.id)} propertiesSelected={propertiesSelected} />
              )
            })}
          </Box>          
          <ChatContainer user={user} numProperties={numProperties} isNew={isNew} selectedProperty={selectedProperty} isNewCallBack={handleCreateNewProperty} />          
        </Flex>
      </Flex>
    {/* </Box>         */}
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

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
  }
  
  const user = session.user
  
  // Run queries 
  const { data, error } = await supabase
  .from('Properties')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', {ascending: false}) 

  if (error) {
    console.log('error in server side', error)
  }


  return {
    props: {
      initialSession: session,
      user: session.user,
      propertiesFetched: data ?? []
    },
  }
}
