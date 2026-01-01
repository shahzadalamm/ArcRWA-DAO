import React, { useState } from 'react';
import { ethers } from 'ethers';

// CONTRACT CONFIG
const ENT_CONTRACT_ADDRESS = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [isProcessing, setIsProcessing] = useState(false);

  // Is function se hum direct blockchain ka asli data read karte hain
  async function syncBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, provider);
      const balance = await contract.balanceOf(address);
      setEntBalance(ethers.formatUnits(balance, 18));
    } catch (e) { console.error("Sync failed"); }
  }

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      syncBalance(accounts[0]);
    }
  }

  // ASLI TRANSACTION: Jo actually balance change karegi
  async function buyTokens() {
    if (!walletAddress) return alert("Connect Wallet!");
    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // IMPORTANT: Hum "Value" bhej rahe hain 10 USDC ki
      const tx = await signer.sendTransaction({
        to: ENT_CONTRACT_ADDRESS, // Direct contract ko paisay bhejein
        value: ethers.parseEther("10.0"), // Poore 10 USDC
        gasLimit: 150000
      });

      alert("Transaction Sent! Waiting for Blockchain to confirm...");
      await tx.wait(); // Yahan rukanay se hi data save hota hai
      
      alert("Success! Re-syncing your permanent balance...");
      setTimeout(() => syncBalance(walletAddress), 5000);
    } catch (err) {
      alert("Transaction Failed! Check if you have enough balance.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div style={{ background: '#020617', color: 'white', minHeight: '100vh', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '20px', background: '#0f172a', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' }}>
        <h2 style={{color: '#38bdf8'}}>ARC <span style={{color: '#fff'}}>RWA HUB</span></h2>
        <button onClick={connectWallet} style={{background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold'}}>
          {walletAddress ? "Connected" : "Connect Wallet"}
        </button>
      </nav>

      <div style={{ maxWidth: '400px', margin: '60px auto', background: '#0f172a', padding: '40px', borderRadius: '25px', border: '1px solid #1e293b' }}>
        <p style={{color: '#94a3b8', fontSize: '0.8rem'}}>BLOCKCHAIN VERIFIED BALANCE</p>
        <h1 style={{color: '#38bdf8', fontSize: '3.5rem', margin: '10px 0'}}>{entBalance}</h1>
        
        {walletAddress && (
          <button 
            onClick={buyTokens} 
            disabled={isProcessing}
            style={{ width: '100%', padding: '15px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }}
          >
            {isProcessing ? "COMMITTING TO CHAIN..." : "PURCHASE 100 ENT (10 USDC)"}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
