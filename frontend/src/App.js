import React, { useState } from 'react';
import { ethers } from 'ethers';

// Contracts address wahi rahenge jo aapne pehle deploy kiye hain
const ENT_ADDRESS = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
const REGISTRY_ADDRESS = "0xBa195D07398b3Cd63cD396156D63C089B69Ce31f";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [view, setView] = useState("HUB"); // HUB, POST, TEST

  return (
    <div style={{ background: '#020617', color: 'white', minHeight: '100vh', fontFamily: 'monospace' }}>
      {/* Top Navbar */}
      <nav style={{ padding: '20px', background: '#0f172a', borderBottom: '2px solid #1e293b', display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ color: '#38bdf8' }}>ARC <span style={{color:'#fff'}}>DEV-HUB</span></h2>
        <button onClick={() => setIsConnected(true)} style={btnStyle}>
          {isConnected ? "WALLET CONNECTED" : "CONNECT PORTAL"}
        </button>
      </nav>

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
        
        {/* Step 1: Token Gateway */}
        <div style={cardStyle}>
          <h3 style={{color:'#10b981'}}>1. ACCESS GATEWAY</h3>
          <p>Project testing ya feedback ke liye ENT tokens zaroori hain. Gas fees USDC mein deduct hogi.</p>
          <button style={actionBtn}>BUY ENT WITH USDC (Fee visible on ArcScan)</button>
        </div>

        {/* Step 2: Main Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={() => setView("POST")} style={view === "POST" ? activeTab : tab}>POST ARC PROJECT</button>
          <button onClick={() => setView("HUB")} style={view === "HUB" ? activeTab : tab}>TESTING HUB</button>
        </div>

        {/* Step 3: Content Area */}
        {view === "POST" ? (
          <div style={formCard}>
            <h3>SUBMIT YOUR PROJECT</h3>
            <p style={{fontSize:'0.8rem'}}>Cost: 50 ENT (Burned for quality control)</p>
            <input placeholder="Project Name" style={inputStyle} />
            <input placeholder="Arc Project URL (GitHub/Link)" style={inputStyle} />
            <textarea placeholder="Instructions for Testers" style={{...inputStyle, height:'80px'}} />
            <button style={{...actionBtn, background:'#3b82f6'}}>POST PROJECT FOR TESTING</button>
          </div>
        ) : (
          <div style={formCard}>
            <h3>COMMUNITY TESTING HUB</h3>
            <div style={projectItem}>
              <h4>Sample Arc Project #1</h4>
              <p>Rating: ⭐⭐⭐⭐☆ (4.5/5)</p>
              <button style={smallBtn}>Test & Give Feedback</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const btnStyle = { background: '#38bdf8', border: 'none', padding: '10px 20px', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const cardStyle = { background: '#0f172a', padding: '25px', borderRadius: '12px', border: '1px solid #10b981' };
const formCard = { background: '#0f172a', padding: '30px', borderRadius: '12px', marginTop: '20px', border: '1px solid #1e293b' };
const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', background: '#020617', border: '1px solid #334155', color: 'white' };
const actionBtn = { width: '100%', padding: '15px', background: '#10b981', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const tab = { flex: 1, padding: '12px', background: '#1e293b', color: 'white', border: 'none', cursor: 'pointer' };
const activeTab = { ...tab, background: '#38bdf8' };
const projectItem = { background: '#020617', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #38bdf8', marginTop: '10px' };
const smallBtn = { background: '#3b82f6', border: 'none', color: 'white', padding: '5px 10px', cursor: 'pointer', marginTop: '5px' };

export default App;
