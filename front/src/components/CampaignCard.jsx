import React from "react";
import { Box, Image, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const CampaignCard = ({ campaign }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Image src={campaign.imageURI} alt={campaign.title} borderRadius="md" />
      <Text fontWeight="bold" mt={2}>{campaign.title}</Text>
      <Text>{campaign.description}</Text>
      <Link to={`/campaign/${campaign.id}`}>
        <Button mt={3} colorScheme="teal">View Details</Button>
      </Link>
    </Box>
  );
};

export default CampaignCard;
