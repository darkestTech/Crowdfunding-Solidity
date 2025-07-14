import { Box, Heading, Text, Button, Flex, Image } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Hero = () => {
  return (
    <Box px={6} py={16} bg="gray.50">
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
      >
        {/* Text Section */}
        <Box flex="1" mr={{ md: 10 }} mb={{ base: 10, md: 0 }}>
          <Heading as="h1" size="2xl" mb={4} color="purple.600">
            Empower Ideas Through Crypto Crowdfunding
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            Launch or support powerful projects with the power of blockchain. No banks. No middlemen. Just you, your story, and your supporters.
          </Text>
          <Flex gap={4}>
            <Button
              as={RouterLink}
              to="/create"
              colorScheme="purple"
              size="lg"
            >
              Create Campaign
            </Button>
            <Button
              as={RouterLink}
              to="/"
              variant="outline"
              colorScheme="purple"
              size="lg"
            >
              Explore Campaigns
            </Button>
          </Flex>
        </Box>

        {/* Illustration / Image */}
        <Box flex="1" textAlign="center">
          <Image
            src="https://illustrations.popsy.co/gray/web3-wallet.svg"
            alt="Crowdfunding"
            maxH="300px"
            mx="auto"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Hero;
