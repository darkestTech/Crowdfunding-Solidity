import React from "react";
import "./CampaignCard.css";

const CampaignCard = ({ title, description, goal, image }) => {
  return (
    <div className="campaign-card">
      <img src={image} alt={title} className="campaign-image" />
      <div className="campaign-content">
        <h3 className="campaign-title">{title}</h3>
        <p className="campaign-description">{description}</p>
        <p className="campaign-goal">🎯 Goal: {goal} ETH</p>
      </div>
    </div>
  );
};

export default CampaignCard;
