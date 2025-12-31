import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// AAPKE DETAILS
const ENT_CONTRACT = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const MY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [usdcToPay, setUsdcToPay] = useState(10); // Default 10 USDC

  async function checkBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT, abi, provider);
      const bal = await contract.balanceOf(address);
      setEntBalance(parseFloat(ethers.formatUnits(bal, 18)).toFixed(2));
    } catch (err) { console.log("Balance fetch error"); }
  }

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      checkBalance(accounts[0]);
    }
  }

  // ASLI REAL-TIME PURCHASE (NATIVE USDC TRANSFER)
  async function buyENT() {
    if (!walletAddress) return alert("Pehle Wallet Connect Karein!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      alert(`Confirm karein: ${usdcToPay} USDC for ${usdcToPay * 10} ENT`);
      
      // Chunke aapka USDC Native hai (0x000 address), hum direct value bhejenge
      const tx = await signer.sendTransaction({
        to: MY_WALLET,
        value: ethers.parseUnits(usdcToPay.toString(), 18) // 18 Decimals as per your screenshot
      });

      alert("Transaction Sent! USDC deduct ho rahe hain...");
      await tx.wait();
      
      alert("Success! Purchase Complete.");
      checkBalance(walletAddress);
    } catch (err) {
      alert("Transaction Failed! Balance check karein.");
      console.error(err);
    }
  }

  return (
    <div style={{ background: '#020617', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <nav style={{ padding: '20px', background: '#0f172a', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' }}>
        <h2 style={{ color: '#38bdf8' }}>ARC <span style={{color:'#fff'}}>GATEWAY</span></h2>
        <button onClick={connectWallet} style={walletAddress ? connectedBtn : connectBtn}>
          {walletAddress ? `Connected: ${walletAddress.substring(0,6)}...` : "CONNECT WALLET"}
        </button>
      </nav>

      <div style={{ maxWidth: '450px', margin: '40px auto', background: '#0f172a', padding: '30px', borderRadius: '25px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <p style={{ color: '#94a3b8', marginBottom: '5px' }}>YOUR ENT HOLDINGS</p>
        <h1 style={{ color: '#38bdf8', fontSize: '3.5rem', margin: '0' }}>{entBalance}</h1>
        
        {walletAddress && (
          <div style={{ marginTop: '30px' }}>
            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '15px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Enter USDC Amount</p>
              <input 
                type="number" 
                value={usdcToPay} 
                onChange={(e) => setUsdcToPay(e.target.value)}
                style={inputStyle}
              />
              <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '10px' }}>Estimated: {usdcToPay * 10} ENT Tokens</p>
            </div>
            
            <button onClick={buyENT} style={buyBtn}>PURCHASE ENT</button>
            <p style={{ fontSize: '0.7rem', color: '#475569', marginTop: '15px' }}>Gas fees will be visible on ArcScan</p>
          </div>
        )}
      </div>
    </div>
  );
}

// STYLES
const connectBtn = { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const connectedBtn = { ...connectBtn, background: '#10b981', color: '#fff' };
const inputStyle = { background: '#0f172a', border: '1px solid #38bdf8', color: 'white', padding: '12px', borderRadius: '10px', width: '70%', fontSize: '1.2rem', textAlign: 'center', outline: 'none' };
const buyBtn = { background: 'linear-gradient(90deg, #10b981, #059669)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '20px', width: '100%', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' };

export default App;
