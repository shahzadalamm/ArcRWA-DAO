import React, { useState } from 'react';
import { ethers } from 'ethers';

function App() {
  const [walletAddress, setWalletAddress] = useState("");

  // ASLI WEB3 CONNECTION FUNCTION
  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // YE LINE METAMASK KA POPUP TRIGGER KAREGI
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        console.log("Connected to:", accounts[0]);
      } catch (error) {
        console.error("User rejected connection");
        alert("Wallet connection reject kar di gayi.");
      }
    } else {
      alert("MetaMask nahi mila! Agar aap mobile par hain toh MetaMask browser use karein.");
    }
  }

  return (
    <div style={{ background: '#020617', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', background: '#0f172a' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>ARC <span style={{color: '#fff'}}>DEV-HUB</span></h2>
        <button onClick={connectWallet} style={walletAddress ? connectedStyle : btnStyle}>
          {walletAddress ? `CONNECTED: ${walletAddress.substring(0,6)}...${walletAddress.substring(38)}` : "CONNECT WEB3 WALLET"}
        </button>
      </nav>

      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
        {!walletAddress ? (
          <div style={glassCard}>
            <h1 style={{fontSize: '2rem'}}>Access Denied 🔒</h1>
            <p style={{color: '#94a3b8'}}>Is portal ko use karne ke liye MetaMask connect karna zaroori hai.</p>
            <button onClick={connectWallet} style={bigBtn}>UNLOCK PORTAL</button>
          </div>
        ) : (
          <div style={glassCard}>
            <h3 style={{color: '#10b981'}}>Welcome, Developer! ✅</h3>
            <p>Aapka wallet Arc Network se secure tarike se jur chuka hai.</p>
            <hr style={{borderColor: '#1e293b', margin: '20px 0'}} />
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <button style={actionBtn}>BUY ENT (GAS IN USDC)</button>
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
const glassCard = { background: '#0f172a', padding: '40px', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const bigBtn = { background: '#38bdf8', border: 'none', padding: '15px 40px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '20px' };
const actionBtn = { background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' };
const actionBtnSecondary = { ...actionBtn, background: '#3b82f6' };

export default App;
