import React, { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import CampaignCard from "../components/CampaignCard";
import useContract from "../hooks/useContract";

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const contract = useContract();

  const loadCampaigns = async () => {
    try {
      if (!contract) return;
      const total = await contract.campaignCount();
      const fetched = [];

      for (let i = 1; i <= total; i++) {
        const campaign = await contract.getCampaign(i);
        fetched.push({ id: i, ...campaign });
      }

      setCampaigns(fetched);
    } catch (error) {
      console.error("Error loading campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [contract]);

  return (
    <Box p={5}>
      <Heading mb={5}>Explore Campaigns</Heading>
      {loading ? (
        <Spinner />
      ) : campaigns.length > 0 ? (
        <SimpleGrid columns={[1, 2, 3]} spacing={5}>
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </SimpleGrid>
      ) : (
        <Text>No campaigns found</Text>
      )}
    </Box>
  );
};

export default Home;
