import { useState, useEffect } from "react";

export const useWallet = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) setAccount(accounts[0]);
      }
    };
    checkConnection();
  }, []);

  return { account, connectWallet };
};
