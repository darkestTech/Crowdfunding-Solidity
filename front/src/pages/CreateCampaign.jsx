import React, { useState } from "react";
import { Box, Input, Button, Textarea, Heading } from "@chakra-ui/react";
import useContract from "../hooks/useContract";

const CreateCampaign = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    imageURI: "",
    goal: "",
    duration: "",
  });

  const contract = useContract();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!contract) return;
    try {
      const tx = await contract.createCampaign(
        form.title,
        form.description,
        form.category,
        form.imageURI,
        ethers.parseEther(form.goal),
        Number(form.duration)
      );
      await tx.wait();
      alert("Campaign created!");
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  return (
    <Box p={5}>
      <Heading>Create Campaign</Heading>
      <Input mt={3} name="title" placeholder="Title" onChange={handleChange} />
      <Textarea mt={3} name="description" placeholder="Description" onChange={handleChange} />
      <Input mt={3} name="category" placeholder="Category" onChange={handleChange} />
      <Input mt={3} name="imageURI" placeholder="Image URL" onChange={handleChange} />
      <Input mt={3} name="goal" placeholder="Goal in ETH" onChange={handleChange} />
      <Input mt={3} name="duration" placeholder="Duration in Days" onChange={handleChange} />
      <Button mt={5} colorScheme="teal" onClick={handleCreate}>Create</Button>
    </Box>
  );
};

export default CreateCampaign;
