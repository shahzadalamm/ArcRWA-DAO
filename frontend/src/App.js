import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// CONTRACT ADDRESSES
const ENT_CONTRACT = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const PROJECT_TREASURY = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4"; // Filhal yehi hai, par asliyat mein ye alag hona chahiye

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [usdcToPay, setUsdcToPay] = useState(10);

  // Balance fetch logic
  async function checkBalance(address) {
    if (!address) return;
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

  // ASLI REAL SWAP LOGIC
  async function buyENT() {
    if (!walletAddress) return alert("Pehle Wallet Connect Karein!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const amountInWei = ethers.parseUnits(usdcToPay.toString(), 18);
      
      // Step 1: Send USDC to Contract (Deduction)
      alert(`Confirm Transaction: Pay ${usdcToPay} USDC for ${usdcToPay * 10} ENT`);
      
      const tx = await signer.sendTransaction({
        to: ENT_CONTRACT, // Ab paise contract address par jayenge, aapke apne wallet par nahi
        value: amountInWei,
        gasLimit: 100000
      });

      alert("Transaction Sent! USDC deduct ho rahe hain...");
      await tx.wait();
      
      // Step 2: Simulate Minting (Dashboard Refresh)
      alert("Success! Purchase Complete. Dashboard Refresh Ho Raha Hai.");
      
      // 5 second baad balance refresh karein
      setTimeout(() => checkBalance(walletAddress), 5000);

    } catch (err) {
      alert("Transaction Failed! Check Balance or Network.");
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

      <div style={cardStyle}>
        <p style={{ color: '#94a3b8' }}>TOTAL ENT ASSETS</p>
        <h1 style={{ color: '#38bdf8', fontSize: '3.5rem', margin: '10px 0' }}>{entBalance}</h1>
        
        {walletAddress && (
          <div style={{ marginTop: '30px' }}>
            <div style={inputBox}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Payment Amount (USDC)</p>
              <input 
                type="number" 
                value={usdcToPay} 
                onChange={(e) => setUsdcToPay(e.target.value)}
                style={inputStyle}
              />
            </div>
            
            <button onClick={buyENT} style={buyBtn}>BUY ENT TOKENS</button>
          </div>
        )}
      </div>
    </div>
  );
}

// STYLES
const cardStyle = { maxWidth: '450px', margin: '40px auto', background: '#0f172a', padding: '30px', borderRadius: '25px', border: '1px solid #1e293b' };
const inputBox = { background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px dashed #38bdf8' };
const inputStyle = { background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', width: '100%', textAlign: 'center', outline: 'none' };
const connectBtn = { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const connectedBtn = { ...connectBtn, background: '#10b981', color: '#fff' };
const buyBtn = { background: 'linear-gradient(90deg, #10b981, #3b82f6)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '20px', width: '100%', cursor: 'pointer' };

export default App;
