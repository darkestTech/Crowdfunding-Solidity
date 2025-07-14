import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

const useContract = () => {
  if (!window.ethereum) {
    console.error("MetaMask is not installed");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  return contract;
};

export default useContract;
