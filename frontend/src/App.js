import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// YOUR ACTUAL CONTRACT ADDRESS
const ENT_CONTRACT_ADDRESS = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const TREASURY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState(10);

  // This function ONLY shows what is permanently saved on the Blockchain
  async function fetchBlockchainData(address) {
    if (!address) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, provider);
      
      const balance = await contract.balanceOf(address);
      // Converts from Wei to readable units (18 decimals)
      setEntBalance(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error("Sync Error:", error);
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      fetchBlockchainData(accounts[0]);
    }
  }

  // REAL TRANSACTION LOGIC
  async function executePurchase() {
    if (!walletAddress) return alert("Please connect wallet!");

    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Sending 10 USDC (Native Gas Token on Arc)
      const txValue = ethers.parseEther(amount.toString());

      const tx = await signer.sendTransaction({
        to: TREASURY_WALLET,
        value: txValue,
        gasLimit: 150000 
      });

      alert("Transaction sent! Waiting for Block Confirmation...");
      await tx.wait(); // This waits for the blockchain to record the transaction
      
      alert("Payment Successful! Re-syncing balance from Blockchain...");
      
      // We wait for the indexer to catch up, then fetch real data
      setTimeout(() => fetchBlockchainData(walletAddress), 5000);

    } catch (error) {
      alert("Transaction failed! Please check your balance.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={{color: '#38bdf8'}}>ARC <span style={{color: '#fff'}}>REAL-WORLD ASSETS</span></h2>
        <button onClick={connectWallet} style={styles.btn}>
          {walletAddress ? `Wallet Connected` : "Connect Wallet"}
        </button>
      </nav>

      <div style={styles.card}>
        <p style={{color: '#94a3b8', fontSize: '0.9rem'}}>PERMANENT ON-CHAIN BALANCE</p>
        <h1 style={{color: '#38bdf8', fontSize: '3.5rem'}}>{entBalance} ENT</h1>
        
        {walletAddress && (
          <div style={{marginTop: '30px'}}>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
            <button 
              onClick={executePurchase} 
              disabled={isProcessing}
              style={isProcessing ? styles.disabledBtn : styles.actionBtn}
            >
              {isProcessing ? "COMMITTING TO BLOCKCHAIN..." : `PURCHASE ENT`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#020617', color: 'white', minHeight: '100vh', textAlign: 'center', fontFamily: 'Arial, sans-serif' },
  nav: { padding: '20px 40px', background: '#0f172a', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' },
  card: { maxWidth: '450px', margin: '60px auto', background: '#0f172a', padding: '40px', borderRadius: '30px', border: '1px solid #1e293b' },
  input: { background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '15px', borderRadius: '12px', width: '80%', textAlign: 'center', marginBottom: '15px', fontSize: '1.2rem' },
  btn: { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  actionBtn: { background: 'linear-gradient(135deg, #2563eb, #38bdf8)', color: 'white', border: 'none', padding: '16px', borderRadius: '14px', width: '100%', fontWeight: 'bold', cursor: 'pointer' },
  disabledBtn: { background: '#334155', color: '#94a3b8', padding: '16px', borderRadius: '14px', width: '100%', cursor: 'not-allowed' }
};

export default App;
