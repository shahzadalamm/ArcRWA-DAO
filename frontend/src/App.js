import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ENT_CONTRACT_ADDRESS = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const TREASURY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [purchaseAmount, setPurchaseAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  // REAL BALANCE FETCH: Only reads what is actually on the blockchain
  async function fetchRealBalance(address) {
    if (!address) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, provider);
      
      const balance = await contract.balanceOf(address);
      const formattedBalance = ethers.formatUnits(balance, 18);
      setEntBalance(parseFloat(formattedBalance).toFixed(2));
    } catch (error) {
      console.error("Blockchain Read Error:", error);
      setEntBalance("0.00");
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      fetchRealBalance(accounts[0]);
    }
  }

  async function handlePurchase() {
    if (!walletAddress) return alert("Please connect wallet!");

    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Sending 10 USDC as Native Value
      const amountToSend = ethers.parseEther(purchaseAmount.toString());

      const tx = await signer.sendTransaction({
        to: TREASURY_WALLET,
        value: amountToSend,
        gasLimit: 100000
      });

      alert("Transaction broadcasted to Arc Network...");
      await tx.wait(); // Waiting for actual block confirmation
      
      alert("Blockchain confirmed the payment. Now checking for ENT update...");
      
      // We wait 5 seconds for the indexer to update
      setTimeout(() => fetchRealBalance(walletAddress), 5000);

    } catch (error) {
      alert("Transaction Failed: Check if you have enough USDC for payment + gas.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Auto-refresh balance every 10 seconds to stay synced with blockchain
  useEffect(() => {
    if (walletAddress) {
      const interval = setInterval(() => fetchRealBalance(walletAddress), 10000);
      return () => clearInterval(interval);
    }
  }, [walletAddress]);

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2>ARC <span style={{color:'#fff'}}>RWA</span></h2>
        <button onClick={connectWallet} style={styles.connectBtn}>
          {walletAddress ? `Acc: ${walletAddress.substring(0,6)}...` : "Connect Wallet"}
        </button>
      </nav>

      <div style={styles.card}>
        <p style={{color: '#94a3b8'}}>VERIFIED ENT BALANCE</p>
        <h1 style={{color: '#38bdf8', fontSize: '3rem'}}>{entBalance} ENT</h1>
        <p style={{fontSize: '0.7rem', color: '#4ade80'}}>Direct Blockchain Data</p>

        {walletAddress && (
          <div style={{marginTop: '30px'}}>
            <input 
              type="number" 
              value={purchaseAmount} 
              onChange={(e) => setPurchaseAmount(e.target.value)}
              style={styles.input}
            />
            <button 
              onClick={handlePurchase} 
              disabled={isProcessing}
              style={isProcessing ? styles.disabledBtn : styles.actionBtn}
            >
              {isProcessing ? "SYNCING WITH NETWORK..." : `BUY ${purchaseAmount} ENT`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#020617', color: 'white', minHeight: '100vh', textAlign: 'center', fontFamily: 'sans-serif' },
  nav: { padding: '20px', background: '#0f172a', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' },
  card: { maxWidth: '400px', margin: '50px auto', background: '#0f172a', padding: '40px', borderRadius: '25px', border: '1px solid #1e293b' },
  input: { background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '15px', borderRadius: '10px', width: '80%', textAlign: 'center', marginBottom: '15px' },
  connectBtn: { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' },
  actionBtn: { background: '#2563eb', color: 'white', border: 'none', padding: '15px', borderRadius: '10px', width: '100%', fontWeight: 'bold', cursor: 'pointer' },
  disabledBtn: { background: '#334155', color: '#94a3b8', padding: '15px', borderRadius: '10px', width: '100%', cursor: 'not-allowed' }
};

export default App;
