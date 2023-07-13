
import { supabase } from "@/lib/client";
import { Box, Flex, Progress, Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const LoadingBubble = () => {
  <Box
      bg={"gray.100"}
      color={"black"}
      maxW="80%"
      py={4}
      px={4}
      borderRadius="md"
      alignSelf={"flex-start"}
    >    
      <Text>Property Genius is thinking...</Text>
      {/* <Text mt={'2'} fontSize={'9px'} >{name}</Text> */}
      {/* <Progress size='xs' isIndeterminate /> */}
    </Box>
}

const ChatBubble = ({ message, isSender, isLoading }) => {
  // if (isLoading) {
  //   return (
  //     <Box 
  //     maxW="40%"
  //     py={4}
  //     px={4}
  //     > 
  //       <CircularProgress isIndeterminate/>
  //     </Box>
  //   )
  // }
  const name = (isSender === "user") ? "You" : "Property Genius"  
  return (
    <Box
      bg={isSender === "user" ? "messenger.500" : "gray.100"}
      color={isSender === "user" ? "white" : "black"}
      maxW="80%"
      py={4}
      px={4}
      borderRadius="md"
      alignSelf={isSender === "user" ? "flex-end" : "flex-start"}
    >    
      <Text>{message}</Text>
      <Text mt={'2'} fontSize={'9px'} >{name}</Text>
    </Box>
  );
};

// Get all messages for currently selected property


function Chat({isLoading, propertiesLen, selectedProperty}) {
  console.log("selectedProperty in chat", selectedProperty);
  const toast = useToast();
  const [messages, setMessages] = useState();
  const [prevProperty, setPrevProperty] = useState();
  const [hasMessages, setHasMessages] = useState(false);
  const messagesEndRef = useRef(null)
  // const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  useEffect(() => {

  }, [hasMessages])

  useEffect(() => {
    // Fetch all messages for this property
    const getAllMessages = async () => {
      try {
        const {data, error} = await supabase
        .from("Chats")
        .select("*")
        .eq("property_id", selectedProperty)        
        if (error) {
          throw new Error(error.message);
        }
        if (data.length > 0) {
          setHasMessages(true)
        }
        setMessages(data);
      } catch(error) {
        console.log("Error fetching chats:", error)
      }
    };

    // Set up the subscription to Chats table
    const subscription = supabase
      .channel("custom-all-channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "Chats" }, async (payload) => {
        console.log("Change received!", payload);
        // setIsLoading(true)        
        // When a change event occurs, fetch the updated chats
        setMessages(prevData => [...prevData, payload.new]);
        // setIsLoading(false)
        // const newMessages = await getAllMessages();
        // setMessages(newMessages);
      })
      .subscribe();

    // Fetch chats on component mount
    getAllMessages();

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
    
  },[selectedProperty]);


  return (
    <Box flex={'1'} overflowY={'auto'} width={'100%'}>       
    {/* {isLoading && (
      <Progress size='xs' isIndeterminate />
    )} */}
      {/* {!hasMessages && (
        <Flex height={'100%'} alignItems={'center'} justifyContent={'center'}>
          <Center>
          <Card>
            <CardBody>
                <Text>
                  Start chatting with property genius below
                </Text>
            </CardBody>
          </Card>
          </Center>          
        </Flex>        
      )
      } */}
      <VStack spacing={2} px={30} >     
        {/* {hasMessages && (
        <Flex height={'100%'} alignItems={'center'} justifyContent={'center'}>
          <Center>
          <Card>
            <CardBody>
                <Text>
                  Start chatting with property genius below
                </Text>
            </CardBody>
          </Card>
          </Center>          
        </Flex>        
      )
      } */}
      {/* {isLoading && (
            <Box 
            maxW="40%"
            py={4}
            px={4}
            > 
              <CircularProgress isIndeterminate/>
            </Box>
      )} */}
        {messages &&  messages.map((message) => {
          // if (isLoading) {
          //   return (
          //     <Box 
          //     maxW="40%"
          //     py={4}
          //     px={4}
          //     > 
          //       <CircularProgress isIndeterminate/>
          //     </Box>
          //   )
          // }
          return (
            <ChatBubble
              key={message.id}
              message={message.content}
              isSender={message.sender}
              isLoading={isLoading}
            />
          )
        }        
      )}     
      
    </VStack>         
    
      <div ref={messagesEndRef} />
      <Flex alignItems={'center'} justifyContent={'center'} >
      {isLoading && (
        // <Portal>
            <Flex 
            maxW="25%"
            pt={2}
            px={4}
            bg={"gray.100"}
            color={"black"}
            mt={'10'}
            // ml={'7'}
            borderRadius="md"
            direction={'column'}
            // justifySelf={'self-start'}
            // justifySelf={'center'}
            > 
            {/* <Flex direction={'column'} gap={'4'}> */}
              <Text fontSize={'9px'}> Property Genius is thinking...</Text>
              {/* <CircularProgress size={'30px'} isIndeterminate /> */}
              <Progress size='xs' isIndeterminate />
            {/* </Flex> */}
              {/* <Progress size='xs' isIndeterminate /> */}
            </Flex>
          // </Portal>
            
      )}
      </Flex>      
    </Box>
  )
}

export default Chat