import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Hero from "../components/Hero";
import CampaignCard from "../components/CampaignCard";
import { Link } from "react-router-dom";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const total = await contract.campaignCount();
      const totalCount = parseInt(total);

      let campaignList = [];
      for (let i = 1; i <= totalCount; i++) {
        const campaign = await contract.getCampaign(i);
        campaignList.push({
          id: i,
          title: campaign.title,
          description: campaign.description,
          goal: ethers.formatEther(campaign.goal),
          raised: ethers.formatEther(campaign.raisedAmount),
          deadline: new Date(Number(campaign.deadline) * 1000).toLocaleDateString(),
          image: campaign.imageURI,
        });
      }

      setCampaigns(campaignList);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div>
      <Hero />

      <div style={{ padding: "2rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          🔥 Explore Campaigns
        </h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>⏳ Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p style={{ textAlign: "center" }}>No campaigns found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {campaigns.map((c) => (
              <div key={c.id}>
                <CampaignCard
                  title={c.title}
                  description={c.description}
                  goal={c.goal}
                  image={c.image}
                />
                <div style={{ textAlign: "center", padding: "1rem" }}>
                  <Link to={`/campaign/${c.id}`}>
                    <button
                      style={{
                        padding: "0.6rem 1.2rem",
                        background: "#3a0ca3",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
