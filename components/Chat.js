
import { supabase } from "@/lib/client";
import { Box, Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ChatBubble = ({ message, isSender }) => {
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


function Chat({propertiesLen, selectedProperty}) {
  const toast = useToast();
  const [messages, setMessages] = useState();
  const [prevProperty, setPrevProperty] = useState();
  const [hasMessages, setHasMessages] = useState(false);

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
        // if (data.length > 0) {
        //   hasMessages(true)
        // }
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

        // When a change event occurs, fetch the updated chats
        setMessages(prevData => [...prevData, payload.new]);
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
        {messages &&  messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message.content}
          isSender={message.sender}
        />
      ))}     
    </VStack>
    </Box>
  )
}

export default Chat