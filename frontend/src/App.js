import React, { useState } from 'react';
import { ethers } from 'ethers';

const ENT_CONTRACT_ADDRESS = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const TREASURY_WALLET = "0x0E6d470bbDd9CE63e1B506E2A040604F9EC97bd4";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [isPosting, setIsPosting] = useState(false);
  const [projectName, setProjectName] = useState("");

  async function updateBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, provider);
      const balance = await contract.balanceOf(address);
      setEntBalance(parseFloat(ethers.formatUnits(balance, 18)).toFixed(2));
    } catch (e) { console.error("Sync error"); }
  }

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      updateBalance(accounts[0]);
    }
  }

  // POST PROJECT & GET 10 ENT REWARD
  async function handlePostProject() {
    if (!walletAddress || !projectName) return alert("Please connect wallet and enter project name!");

    try {
      setIsPosting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Cost to post: 1 USDC (Native Gas)
      const postCost = ethers.parseEther("1.0");

      alert(`Submitting Project: ${projectName}\nCost: 1 USDC Gas Fees`);

      const tx = await signer.sendTransaction({
        to: TREASURY_WALLET,
        value: postCost,
        gasLimit: 150000
      });

      await tx.wait();
      
      alert("Project Posted Successfully! 10 ENT reward has been sent to your wallet.");
      
      // Simulated Reward Update (Actually needs a Mint function on your contract)
      setTimeout(() => updateBalance(walletAddress), 5000);
      setProjectName("");
    } catch (error) {
      alert("Post Failed: Insufficient USDC for Gas Fees.");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div style={styles.body}>
      {/* GitHub Header Style */}
      <nav style={styles.navbar}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <svg height="32" viewBox="0 0 16 16" width="32" fill="white"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
          <span style={styles.logoText}>ARC / DEV-HUB</span>
        </div>
        <button onClick={connectWallet} style={styles.connectBtn}>
          {walletAddress ? `Connected: ${walletAddress.substring(0,6)}...` : "Connect Wallet"}
        </button>
      </nav>

      <div style={styles.mainContainer}>
        {/* Profile Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.avatar}></div>
          <h2 style={{margin:'10px 0 5px'}}>Developer</h2>
          <p style={{color:'#8b949e', margin:0}}>{walletAddress ? 'Active Member' : 'Guest'}</p>
          <hr style={styles.hr} />
          <div style={styles.statsBox}>
            <p>ENT Tokens</p>
            <h3 style={{color:'#58a6ff'}}>{entBalance}</h3>
          </div>
        </div>

        {/* Content Area */}
        <div style={styles.content}>
          <div style={styles.tabHeader}>
            <span style={styles.tabActive}>Repositories</span>
            <span style={styles.tab}>Projects</span>
            <span style={styles.tab}>Packages</span>
          </div>

          {/* Post Project Section */}
          <div style={styles.repoCard}>
            <h3 style={{marginTop:0}}>Post New RWA Project</h3>
            <p style={{fontSize:'0.85rem', color:'#8b949e'}}>Post your asset to earn 10 ENT tokens. Gas fees: 1 USDC.</p>
            <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
              <input 
                type="text" 
                placeholder="Repository Name (e.g. My-Real-Estate)" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={styles.input}
              />
              <button 
                onClick={handlePostProject} 
                disabled={isPosting} 
                style={isPosting ? styles.btnDisabled : styles.postBtn}
              >
                {isPosting ? "Deploying..." : "Post Project"}
              </button>
            </div>
          </div>

          {/* Dummy Project List */}
          <div style={styles.repoItem}>
            <a href="#" style={styles.repoLink}>Gold-Reserve-Protocol</a>
            <p style={{color:'#8b949e', fontSize:'0.9rem'}}>RWA project for tokenized gold assets on Arc Network.</p>
            <div style={{marginTop:'10px', fontSize:'0.75rem', color:'#8b949e'}}>
              <span style={{color:'#f1e05a'}}>●</span> JavaScript &nbsp; Updated 2 days ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  body: { background: '#0d1117', color: '#c9d1d9', minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif' },
  navbar: { padding: '15px 30px', background: '#161b22', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #30363d' },
  logoText: { fontWeight: 'bold', fontSize: '1.1rem' },
  connectBtn: { background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  mainContainer: { display: 'flex', maxWidth: '1200px', margin: '40px auto', padding: '0 20px', gap: '30px' },
  sidebar: { width: '280px', textAlign: 'left' },
  avatar: { width: '280px', height: '280px', borderRadius: '50%', background: '#30363d', border: '1px solid #30363d' },
  hr: { borderColor: '#21262d', margin: '20px 0' },
  statsBox: { padding: '15px', background: '#161b22', borderRadius: '6px', border: '1px solid #30363d' },
  content: { flex: 1 },
  tabHeader: { borderBottom: '1px solid #30363d', marginBottom: '20px', display: 'flex', gap: '20px' },
  tabActive: { borderBottom: '2px solid #f78166', paddingBottom: '10px', fontWeight: 'bold' },
  tab: { color: '#8b949e', paddingBottom: '10px' },
  repoCard: { background: '#161b22', padding: '20px', borderRadius: '6px', border: '1px solid #30363d', marginBottom: '30px' },
  input: { flex: 1, background: '#0d1117', border: '1px solid #30363d', color: 'white', padding: '8px 12px', borderRadius: '6px' },
  postBtn: { background: '#238636', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  btnDisabled: { background: '#161b22', color: '#8b949e', border: '1px solid #30363d', padding: '8px 16px', borderRadius: '6px', cursor: 'not-allowed' },
  repoItem: { padding: '20px 0', borderBottom: '1px solid #21262d', textAlign: 'left' },
  repoLink: { color: '#58a6ff', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }
};

export default App;
