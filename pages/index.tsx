'use client';
/*eslint-disable*/

// import Link from '@/components/link/Link';
import {
  Button,
  Fade,
  Flex,
  Icon,
  Img,
  Input,
  SlideFade,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { MdAutoAwesome, MdPerson } from 'react-icons/md';
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel
} from "react-icons/fa";
import Bg from '../public/img/chat/Logo-GP-Blanco.png';
import Card from '@/components/card/Card'
import { MdEmail } from "react-icons/md";
import { ImBlocked } from "react-icons/im";

interface SearchResult {
  _additional: {
    rerank: [{
      score: number;
    }]
  };
  filename: string;
  text: string;
}
interface ResultsWithLinks {
  chatResult: {
    name: string,
    email: string,
    comment: string
  };
  affinity: number;
  filename: string;
}
interface ValidationResult {
  answer: string,
  explanation: string
}

export default function Chat() {
  // Query States
  const [query, setQuery] = useState<string>("");
  // Query Reference
  const originalQuery = useRef<string>("");
  // Input States
  const [inputQuery, setInputQuery] = useState<string>("");
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  // Loading state (Load more)
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  // Email loading state
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  // Selected email state
  const [selectedEmail, setSelectedEmail] = useState<number>();
  // Search results
  const searchResults = useRef<SearchResult[]>([]);
  // Validation result
  const validationResult = useRef<ValidationResult>();
  // Final results
  const [resultsWithLinks, setResultsWithLinks] = useState<ResultsWithLinks[]>([]);
  // Displayed results
  const displayedResults = useRef(0);

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const gray = useColorModeValue('gray.500', 'white');
  const textColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );

  const handleSearch = async () => {
    const searchRequest = await fetch('/api/search', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "query": originalQuery.current })
    });
    if (!searchRequest.ok) {
      throw new Error('Network response was not ok');
    }
    const results = await searchRequest.json();
    if (results.data.Get.Cv_jobab) {
      searchResults.current = results.data.Get.Cv_jobab;
    };
    console.log(searchResults.current);
  };
  
  // const handlePromptValidation = async () => {
  //   try {
  //     const chatRequest = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ "updatedQuery": `Given the following text:\n${originalQuery.current}\nDoes this look like a job description or candidate request? If no, explain in the given text language that you are not able to handle a request. Answer in JSON: {"answer": yes or no, "explanation": comment}` }),
  //     });
  //     if (!chatRequest.ok) {
  //       throw new Error('Network response was not ok');
  //     };
  //     const result = await chatRequest.json();
  //     validationResult.current = JSON.parse(result.content[0].text);
  //   } catch (error) {
  //     console.error('There was an error fetching the data', error);
  //   };
  // }

  const handleLLM = async () => {
    const resultsPerLoad = 4
    if (searchResults.current) {
      const startIndex = displayedResults.current
      const endIndex = Math.min(displayedResults.current + resultsPerLoad, searchResults.current.length)
      for (let i = startIndex; i < endIndex; i++) {
        let searchResult = searchResults.current[i]
        try {
          const chatRequest = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "updatedQuery": `With the following job description:\n${originalQuery.current}\nIn the same language as the given text, comment between 40-60 words on fit of the CV:\n${searchResult.text}\nRespond in JSON: {"name": candidate's full name with capitalized first letters, "email": candidate's email if exists, else blank string, "comment": comment}` }),
          });
          if (!chatRequest.ok) {
            throw new Error('Network response was not ok');
          };
          const result = await chatRequest.json();
          // Append each new piece of data along with its original text to the array
          setResultsWithLinks(
            prevResults => [...prevResults, {
                // chatResult: JSON.parse(result.choices[0].message.content),
                chatResult: JSON.parse(result.content[0].text),
                affinity: Math.round(searchResult._additional.rerank[0].score * 100),
                filename: searchResult.filename
              }
            ]
          );
          displayedResults.current++;
        } catch (error) {
          console.error('There was an error fetching the data', error);
        };
      };
    };
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setResultsWithLinks([]);
    displayedResults.current = 0;
    setQuery(inputQuery);
    originalQuery.current = inputQuery;
    setInputQuery("");
    await handleSearch();
    await handleLLM();
    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(event.target.value);
  };

  const handleInput = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!inputQuery) {
        alert('Por favor captura un mensaje.');
        return;
      }
      handleSubmit();
    }
  }

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await handleLLM();
    setLoadingMore(false);
  }

  const handleEmail = (index: number) => {

    setEmailLoading(true)
    setSelectedEmail(index)

    const selectedCandidate = searchResults.current[index].text;
    
    (async () => {
      try {
        const emailRequest = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "updatedQuery": `With the following job description:\n${originalQuery.current}.\nIn the same language as the given text, write up a polite email between 120-160 words to invite the candidate with the following CV:\n${selectedCandidate}\n to participate in the selection process of Grupo PiSA. Address the candidate using first name. Includes a short comment on the candidate's fit. Format the response in JSON: {"subject": email's subject, "body": email's body using %0D%0A as line break, "email": candidate's email}` }),
        });
        if (!emailRequest.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await emailRequest.json();
        const jsonResult = JSON.parse(result.content[0].text);

        window.location.href = `mailto:${jsonResult.email}?subject=${jsonResult.subject}&body=${jsonResult.body}`;
        
        setEmailLoading(false)
      } catch (error) {
        console.error('There was an error fetching the data', error);
      }
    })();
  }

  const handleFileIcon = (fileName: string) => {
    switch (fileName.toLowerCase().split(".").pop()) {
      case "pdf":
        return <FaFilePdf />;
      case "doc":
      case "docx":
        return <FaFileWord />;
      case "xls":
      case "xlsx":
        return <FaFileExcel />;
    };
  };

  return (
    <Flex
      w="100%"
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Img
        src={Bg.src}
        position={'absolute'}
        opacity={0.3}
        w="350px"
        left="50%"
        top="40%"
        transform={'translate(-50%, -50%)'}
      />
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW="1000px"
      >
        {/* Model Change */}
        <Flex direction={'column'} w="100%" mb={loading || displayedResults.current > 0 ? '20px' : 'auto'}>
          <Flex
            mx="auto"
            zIndex="2"
            w="max-content"
            mb="20px"
            borderRadius="60px"
          >
          </Flex>
        </Flex>
        {/* Main Box */}
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={loading || displayedResults.current > 0 ? 'flex' : 'none'}
          mb={'auto'}
        >
          <Flex w="100%" align={'center'} mb="10px">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'transparent'}
              border="1px solid"
              borderColor={borderColor}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdPerson}
                width="20px"
                height="20px"
                color={brandColor}
              />
            </Flex>
            <Flex
              p="22px"
              border="1px solid"
              borderColor={borderColor}
              borderRadius="14px"
              w="100%"
              zIndex={'2'}
            >
              <Text
                color={textColor}
                fontWeight="600"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight={{ base: '24px', md: '26px' }}
              >
                {query}
              </Text>
            </Flex>
          </Flex>
          <Flex w="100%">
            <Flex
              borderRadius="full"
              justify="center"
              align="center"
              bg={'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)'}
              me="20px"
              h="40px"
              minH="40px"
              minW="40px"
            >
              <Icon
                as={MdAutoAwesome}
                width="20px"
                height="20px"
                color="white"
              />
            </Flex>
            <Card
              display={loading || displayedResults.current > 0 ? 'flex' : 'none'}
              // px="22px !important"
              pl="30px !important"
              pr="22px !important"
              color={textColor}
              minH="100px"
              fontSize={{ base: 'sm', md: 'md' }}
              lineHeight={{ base: '26px', md: '30px' }}
              fontWeight="500"
            >
              {resultsWithLinks.map((item, index) => (
                <div key={index}>
                  <Fade in={true}>
                    <div><b>{item.chatResult.name}:</b> {item.affinity}% coincidencia</div>
                    <div>{item.chatResult.comment}</div>
                  </Fade>
                  <SlideFade in={true} offsetY='20px' transition={{ enter: { delay: 0.1 } }}>
                    <span>
                      <Button
                        as="a"
                        href={`https://storage.googleapis.com/psa-gen-search/${item.filename}`}
                        target="_blank"
                        variant="outline"
                        size="sm"
                        leftIcon={handleFileIcon(item.filename)}
                        marginTop='.3rem'
                        marginBottom='0.8rem'
                        _hover={{
                          bg: "#4d2be6",
                          color: "#ffffff"
                        }}
                      >
                        {item.filename}
                      </Button>
                      {item.chatResult.email.includes("@") ?
                        <Button
                          as="a"
                          onClick={() => handleEmail(index)}
                          variant="outline"
                          size="sm"
                          isLoading={(emailLoading && selectedEmail == index) ? true : false}
                          loadingText="Creando correo..."
                          leftIcon={<MdEmail />}
                          marginLeft='.5rem'
                          marginTop='.3rem'
                          marginBottom='0.8rem'
                          // spacing="2"
                          _hover={{
                            bg: "#4d2be6",
                            color: "#ffffff",
                            cursor: "pointer"
                          }}
                        >
                          Contactar al candidato
                        </Button> : <Button
                          isDisabled={true}
                          variant="outline"
                          size="sm"
                          leftIcon={<ImBlocked />}
                          marginLeft='.5rem'
                          marginTop='.3rem'
                          marginBottom='0.8rem'
                        >
                          Candidato no tiene correo
                        </Button>}
                    </span>
                  </SlideFade>
                </div>
              ))}
              <Button
                display={(loading || displayedResults.current == searchResults.current.length) ? "none" : "flex"}
                size="md"
                marginTop="0.3em"
                padding="20px"
                variant="solid"
                onClick={() => handleLoadMore()}
                isLoading={loadingMore}
                loadingText="Cargando..."
                bg= "#f6f6f6"
                _hover={{
                  bg: "#4d2be6",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                Mostrar más ...
              </Button>
            </Card>
          </Flex>
        </Flex>
        {/* Chat Input */}
        <Flex
          ms={{ base: '0px', xl: '60px' }}
          mt="20px"
          justifySelf={'flex-end'}
        >
          <Input
            minH="54px"
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="45px"
            p="15px 20px"
            me="10px"
            fontSize="sm"
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Escribe su consulta aquí..."
            value={inputQuery}
            onChange={handleChange}
            onKeyDown={handleInput}
          />
          <Button
            variant="primary"
            py="20px"
            px="16px"
            fontSize="sm"
            borderRadius="45px"
            ms="auto"
            w={{ base: '160px', md: '210px' }}
            h="54px"
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg:
                'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
              _disabled: {
                bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)',
              },
            }}
            onClick={handleSubmit}
            isLoading={loading ? true : false}
          >
            Enviar
          </Button>
        </Flex>

        <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontSize="xs" textAlign="center" color={gray}>
            Herramienta de uso experimental, y puede regresar datos equivocados. Por favor valida la información proporcionada.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
