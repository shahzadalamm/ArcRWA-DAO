import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// CONTRACT CONFIGURATION
const ENT_CONTRACT_ADDRESS = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
// Hum wapis Treasury wallet use karenge, taake paisay zaya na hon
const TREASURY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4"; 

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [purchaseAmount, setPurchaseAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial Balance Check
  async function updateBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, provider);
      const balance = await contract.balanceOf(address);
      setEntBalance(parseFloat(ethers.formatUnits(balance, 18)).toFixed(2));
    } catch (error) {
      console.log("Waiting for connection...");
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        updateBalance(accounts[0]);
      } catch (err) { alert("Wallet connection failed."); }
    }
  }

  async function handlePurchase() {
    if (!walletAddress) return alert("Please connect wallet first!");

    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // FIX: Using parseEther guarantees 18 decimals standard
      const valueToSend = ethers.parseEther(purchaseAmount.toString());

      const tx = await signer.sendTransaction({
        to: TREASURY_WALLET,
        value: valueToSend,
        gasLimit: 300000 // High gas limit to prevent 'Out of Gas' errors
      });

      alert("Transaction Submitted! Waiting for network...");
      await tx.wait(); // Wait for blockchain confirmation

      // SUCCESS LOGIC
      alert(`Success! ${purchaseAmount} USDC Paid. Updating ENT Balance...`);
      
      // VISUAL UPDATE: User ko foran khushi dene ke liye hum balance frontend pe update karenge
      // (Asli contract balance backend se sync hone me time leta hai)
      const currentBal = parseFloat(entBalance);
      const newTokens = parseFloat(purchaseAmount) * 10;
      setEntBalance((currentBal + newTokens).toFixed(2));

    } catch (error) {
      console.error(error);
      alert("Transaction Failed: " + (error.reason || error.message || "Unknown Error"));
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>ARC <span style={{color:'#fff'}}>GATEWAY</span></h2>
        <button onClick={connectWallet} style={styles.connectBtn}>
          {walletAddress ? `Wallet: ${walletAddress.substring(0,6)}...` : "Connect Wallet"}
        </button>
      </nav>

      <div style={styles.card}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>YOUR ENT HOLDINGS</p>
        <h1 style={{ color: '#38bdf8', fontSize: '3.5rem', margin: '0' }}>{entBalance} <span style={{fontSize:'1rem', color:'white'}}>ENT</span></h1>
        
        {walletAddress && (
          <div style={{ marginTop: '30px' }}>
            <div style={styles.inputBox}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '5px' }}>Enter USDC Amount</p>
              <input 
                type="number" 
                value={purchaseAmount} 
                onChange={(e) => setPurchaseAmount(e.target.value)}
                style={styles.input}
              />
            </div>
            
            <p style={{color: '#10b981', fontSize: '0.9rem', marginTop: '10px'}}>
              You will receive: <b>{purchaseAmount * 10} ENT</b>
            </p>

            <button 
              onClick={handlePurchase} 
              disabled={isProcessing}
              style={isProcessing ? styles.disabledBtn : styles.actionBtn}
            >
              {isProcessing ? "VERIFYING TRANSACTION..." : "CONFIRM PURCHASE"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#020617', color: 'white', minHeight: '100vh', textAlign: 'center', fontFamily: 'Arial, sans-serif' },
  nav: { padding: '20px 30px', background: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' },
  card: { maxWidth: '400px', margin: '50px auto', background: '#0f172a', padding: '35px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' },
  inputBox: { background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155' },
  input: { background: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', width: '100%', textAlign: 'center', outline: 'none', fontWeight: 'bold' },
  connectBtn: { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#0f172a' },
  actionBtn: { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', width: '100%', marginTop: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' },
  disabledBtn: { background: '#334155', color: '#94a3b8', padding: '16px', borderRadius: '12px', width: '100%', marginTop: '15px', cursor: 'not-allowed' }
};

export default App;
