import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import { Button, Center, Flex } from "@chakra-ui/react";
import PropertyForm from "./PropertyForm";


// Pass in the propertyId to both the chat window and the user input

function ChatContainer({numProperties, isNew, selectedProperty}) {
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
            <PropertyForm  />
        )
    } else {
        return (
            <Flex p={'4'} flex={'4'} direction={'column'} maxHeight="calc(100vh - 120px)" alignItems={'center'} justifyContent={'flex-start'}>             
                <Chat selectedProperty={selectedProperty} />
                <ChatInput selectedProperty={selectedProperty} />            
            </Flex>
        )
    }    
}

export default ChatContainer;

