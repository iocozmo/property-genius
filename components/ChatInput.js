import { supabase } from "@/lib/client";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, IconButton, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
// import { error } from "console";
import { useState } from "react";

function ChatInput({hanldeLoadingState, handleInputSubmit, selectedProperty}) {
  const [apiResponseReader, setApiResponseReader] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [apiKey, setApiKey] = useState(
    "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"
  );
  const [gptOutput, setGptOutput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    setUserMessage(event.target.value)
  }

  const getPropertyData = async () => {
    try {
        const {data, error} = await supabase
        .from('Properties')
        .select('*')
        .eq('id', selectedProperty)
        .single()
        
        if (error) {
          console.log(error)
        }

        const propertyResultsString = data['property_results_string'];
        const propertyDetailsString = data['property_details_string'];
        const isCombined = data['is_combined'];
       
        return {propertyResultsString, propertyDetailsString, isCombined}

    } catch (e) {
        console.log(e)
    }
  }

  const sendOpenAiMessageToDb = async (output) => {
    try {
      const {data, error} = await supabase
      .from("Chats")
      .insert([{
        property_id: selectedProperty, 
        sender: "ai", 
        content: output
      }])
      
    } catch (e) {
      console.log(error)
    } finally {
      hanldeLoadingState(false)
    }
  } 
 
  const handleOpenAiMessage = async () => {
    const {propertyResultsString, propertyDetailsString, isCombined} = await getPropertyData();
    let body;
    
    if (isCombined) {
      const propertyResultsObj = JSON.parse(propertyResultsString)
      const propertyDetailsObj = JSON.parse(propertyDetailsString)
      const propertyOneResults = propertyResultsObj.propertyOne;
      const propertyTwoResults = propertyResultsObj.propertyTwo;
      const propertyOneDetails = propertyDetailsObj.propertyOne;
      const propertyTwoDetails = propertyDetailsObj.propertyTwo;
      
      body = JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "assistant",
            content: `The assistant is are a real estate expert with a background in property investments.`,
          },
          {
            role: "system",
            content: `The assistant will be provided with information about two properties. Each of these properties contain pieces of data that descsribe the property. The first piece of data each property will have are the property results and the second are the property details.
            The assistant will use both the property details and property results to give recommendations. The assistant will not use more than 2 decimals. The assistant will respond with a maximum of 3 sentences. The assistant will skip calculations and only provide answers.`,
          },
          {
            role: "assistant",
            content: `The property results pertaining to the property are the following: ${propertyResultsString}. The property details pertaining to the property are the following: ${propertyDetailsString}`,
          },
          {
            role: "user",
            content: `${userMessage}`,
          },         
        ],
        n: 1,
        stop: null,
        temperature: 0.2,
        stream: true,
      })
    } else {
      body = JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "assistant",
            content: `The assistant is are a real estate expert with a background in property investments.`,
          },
          {
            role: "system",
            content: `The assistant will be provided with information about two properties. Each of these properties contain pieces of data that descsribe the property. The first piece of data each property will have are the property results and the second are the property details.
            The assistant will use both the property details and property results to give recommendations. The assistant will not use more than 2 decimals. The assistant will respond with a maximum of 5 sentences. The assistant will skip calculations and only provide answers.`,
          },
          {
            role: "assistant",
            content: `The property results pertaining to the property are the following: ${propertyResultsString}. The property details pertaining to the property are the following: ${propertyDetailsString}`,
          },
          {
            role: "user",
            content: `${userMessage}`,
          },         
        ],
        n: 1,
        stop: null,
        temperature: 0.2,
        stream: true,
      });
    }
    
    setIsSubmitting(true);
    if (apiResponseReader) {
      apiResponseReader.cancel();
    }
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const headers = new Headers();
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: body,
    };

    let output = "";

    try {
      const response = await fetch(apiUrl, requestOptions);
      console.log(response)
      const reader = response.body.getReader();
      setApiResponseReader(reader);

      const decoder = new TextDecoder();

      let isFirst = true;
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
    
        let result = decoder.decode(value, { stream: true });
        // console.log(result)

        if (isFirst) {
          const parts = result.split("\n");
          result = parts[2];
          isFirst = false;
        }

        try {
          const obj = JSON.parse(result.substring(6));
          const txt = obj["choices"][0]["delta"]["content"];
          // console.log(txt)
          setGptOutput(txt);
          output += txt;
          console.log(output)
        } catch (x) {
          // handle parse error 
        }
      }
      
      await sendOpenAiMessageToDb(output)            
    } catch (error) {
      console.log(error)
      const err = "Error fetching chat completion" + error;    
      return err;
    } finally {
      setIsSubmitting(false);
    }
  }

  const sendUserMessageToDb = async () => {
    try {
      const {data, error} = await supabase
      .from('Chats')
      .insert([{
        property_id: selectedProperty, 
        sender: "user", 
        content: userMessage
      }])
      if (error) {
        console.log(error)
      }
      console.log(data)
    } catch (error) {
      console.log
    } finally {
      setUserMessage("");
    }
  }

  const handleSend = async () => {
    hanldeLoadingState(true)
    await sendUserMessageToDb()
    await handleOpenAiMessage()    
    // hanldeLoadingState(true)
  }

  
  return (
    <Box my={'2'} width={'100%'} >
            <InputGroup size='lg'>
              <Input
                // height={'75px'}
                  variant={
                      'filled'
                  }
                  // pr='4.5rem'                    
                  placeholder='Chat with your property here'
                  value={userMessage}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSend()
                    }
                  }}
              />
              <InputRightElement>    
              <IconButton
                colorScheme='messenger'
                icon={<ArrowRightIcon />}
                onClick={handleSend}
              >
                  
              </IconButton>        
              </InputRightElement>
              </InputGroup>              
          </Box>
  )
}

export default ChatInput