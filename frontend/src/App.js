import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ENT_CONTRACT = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const MY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("Checking...");

  // Force Refresh Balance Function
  async function checkBalance(address) {
    if (!address) return;
    try {
      // Browser ke wallet se direct connection
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ];
      const contract = new ethers.Contract(ENT_CONTRACT, abi, provider);
      
      const [rawBalance, decimals] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals().catch(() => 18) // Default to 18 if call fails
      ]);

      const formatted = ethers.formatUnits(rawBalance, decimals);
      setEntBalance(parseFloat(formatted).toFixed(2)); // Sirf 2 decimal tak dikhaye ga
    } catch (err) {
      console.error("Balance Error:", err);
      setEntBalance("0.00");
    }
  }

  // Auto-Refresh Logic (Har 5 second baad check karega)
  useEffect(() => {
    if (walletAddress) {
      const interval = setInterval(() => checkBalance(walletAddress), 5000);
      return () => clearInterval(interval);
    }
  }, [walletAddress]);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        checkBalance(accounts[0]);
      } catch (error) { alert("Rejected!"); }
    } else { alert("Use MetaMask Browser!"); }
  }

  async function buyENT() {
    if (!walletAddress) return alert("Connect Wallet!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setEntBalance("Updating...");
      
      const tx = await signer.sendTransaction({
        to: MY_WALLET,
        value: ethers.parseEther("0.001") 
      });
      
      await tx.wait();
      alert("Success! Balance will update in 5 seconds.");
      checkBalance(walletAddress);
    } catch (err) { alert("Failed!"); }
  }

  return (
    <div style={{ background: '#020617', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', background: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>ARC <span style={{color: '#fff'}}>DEV-HUB</span></h2>
        <button onClick={connectWallet} style={walletAddress ? connectedStyle : btnStyle}>
          {walletAddress ? `CONNECTED: ${walletAddress.substring(0,6)}...` : "CONNECT WALLET"}
        </button>
      </nav>

      <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
        <div style={glassCard}>
          <div style={balanceBox}>
            <p style={{color: '#94a3b8', margin: 0}}>YOUR ENT BALANCE</p>
            <h1 style={{fontSize: '3rem', color: '#38bdf8', margin: '10px 0'}}>{entBalance}</h1>
            <p style={{fontSize: '0.8rem', color: '#10b981'}}>Live from Arc Blockchain</p>
          </div>

          {!walletAddress ? (
            <button onClick={connectWallet} style={bigBtn}>UNLOCK PORTAL</button>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <button onClick={buyENT} style={actionBtn}>BUY ENT TOKEN</button>
              <button style={actionBtnSecondary} disabled={parseFloat(entBalance) < 50}>
                POST PROJECT (NEED 50 ENT)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle = { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold' };
const connectedStyle = { ...btnStyle, background: '#10b981', color: '#fff' };
const glassCard = { background: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b', boxShadow: '0 0 20px rgba(56, 189, 248, 0.1)' };
const balanceBox = { marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' };
const bigBtn = { width: '100%', background: '#38bdf8', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const actionBtn = { background: '#10b981', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const actionBtnSecondary = { ...actionBtn, background: '#1e293b', color: '#475569' };

export default App;
