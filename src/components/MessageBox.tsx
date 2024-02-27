import ReactMarkdown from 'react-markdown'
import {
  Button,
  useColorModeValue,
  SlideFade
} from '@chakra-ui/react'
import Card from '@/components/card/Card'
import { FaFilePdf } from "react-icons/fa";

export default function MessageBox(props: { output: string, isLoading: boolean, references: Array<String> }) {
  const { output, isLoading, references } = props;
  const textColor = useColorModeValue('navy.700', 'white');

  // let restrictedReferences = references.slice(0, )
  let restrictedReferences = references;

  const docsReferencia = restrictedReferences.map(fileName => 
      <Button
        as="a"
        href={`https://storage.googleapis.com/psa-gen-search/${fileName}`}
        target="_blank"
        variant="outline"
        size="sm"
        leftIcon={<FaFilePdf />}
        marginLeft='.3rem'
        marginTop='.5rem'
        // spacing="2"
        _hover={{
          bg: "#4d2be6",
          color: "#ffffff"
        }}
      >
        {fileName}
      </Button>
  )

  return (
    <Card
      display={output ? 'flex' : 'none'}
      // px="22px !important"
      pl="30px !important"
      pr="22px !important"
      color={textColor}
      minH="100px"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight={{ base: '26px', md: '30px' }}
      fontWeight="500"
    >
      <ReactMarkdown className="font-medium">
        {output ? output : ''}
      </ReactMarkdown>
      {!isLoading && <span><SlideFade in={true} offsetY='20px' transition={{enter: {delay: 0.25}}}>{docsReferencia}</SlideFade></span>}
    </Card>
  )
}
