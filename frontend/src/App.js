import React, { useState } from 'react';
import { ethers } from 'ethers';

// AAPKE PROVIDED ADDRESSES
const ENT_CONTRACT = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const MY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4";

function App() {
  const [walletAddress, setWalletAddress] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (error) {
        alert("Connection reject kar di gayi.");
      }
    } else {
      alert("MetaMask App ke browser mein kholien!");
    }
  }

  // ASLI ENT PURCHASE LOGIC (TRANSACTION POPUP)
  async function buyENT() {
    if (!walletAddress) return alert("Pehle wallet connect karein!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Ye transaction MetaMask ka popup trigger karegi
      const tx = await signer.sendTransaction({
        to: MY_WALLET,
        value: ethers.parseEther("0.001") // Testing ke liye choti amount
      });
      
      alert("Transaction Sent! ArcScan par check karein.");
      await tx.wait();
      alert("ENT Purchase Successful!");
    } catch (err) {
      alert("Transaction failed! Balance check karein.");
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
            <p>Connect your Arc wallet to access the hub.</p>
            <button onClick={connectWallet} style={bigBtn}>UNLOCK PORTAL</button>
          </div>
        ) : (
          <div style={glassCard}>
            <h3 style={{color: '#10b981'}}>Welcome Developer! ✅</h3>
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
const bigBtn = { background: '#38bdf8', border: 'none', padding: '15px 40px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const actionBtn = { background: '#10b981', color: 'white', border: 'none', padding: '15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const actionBtnSecondary = { ...actionBtn, background: '#3b82f6' };

export default App;
