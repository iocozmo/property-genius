import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import { Button, Center, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PropertyForm from "./PropertyForm";

// Pass in the propertyId to both the chat window and the user input
function ChatContainer({user, numProperties, isNew, selectedProperty, isNewCallBack}) {
    console.log("isNew", isNew)
    const [isInForm, setIsInForm] = useState(isNew)
    const [formChange, setFormChange] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const hanldeLoadingState = (newState) => {
        setIsLoading(newState);
      };
    
    // Initial Render
    useEffect(() => {
        setIsInForm(isNew)
    },[isInForm])
        
    function handleCloseForm() {
        setIsInForm(false);
        isNewCallBack();
    }
    if (numProperties === 0) {
        return (
            <Flex flex={'4'} maxHeight="calc(100vh - 120px)" alignItems={'center'} justifyContent={'center'}> 
                <Center>
                    <Button  width={'100%'} height={'50px'} onClick={() => propertyCallBack()} colorScheme="blackAlpha" variant={'outline'}>
                        + Add New Property
                    </Button>
                </Center>
            </Flex>
        )
    }
    else if (isNew) {
        return (
            <PropertyForm  user={user} handleCloseForm={handleCloseForm} />
        )
    } else {
        return (
            <Flex p={'4'} flex={'4'} direction={'column'} maxHeight="calc(100vh - 120px)" alignItems={'center'} justifyContent={'flex-start'}>             
                <Chat isLoading={isLoading} selectedProperty={selectedProperty} />
                <ChatInput selectedProperty={selectedProperty} hanldeLoadingState={hanldeLoadingState} />            
            </Flex>
        )
    }    
}

export default ChatContainer;

