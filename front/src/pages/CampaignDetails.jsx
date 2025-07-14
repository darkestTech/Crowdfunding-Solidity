import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, Input } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useContract from "../hooks/useContract";
import { ethers } from "ethers";

const CampaignDetails = () => {
  const { id } = useParams();
  const contract = useContract();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");

  const loadCampaign = async () => {
    if (!contract) return;
    const data = await contract.getCampaign(id);
    setCampaign(data);
  };

  const contribute = async () => {
    if (!contract || !amount) return;
    try {
      const tx = await contract.contribute(id, { value: ethers.parseEther(amount) });
      await tx.wait();
      alert("Thank you for contributing!");
    } catch (e) {
      console.error("Contribution failed:", e);
    }
  };

  useEffect(() => {
    loadCampaign();
  }, [contract]);

  if (!campaign) return <Text>Loading...</Text>;

  return (
    <Box p={5}>
      <Heading>{campaign.title}</Heading>
      <Text mt={2}>{campaign.description}</Text>
      <Text mt={2}>Goal: {ethers.formatEther(campaign.goal)} ETH</Text>
      <Text mt={2}>Raised: {ethers.formatEther(campaign.raisedAmount)} ETH</Text>
      <Input mt={4} placeholder="Amount in ETH" onChange={(e) => setAmount(e.target.value)} />
      <Button mt={2} colorScheme="green" onClick={contribute}>Contribute</Button>
    </Box>
  );
};

export default CampaignDetails;
