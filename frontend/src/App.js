import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// CONTRACT ADDRESSES
const ENT_CONTRACT = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const USDC_CONTRACT = "0x04770267A5561a29B969A7372D563604f2C9D86e"; // Standard Arc Testnet USDC (Isay verify karlein)
const MY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0");
  const [usdcAmount, setUsdcAmount] = useState(10); // Default 10 USDC

  async function checkBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT, abi, provider);
      const bal = await contract.balanceOf(address);
      setEntBalance(ethers.formatUnits(bal, 18));
    } catch (err) { console.log("Balance check error"); }
  }

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      checkBalance(accounts[0]);
    }
  }

  // ASLI REAL-TIME PURCHASE LOGIC
  async function buyENT() {
    if (!walletAddress) return alert("Connect Wallet First!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Step 1: USDC Approval (MetaMask popup 1)
      const usdcABI = [
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function transfer(address to, uint256 amount) public returns (bool)"
      ];
      const usdcContract = new ethers.Contract(USDC_CONTRACT, usdcABI, signer);
      
      const amount = ethers.parseUnits(usdcAmount.toString(), 6); // USDC typically has 6 decimals
      
      alert("Step 1: MetaMask par USDC kharch karne ki ijazat (Approve) dein.");
      const approveTx = await usdcContract.approve(MY_WALLET, amount);
      await approveTx.wait();

      // Step 2: Transfer USDC to your wallet (MetaMask popup 2)
      alert("Step 2: USDC Transfer confirm karein.");
      const transferTx = await usdcContract.transfer(MY_WALLET, amount);
      await transferTx.wait();

      alert("Success! USDC deduct ho gaye hain aur ENT jald credit honge.");
      checkBalance(walletAddress);
    } catch (err) {
      alert("Transaction failed! Kya aapke paas kafi USDC hain?");
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

      <div style={{ maxWidth: '450px', margin: '50px auto', background: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' }}>
        <h3>ENT TOKEN BALANCE</h3>
        <h1 style={{ color: '#38bdf8', fontSize: '3rem' }}>{entBalance}</h1>
        
        {walletAddress && (
          <div style={{ marginTop: '30px' }}>
            <p style={{ color: '#94a3b8' }}>How many USDC you want to pay?</p>
            <input 
              type="number" 
              value={usdcAmount} 
              onChange={(e) => setUsdcAmount(e.target.value)}
              style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '15px', borderRadius: '10px', width: '80%', fontSize: '1.2rem', textAlign: 'center' }}
            />
            <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '10px' }}>You will receive: {usdcAmount * 10} ENT</p>
            <button onClick={buyENT} style={buyBtn}>PURCHASE ENT NOW</button>
          </div>
        )}
      </div>
    </div>
  );
}

const connectBtn = { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const connectedBtn = { ...connectBtn, background: '#10b981', color: '#fff' };
const buyBtn = { background: '#10b981', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '20px', width: '100%', cursor: 'pointer' };

export default App;
