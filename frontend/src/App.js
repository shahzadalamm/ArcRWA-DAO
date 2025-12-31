import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// ADDRESSES
const ENT_CONTRACT = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const MY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0");

  // Balance Check Karne ka Function
  async function checkBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT, abi, provider);
      const bal = await contract.balanceOf(address);
      setEntBalance(ethers.formatUnits(bal, 18));
    } catch (err) {
      console.log("Balance check failed");
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        checkBalance(accounts[0]); // Connect hote hi balance check karega
      } catch (error) {
        alert("Connection reject kar di gayi.");
      }
    } else {
      alert("MetaMask App ke browser mein kholien!");
    }
  }

  async function buyENT() {
    if (!walletAddress) return alert("Pehle wallet connect karein!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: MY_WALLET,
        value: ethers.parseEther("0.001") 
      });
      
      alert("Transaction Sent! Wait for confirmation.");
      await tx.wait();
      alert("ENT Purchase Successful!");
      checkBalance(walletAddress); // Khareedne ke baad balance update karega
    } catch (err) {
      alert("Transaction failed!");
    }
  }

  return (
    <div style={{ background: '#020617', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>ARC <span style={{color: '#fff'}}>DEV-HUB</span></h2>
        <button onClick={connectWallet} style={walletAddress ? connectedStyle : btnStyle}>
          {walletAddress ? `CONNECTED: ${walletAddress.substring(0,6)}...` : "CONNECT WEB3 WALLET"}
        </button>
      </nav>

      <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
        {!walletAddress ? (
          <div style={glassCard}>
            <h1>Portal Locked 🔒</h1>
            <button onClick={connectWallet} style={bigBtn}>UNLOCK PORTAL</button>
          </div>
        ) : (
          <div style={glassCard}>
            <h3 style={{color: '#10b981'}}>Welcome Developer! ✅</h3>
            
            {/* YE RAHI AAPKI BALANCE WALI LINE */}
            <div style={balanceBox}>
              <p style={{margin: 0, fontSize: '0.9rem', color: '#94a3b8'}}>CURRENT HOLDINGS</p>
              <h2 style={{margin: '5px 0', color: '#38bdf8'}}>{entBalance} ENT</h2>
            </div>

            <p style={{fontSize: '0.8rem', color: '#94a3b8'}}>{walletAddress}</p>
            <hr style={{borderColor: '#1e293b', margin: '20px 0'}} />
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <button onClick={buyENT} style={actionBtn}>BUY ENT (GAS IN USDC)</button>
              <button style={actionBtnSecondary}>POST ARC PROJECT (COST: 50 ENT)</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// STYLING
const btnStyle = { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const connectedStyle = { ...btnStyle, background: '#10b981', color: '#fff' };
const glassCard = { background: '#0f172a', padding: '40px', borderRadius: '16px', border: '1px solid #1e293b' };
const balanceBox = { background: '#1e293b', padding: '15px', borderRadius: '10px', margin: '20px 0', border: '1px dashed #38bdf8' };
const bigBtn = { background: '#38bdf8', border: 'none', padding: '15px 40px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const actionBtn = { background: '#10b981', color: 'white', border: 'none', padding: '15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const actionBtnSecondary = { ...actionBtn, background: '#3b82f6' };

export default App;
