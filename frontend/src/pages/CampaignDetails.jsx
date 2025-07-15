import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

const CampaignDetails = () => {
  const { id } = useParams(); // get campaign ID from URL
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch campaign data directly inside useEffect
  useEffect(() => {
    const fetchData = async () => {
      if (!window.ethereum) return alert("MetaMask not detected!");
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const data = await contract.getCampaign(id);

        setCampaign({
          owner: data.owner,
          title: data.title,
          description: data.description,
          category: data.category,
          image: data.imageURI,
          goal: ethers.formatEther(data.goal),
          raised: ethers.formatEther(data.raisedAmount),
          deadline: new Date(Number(data.deadline) * 1000).toLocaleDateString(),
          isClaimed: data.isClaimed,
        });
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // call inner function
  }, [id]); // only re-run if campaign id changes

  // Contribute to campaign
  const handleContribute = async (e) => {
    e.preventDefault();
    if (!window.ethereum) return alert("MetaMask not detected!");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.contribute(id, {
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      alert(`✅ You contributed ${amount} ETH!`);
      setAmount("");

      // Refresh campaign data after contributing
      const updatedData = await contract.getCampaign(id);
      setCampaign({
        owner: updatedData.owner,
        title: updatedData.title,
        description: updatedData.description,
        category: updatedData.category,
        image: updatedData.imageURI,
        goal: ethers.formatEther(updatedData.goal),
        raised: ethers.formatEther(updatedData.raisedAmount),
        deadline: new Date(Number(updatedData.deadline) * 1000).toLocaleDateString(),
        isClaimed: updatedData.isClaimed,
      });
    } catch (error) {
      console.error("Error contributing:", error);
      alert("❌ Failed to contribute");
    }
  };

  // Withdraw funds (only owner)
  const handleWithdraw = async () => {
    if (!window.ethereum) return alert("MetaMask not detected!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.withdraw(id);
      await tx.wait();
      alert("✅ Funds withdrawn successfully!");

      // Refresh campaign data after withdraw
      const updatedData = await contract.getCampaign(id);
      setCampaign({
        owner: updatedData.owner,
        title: updatedData.title,
        description: updatedData.description,
        category: updatedData.category,
        image: updatedData.imageURI,
        goal: ethers.formatEther(updatedData.goal),
        raised: ethers.formatEther(updatedData.raisedAmount),
        deadline: new Date(Number(updatedData.deadline) * 1000).toLocaleDateString(),
        isClaimed: updatedData.isClaimed,
      });
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert("❌ Withdraw failed. Are you the owner? Has the goal been reached?");
    }
  };

  // Refund (for contributors if goal not reached)
  const handleRefund = async () => {
    if (!window.ethereum) return alert("MetaMask not detected!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.refund(id);
      await tx.wait();
      alert("✅ Refund issued successfully!");
    } catch (error) {
      console.error("Error refunding:", error);
      alert("❌ Refund failed. Either goal was reached or campaign not ended yet.");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>⏳ Loading campaign...</p>;
  if (!campaign) return <p style={{ textAlign: "center", marginTop: "50px" }}>❌ Campaign not found</p>;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        background: "#fff",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <img src={campaign.image} alt={campaign.title} style={{ width: "100%", borderRadius: "12px" }} />

      <h1 style={{ marginTop: "1rem" }}>{campaign.title}</h1>
      <p style={{ color: "#555" }}>{campaign.description}</p>

      <div style={{ marginTop: "1rem" }}>
        <p><strong>🎯 Goal:</strong> {campaign.goal} ETH</p>
        <p><strong>✅ Raised:</strong> {campaign.raised} ETH</p>
        <p><strong>⏳ Deadline:</strong> {campaign.deadline}</p>
        <p><strong>👤 Owner:</strong> {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}</p>
      </div>

      {/* Contribute Form */}
      <form
        onSubmit={handleContribute}
        style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}
      >
        <input
          type="number"
          placeholder="Enter ETH amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{
            flex: 1,
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.8rem 1.5rem",
            background: "#3a0ca3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          💰 Contribute
        </button>
      </form>

      {/* Withdraw & Refund Buttons */}
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={handleWithdraw}
          style={{
            flex: 1,
            padding: "0.8rem 1rem",
            background: "green",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ✅ Withdraw (Owner)
        </button>

        <button
          onClick={handleRefund}
          style={{
            flex: 1,
            padding: "0.8rem 1rem",
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🔄 Refund (Contributor)
        </button>
      </div>
    </div>
  );
};

export default CampaignDetails;
