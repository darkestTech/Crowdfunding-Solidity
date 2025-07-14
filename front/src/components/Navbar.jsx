import {
  Box,
  Flex,
  Button,
  Heading,
  Spacer,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

import { Link } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const toast = useToast();

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({ title: "Install MetaMask", status: "error" });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      toast({ title: "Wallet connected", status: "success" });
    } catch (err) {
      toast({ title: "Wallet connection failed", status: "error" });
    }
  };

  return (
    <Box bg="white" px={6} py={4} shadow="md" position="sticky" top="0" zIndex="100">
      <Flex align="center">
        <Heading size="md" color="purple.600">
          <Link to="/">ZenithFund</Link>
        </Heading>

        <Spacer />

        <Flex gap={4} align="center">
          <ChakraLink as={Link} to="/" fontWeight="medium" _hover={{ textDecoration: "underline" }}>
            Home
          </ChakraLink>

          <ChakraLink as={Link} to="/create" fontWeight="medium" _hover={{ textDecoration: "underline" }}>
            Create Campaign
          </ChakraLink>

          {account ? (
            <Button colorScheme="purple" variant="outline">
              {account.slice(0, 6)}...{account.slice(-4)}
            </Button>
          ) : (
            <Button colorScheme="purple" onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
