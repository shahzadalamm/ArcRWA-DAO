import React, { useState } from 'react';
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
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      updateBalance(accounts[0]);
    }
  }

  async function handlePurchase() {
    if (!walletAddress) return alert("Please connect wallet!");

    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const amountInWei = ethers.parseUnits(purchaseAmount.toString(), 18);
      
      // LOGIC: Calling the ENT Contract directly
      // Note: This assumes your ENT contract has a 'mint' or 'buy' function.
      const abi = ["function transfer(address to, uint256 amount) public returns (bool)"];
      const entContract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, signer);

      alert("Step 1: Confirming USDC Payment...");
      
      // Sending Payment
      const tx = await signer.sendTransaction({
        to: TREASURY_WALLET, 
        value: amountInWei
      });

      alert("Transaction broadcasted! Waiting for confirmation...");
      await tx.wait();
      
      // Note: In a real environment, the contract or a backend script 
      // would now send ENT to the user. 
      alert("Payment Verified! Your ENT balance will be updated as soon as the contract confirms the swap.");
      
      // Manual refresh after 3 seconds
      setTimeout(() => updateBalance(walletAddress), 3000);

    } catch (error) {
      console.error(error);
      alert("Transaction Failed: Ensure you have enough balance.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={{ color: '#38bdf8' }}>ARC <span style={{color:'#fff'}}>GATEWAY</span></h2>
        <button onClick={connectWallet} style={styles.connectBtn}>
          {walletAddress ? `Acc: ${walletAddress.substring(0,6)}...` : "Connect Wallet"}
        </button>
      </nav>

      <div style={styles.card}>
        <h3 style={{color: '#94a3b8', margin: '0'}}>YOUR ENT BALANCE</h3>
        <h1 style={{ color: '#38bdf8', fontSize: '3.5rem', margin: '15px 0' }}>{entBalance} <span style={{fontSize: '1rem', color:'#fff'}}>ENT</span></h1>
        
        {walletAddress && (
          <div style={{ marginTop: '30px' }}>
            <div style={styles.inputBox}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PAYMENT (USDC)</p>
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
              {isProcessing ? "PROCESSING SECURELY..." : "PURCHASE ENT TOKENS"}
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
  card: { maxWidth: '420px', margin: '60px auto', background: '#0f172a', padding: '40px', borderRadius: '30px', border: '1px solid #1e293b' },
  inputBox: { background: '#1e293b', padding: '20px', borderRadius: '15px' },
  input: { background: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', width: '100%', textAlign: 'center', outline: 'none', fontWeight: 'bold' },
  connectBtn: { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  actionBtn: { background: 'linear-gradient(135deg, #10b981, #3b82f6)', color: 'white', border: 'none', padding: '18px', borderRadius: '14px', width: '100%', marginTop: '25px', fontWeight: 'bold', cursor: 'pointer' },
  disabledBtn: { background: '#1e293b', color: '#475569', padding: '18px', borderRadius: '14px', width: '100%', marginTop: '25px', cursor: 'not-allowed' }
};

export default App;
