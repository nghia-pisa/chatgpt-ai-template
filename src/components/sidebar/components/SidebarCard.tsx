import {
  Button,
  Flex,
  Link,
  Img,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import logoWhite from '../../../../public/img/layout/logoWhite.png';

export default function SidebarDocs() {
  const bgColor = 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)';
  const borderColor = useColorModeValue('white', 'navy.800');

  return (
    <Flex
      justify="center"
      direction="column"
      align="center"
      bg={bgColor}
      borderRadius="16px"
      position="relative"
    >
      <Flex
        direction="column"
        mb="12px"
        align="center"
        justify="center"
        px="15px"
        pt="55px"
      >
        <Text
          fontSize={{ base: 'lg', xl: '18px' }}
          color="white"
          fontWeight="bold"
          lineHeight="150%"
          textAlign="center"
          mb="14px"
        >
          Go unlimited with PRO
        </Text>
        <Text fontSize="14px" color={'white'} mb="14px" textAlign="center">
          Get your AI Project to another level and start doing more with Horizon
          AI Template PRO!
        </Text>
      </Flex>
    </Flex>
  );
}
