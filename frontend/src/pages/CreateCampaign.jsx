import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

const CreateCampaign = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageURI, setImageURI] = useState("");
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.ethereum) return alert("MetaMask not detected!");

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const goalInWei = ethers.parseEther(goal); // convert ETH → wei

      const tx = await contract.createCampaign(
        title,
        description,
        category,
        imageURI,
        goalInWei,
        duration // in days
      );

      await tx.wait(); // wait for tx confirmation

      alert("✅ Campaign created successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      setImageURI("");
      setGoal("");
      setDuration("");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("❌ Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h1 style={{ textAlign: "center" }}>🎯 Create a New Campaign</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Campaign Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category (e.g. Health, Education)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={imageURI}
          onChange={(e) => setImageURI(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Goal (in ETH)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Duration (in days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "⏳ Creating..." : "🚀 Create Campaign"}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
