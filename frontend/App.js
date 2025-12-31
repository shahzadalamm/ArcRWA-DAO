import React, { useState } from 'react';
import { ethers } from 'ethers';

const ENT_CONTRACT = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const MY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [usdcAmount, setUsdcAmount] = useState(10);

  async function checkBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT, abi, provider);
      const bal = await contract.balanceOf(address);
      setEntBalance(parseFloat(ethers.formatUnits(bal, 18)).toFixed(2));
    } catch (err) { console.log("Balance fetch error"); }
  }

  async function buyENT() {
    if (!walletAddress) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Is bar hum "Gas Token" ko move karne ke liye sahi format use karenge
      const tx = await signer.sendTransaction({
        to: MY_WALLET,
        value: ethers.parseEther(usdcAmount.toString()), // Pure 10 tokens
        gasLimit: 21000 // Standard transfer gas
      });

      alert("Transaction Sent! 10 USDC deduct ho rahe hain...");
      await tx.wait();
      alert("Deduction Successful! ENT jald credit honge.");
      checkBalance(walletAddress);
    } catch (err) {
      alert("Transaction Fail! Check if you have enough USDC.");
    }
  }

  return (
    <div style={{ background: '#020617', color: 'white', minHeight: '100vh', textAlign: 'center', padding: '20px' }}>
      <h2 style={{color: '#38bdf8'}}>ARC RWA GATEWAY</h2>
      {walletAddress ? (
        <div style={{background: '#0f172a', padding: '30px', borderRadius: '15px', maxWidth: '400px', margin: 'auto', border: '1px solid #1e293b'}}>
          <h1 style={{fontSize: '3rem', color: '#38bdf8'}}>{entBalance} ENT</h1>
          <input 
            type="number" 
            value={usdcAmount} 
            onChange={(e) => setUsdcAmount(e.target.value)}
            style={{padding: '10px', width: '100px', margin: '10px'}}
          />
          <button onClick={buyENT} style={{background: '#10b981', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>
            PAY {usdcAmount} USDC
          </button>
        </div>
      ) : (
        <button onClick={() => window.ethereum.request({method:'eth_requestAccounts'}).then(acc => setWalletAddress(acc[0]))} style={{padding: '15px 30px', background: '#38bdf8', border: 'none', borderRadius: '8px', fontWeight: 'bold'}}>
          CONNECT WALLET
        </button>
      )}
    </div>
  );
}

export default App;
