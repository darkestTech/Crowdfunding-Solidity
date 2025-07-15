import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import "./Navbar.css";

const Navbar = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User rejected connection:", error);
      }
    } else {
      alert("MetaMask not detected! Please install it.");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">CrowdfundX</div>

      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/create"> Create Campaign</Link>
        </li>
      </ul>

      <div className="wallet-section">
        {account ? (
          <span className="wallet-address">
            ✅ {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        ) : (
          <button className="wallet-button" onClick={connectWallet}>
            🔗 Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
