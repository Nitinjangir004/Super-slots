import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SuperSlotArtifact from './artifacts/SuperSlot.json';
import './App.css';

const BASE_PATH = process.env.PUBLIC_URL || '';

const CONTRACT_ADDRESS = "0x6da2F4963E3c936DfF4cea3a9a6C521807895C6E";

interface SpinResult {
  symbols: string[];
  winAmount: bigint;
  isWin: boolean;
}

const symbolToIcon: { [key: string]: string } = {
  'DOGE': 'doge.png',
  'SHIB': 'shib.png',
  'PEPE': 'pepe.png',
  'WIF': 'wif.png',
  'BONK': 'bonk.png',
  'FLOKI': 'floki.png',
  'BRETT': 'brett.png',
  'BOME': 'bome.png',
  'MEW': 'mew.png',
  'MEME': 'meme.png',
};

function App() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [prizePool, setPrizePool] = useState<string>('0');
  const [slots, setSlots] = useState<string[]>(['?', '?', '?', '?']);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allSlots, setAllSlots] = useState<string[]>([]);
  const [balance, setBalance] = useState<string>('0');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (err) {
          setError('Failed to connect to Ethereum network');
          console.error(err);
        }
      } else {
        setError('Ethereum wallet not detected');
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signerInstance = await provider.getSigner();
        setSigner(signerInstance);
        const address = await signerInstance.getAddress();
        setWalletAddress(address);
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, SuperSlotArtifact.abi, signerInstance);
        setContract(contractInstance);
        await updatePrizePool(contractInstance);
        await fetchAllSlots(contractInstance);
        await updateBalance(signerInstance);
      } catch (err) {
        setError('Failed to connect wallet');
        console.error(err);
      }
    } else {
      setError('Ethereum wallet not detected');
    }
  };

  const disconnectWallet = () => {
    setSigner(null);
    setWalletAddress(null);
    setContract(null);
    setBalance('0');
    setShowDropdown(false);
  };

  const updatePrizePool = async (contractInstance: ethers.Contract) => {
    try {
      const pool = await contractInstance.getPrizePool();
      setPrizePool(ethers.formatEther(pool));
    } catch (err) {
      console.error('Failed to fetch prize pool:', err);
    }
  };

  const fetchAllSlots = async (contractInstance: ethers.Contract) => {
    try {
      const slots = await contractInstance.getSlots();
      setAllSlots(slots);
    } catch (err) {
      console.error('Failed to fetch slot symbols:', err);
    }
  };

  const updateBalance = async (signerInstance: ethers.Signer) => {
    try {
      const provider = signerInstance.provider;
      if (!provider) {
        throw new Error("No provider available");
      }
      const address = await signerInstance.getAddress();
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  };

  const spin = async () => {
    if (contract && signer) {
      try {
        setSpinning(true);
        setSlots(['?', '?', '?', '?']);
        setSpinResult(null);
        setError(null);
        const tx = await contract.spin({ value: ethers.parseEther('0.001') });
        const receipt = await tx.wait();
        const event = receipt.logs.find((log: any) => log.fragment.name === 'Spin');
        if (event && event.args) {
          const result: SpinResult = {
            symbols: event.args.result,
            winAmount: event.args.winAmount,
            isWin: event.args.isWin
          };
          simulateSpinning(result);
        } else {
          throw new Error('Spin event not found in transaction receipt');
        }
      } catch (err) {
        console.error('Failed to spin:', err);
        setError('Failed to spin. Please try again.');
        setSpinning(false);
      }
    }
  };

  const simulateSpinning = (result: SpinResult) => {
    let spins = 0;
    const spinInterval = setInterval(() => {
      setSlots(slots.map(() => allSlots[Math.floor(Math.random() * allSlots.length)]));
      spins++;
      if (spins >= 20) {
        clearInterval(spinInterval);
        setSlots(result.symbols);
        setSpinning(false);
        if (contract) {
          updatePrizePool(contract);
        }
        if (signer) {
          updateBalance(signer);
        }
        if (result.isWin) {
          playWinSound();
          setSpinResult(`Congratulations! You won ${ethers.formatEther(result.winAmount)} ETH!`);
        } else {
          setSpinResult('Better luck next time!');
        }
      }
    }, 100);
  };

  const playWinSound = () => {
    const audio = new Audio(`${BASE_PATH}/win-sound.mp3`);
    audio.play().catch(err => console.error('Failed to play sound:', err));
  };

  return (
    <div className="App">
      <header>
        <h1>Super Slot</h1>
        <div className="wallet-info">
          {balance !== '0' && <div className="balance">Balance: {Number(balance).toFixed(4)} ETH</div>}
          {walletAddress ? (
            <div 
              className="wallet-address-container" 
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="wallet-address">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
              {showDropdown && (
                <div className="dropdown">
                  <button onClick={disconnectWallet} className="disconnect-button">Disconnect</button>
                </div>
              )}
            </div>
          ) : (
            <button className="connect-button" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </header>
      <main>
        <div className="game-container">
          <div className="prize-pool">Prize Pool: {prizePool} ETH</div>
          {spinResult && <div className="spin-result">{spinResult}</div>}
          <div className="slot-machine">
            {slots.map((slot, index) => (
              <div key={index} className={`slot ${spinning ? 'spinning' : ''}`}>
                <img 
                  src={`${BASE_PATH}/images/${symbolToIcon[slot] || 'question.png'}`} 
                  alt={slot} 
                  className="memecoin-icon"
                />
              </div>
            ))}
          </div>
          <button onClick={spin} disabled={spinning || !signer} className={spinning ? 'spinning' : ''}>
            {spinning ? 'Spinning...' : 'Spin (0.001 ETH)'}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </main>
    </div>
  );
}

export default App;