import { supabase } from "@/lib/client";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, IconButton, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
// import { error } from "console";
import { useState } from "react";

function ChatInput({handleInputSubmit, selectedProperty}) {
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
        .eq('id', 9)
        
        if (error) {
          console.log(error)
        }

        const propertyResultsString = data[0]['property_results_string'];
        const propertyDetailsString = data[0]['property_details_string']
       
        return {propertyResultsString, propertyDetailsString}

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
    }
  } 
 
  const handleOpenAiMessage = async () => {
    const {propertyResultsString, propertyDetailsString} = await getPropertyData();
    
    setIsSubmitting(true);
    if (apiResponseReader) {
      apiResponseReader.cancel();
    }
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const headers = new Headers();
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("Content-Type", "application/json");

    const body = JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "assistant",
          content: `You are a real estate expert with a background in property investments.`,
        },
        {
          role: "system",
          content: `The assistant will be provided with the following details about a property: ${propertyResultsString} & ${propertyDetailsString}
          The assistant will not use more than 2 decimals.`,
        },
        {
          role: "user",
          content: ` 
          Question: ${userMessage}
          Short Summary of answer:
          SKIP ALL CALCULATIONS - ONLY PROVIDE ANSWERS`,
        },
      ],
      n: 1,
      stop: null,
      temperature: 0.5,
      stream: true,
    });

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
      // setQaPairs((prevQaPairs) => [
      //   ...prevQaPairs,
      //   { question: userMessage, answer: output },
      // ]);
      // setUserMessage("");
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
    await sendUserMessageToDb()
    await handleOpenAiMessage()    
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