import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ENT_CONTRACT_ADDRESS = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const TREASURY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [purchaseAmount, setPurchaseAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  async function updateBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, provider);
      const balance = await contract.balanceOf(address);
      setEntBalance(parseFloat(ethers.formatUnits(balance, 18)).toFixed(2));
    } catch (error) {
      console.error("Balance fetch failed");
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        updateBalance(accounts[0]);
      } catch (error) {
        alert("Wallet connection rejected.");
      }
    } else {
      alert("Please use MetaMask in-app browser.");
    }
  }

  async function handlePurchase() {
    if (!walletAddress) return alert("Connect your wallet first!");

    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const valueInWei = ethers.parseUnits(purchaseAmount.toString(), 18);
      
      // Professional Transaction Request
      const tx = await signer.sendTransaction({
        to: TREASURY_WALLET,
        value: valueInWei,
        gasLimit: 120000 
      });

      // UI will wait here until you confirm in MetaMask
      alert("Transaction broadcasted. Awaiting network confirmation...");
      await tx.wait();
      
      alert("Success! ENT purchase confirmed.");
      updateBalance(walletAddress);
    } catch (error) {
      console.error(error);
      alert("Transaction failed or cancelled by user.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={{ color: '#38bdf8' }}>ARC <span style={{color:'#fff'}}>RWA HUB</span></h2>
        <button onClick={connectWallet} style={walletAddress ? styles.connectedBtn : styles.connectBtn}>
          {walletAddress ? `Account: ${walletAddress.substring(0,6)}...` : "Connect Wallet"}
        </button>
      </nav>

      <div style={styles.card}>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>CURRENT ENT BALANCE</p>
        <h1 style={{ color: '#38bdf8', fontSize: '3rem' }}>{entBalance} <span style={{fontSize: '0.9rem', color: '#fff'}}>ENT</span></h1>
        
        {walletAddress && (
          <div style={{ marginTop: '25px' }}>
            <div style={styles.inputWrapper}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>Payment Amount (USDC)</p>
              <input 
                type="number" 
                value={purchaseAmount} 
                onChange={(e) => setPurchaseAmount(e.target.value)}
                style={styles.input}
              />
            </div>
            
            <button 
              onClick={handlePurchase} 
              disabled={isProcessing}
              style={isProcessing ? styles.disabledBtn : styles.actionBtn}
            >
              {isProcessing ? "SECURELY PROCESSING..." : `PURCHASE ${purchaseAmount * 10} ENT`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#020617', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', textAlign: 'center' },
  nav: { padding: '15px 40px', background: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' },
  card: { maxWidth: '420px', margin: '60px auto', background: '#0f172a', padding: '35px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' },
  inputWrapper: { background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' },
  input: { background: 'transparent', border: 'none', color: 'white', fontSize: '1.6rem', width: '100%', textAlign: 'center', outline: 'none', fontWeight: 'bold' },
  connectBtn: { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  connectedBtn: { background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' },
  actionBtn: { background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', marginTop: '20px', width: '100%', cursor: 'pointer' },
  disabledBtn: { background: '#1e293b', color: '#475569', padding: '16px', borderRadius: '12px', marginTop: '20px', width: '100%', cursor: 'not-allowed' }
};

export default App;
