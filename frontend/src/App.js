import React, { useState } from 'react';
import { ethers } from 'ethers';

const ENT_CONTRACT_ADDRESS = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
// Sending to Treasury Wallet to ensure the transaction doesn't get rejected by a contract
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
    } catch (e) { console.error("Balance sync failed"); }
  }

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      updateBalance(accounts[0]);
    }
  }

  async function handlePurchase() {
    if (!walletAddress) return alert("Please connect wallet first!");

    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Using parseEther for 18 decimal compatibility
      const valueInWei = ethers.parseEther(purchaseAmount.toString());

      // REQUESTING PERMISSION
      const tx = await signer.sendTransaction({
        to: TREASURY_WALLET,
        value: valueInWei,
        // Adding a buffer gas limit to prevent failure
        gasLimit: 120000 
      });

      alert("Transaction broadcasted! Please wait for block confirmation.");
      await tx.wait();
      
      alert("SUCCESS: USDC Deducted. Refreshing ENT balance...");
      setTimeout(() => updateBalance(walletAddress), 5000);

    } catch (error) {
      console.error(error);
      // Detailed English Error Messages
      if (error.code === "INSUFFICIENT_FUNDS") {
        alert("FAILED: Not enough USDC in your wallet to cover the amount + gas fees.");
      } else if (error.code === "ACTION_REJECTED") {
        alert("CANCELLED: You rejected the transaction in MetaMask.");
      } else {
        alert("TRANSACTION ERROR: Check your network connection or balance.");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={{ color: '#38bdf8' }}>ARC <span style={{color:'#fff'}}>GATEWAY</span></h2>
        <button onClick={connectWallet} style={styles.connectBtn}>
          {walletAddress ? `Account: ${walletAddress.substring(0,6)}...` : "Connect Wallet"}
        </button>
      </nav>

      <div style={styles.card}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>VERIFIED ENT BALANCE</p>
        <h1 style={{ color: '#38bdf8', fontSize: '3.5rem', margin: '15px 0' }}>{entBalance}</h1>
        
        {walletAddress && (
          <div style={{ marginTop: '20px' }}>
            <div style={styles.inputBox}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Payment Amount (USDC)</p>
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
              {isProcessing ? "PROCESSING..." : `PURCHASE ${purchaseAmount * 10} ENT`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#020617', color: 'white', minHeight: '100vh', textAlign: 'center', fontFamily: 'sans-serif' },
  nav: { padding: '20px 40px', background: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' },
  card: { maxWidth: '420px', margin: '50px auto', background: '#0f172a', padding: '40px', borderRadius: '28px', border: '1px solid #1e293b' },
  inputBox: { background: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' },
  input: { background: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', width: '100%', textAlign: 'center', outline: 'none', fontWeight: 'bold' },
  connectBtn: { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  actionBtn: { background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', border: 'none', padding: '18px', borderRadius: '14px', width: '100%', marginTop: '25px', fontWeight: 'bold', cursor: 'pointer' },
  disabledBtn: { background: '#1e293b', color: '#475569', padding: '18px', borderRadius: '14px', width: '100%', marginTop: '25px', cursor: 'not-allowed' }
};

export default App;
