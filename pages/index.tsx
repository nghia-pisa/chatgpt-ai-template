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
import { useState, useEffect } from 'react';
import { MdAutoAwesome, MdPerson } from 'react-icons/md';
import Bg from '../public/img/chat/Logo-GP-Blanco.png';
import Card from '@/components/card/Card'
import { FaFilePdf } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { ImBlocked } from "react-icons/im";

interface SearchResult {
  _additional: object;
  filename: string;
  text: string;
}
interface resultsWithLinks {
  chatResult: {
    name: string,
    email: string,
    score: string,
    comment: string
  };
  filename: string
}

export default function Chat() {
  // Input States
  const [query, setQuery] = useState<string>("");
  const [inputQuery, setInputQuery] = useState<string>("");
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  // Loading state (Load more)
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  // Load more count
  const [count, setCount] = useState<number>(0);
  // Email loading state
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  // Selected email state
  const [selectedEmail, setSelectedEmail] = useState<number>();
  // Search results
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // Final results
  const [resultsWithLinks, setResultsWithLinks] = useState<resultsWithLinks[]>([]);

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
    try {
      const searchRequest = await fetch('/api/search', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "query": inputQuery })
      });
      if (!searchRequest.ok) {
        throw new Error('Network response was not ok');
      }
      const results = await searchRequest.json();
      setSearchResults(results.data.Get.Cvs);
    } catch (error) {
      console.error('There was an error fetching the data', error);
    }
  };
  
  const resultsPerLoad = 2
  const handleLLM = async () => {
    const startIndex = resultsPerLoad * count
    const endIndex = resultsPerLoad * (count + 1)
    for (let i = startIndex; i < endIndex; i++) {
      let searchResult = searchResults[i]
      try {
        const chatRequest = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "updatedQuery": `Given the following job description:\n${inputQuery}.\nGive a comment between 50-80 words in spanish and an evaluation score on fit out of 10 of the following candidate:\n${searchResult.text}\nFormat the response in JSON with the following schema: {"name": candidate's full name with capitalized first letters, "email": candidate's email if exists, else blank string, "score": evaluation score, "comment": comment}` }),
        });
        if (!chatRequest.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await chatRequest.json();
        // Append each new piece of data along with its original text to the array
        setResultsWithLinks(prevResults => [...prevResults, { chatResult: JSON.parse(result.choices[0].message.content), filename: searchResult.filename }]);
      } catch (error) {
        console.error('There was an error fetching the data', error);
      }
    };
    setLoading(false);
    setLoadingMore(false);
  };
  
  const handleSubmit = () => {
    setLoading(true);
    setSearchResults([]);
    setResultsWithLinks([]);
    setQuery(inputQuery);
    setInputQuery("");

    handleSearch();
    console.log(searchResults);
    handleLLM();
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

  const handleLoadMore = () => {
    setLoadingMore(true);
    setCount(c => c + 1);
    handleLLM();
    setLoadingMore(false);
  }

  const handleEmail = (index: number) => {

    setEmailLoading(true)
    setSelectedEmail(index)

    const selectedCandidate = searchResults[index].text;
    
    (async () => {
      try {
        const emailRequest = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "updatedQuery": `Given the following job description:\n${query}.\And the following CV:\n${selectedCandidate}\nWrite up a polite email (120-160 words) in Spanish to invite the candidate to participate in the selection process of Grupo PiSA. Address the candidate using first name. Includes a short comment on the candidate's fit. Format the response in JSON with the following schema: {"subject": email's subject, "body": email's body, "email": candidate's email}` }),
        });
        if (!emailRequest.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await emailRequest.json();
        // Append each new piece of data along with its original text to the array
        const jsonResult = JSON.parse(result.choices[0].message.content)
        const emailBody = jsonResult.body.replace(/\n/g, '%0D%0A');

        window.location.href = `mailto:${jsonResult.email}?subject=${jsonResult.subject}&body=${emailBody}`;
        
        setEmailLoading(false)
      } catch (error) {
        console.error('There was an error fetching the data', error);
      }
    })();
  }

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
        <Flex direction={'column'} w="100%" mb={loading || resultsWithLinks.length > 0 ? '20px' : 'auto'}>
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
          display={loading || resultsWithLinks.length > 0 ? 'flex' : 'none'}
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
              display={loading || resultsWithLinks.length > 0 ? 'flex' : 'none'}
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
                <div id={String(index)}>
                  <Fade in={true}>
                    <div><b>{item.chatResult.name}:</b> {item.chatResult.score}/10</div>
                    <div>{item.chatResult.comment}</div>
                  </Fade>
                  <SlideFade in={true} offsetY='20px' transition={{ enter: { delay: 0.25 } }}>
                    <span>
                      <Button
                        as="a"
                        href={`https://storage.googleapis.com/psa-gen-search/${item.filename}`}
                        target="_blank"
                        variant="outline"
                        size="sm"
                        leftIcon={<FaFilePdf />}
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
                display={loading ? "none" : "flex"}
                size="md"
                padding="20px"
                variant="solid"
                onClick={() => handleLoadMore()}
                isLoading={loadingMore}
                _hover={{
                  bg: "#4d2be6",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                Cargar más ...
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
