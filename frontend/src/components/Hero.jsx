import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">🚀 Welcome to CrowdfundX</h1>
        <p className="hero-subtitle">
          Decentralized crowdfunding made easy. Create, fund, and support projects
          with full transparency on the blockchain.
        </p>
        <a href="/create" className="hero-button">
           Start a Campaign
        </a>
      </div>
    </section>
  );
};

export default Hero;
