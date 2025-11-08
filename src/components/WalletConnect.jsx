import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { TOKEN_SYMBOL } from "../config";
import { getTokenContract } from "../lib/web3";

const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || "0x13881"; // default to Mumbai for dev

export default function WalletConnect() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(18);
  const [symbol, setSymbol] = useState(TOKEN_SYMBOL);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccounts = (accounts) => { if (accounts.length) setAccount(ethers.getAddress(accounts[0])); else setAccount(null); };
    const handleChain = (c) => setChainId(c);
    window.ethereum.on("accountsChanged", handleAccounts);
    window.ethereum.on("chainChanged", handleChain);

    (async () => {
      try {
        const ch = await window.ethereum.request({ method: "eth_chainId" });
        setChainId(ch);
        const accs = await window.ethereum.request({ method: "eth_accounts" });
        if (accs && accs.length) setAccount(ethers.getAddress(accs[0]));
      } catch (e) {}
    })();

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccounts);
      window.ethereum.removeListener("chainChanged", handleChain);
    };
  }, []);

  useEffect(() => {
    if (!account || !chainId) { setBalance(null); return; }
    const prov = new ethers.BrowserProvider(window.ethereum);
    const token = getTokenContract(TOKEN_ADDRESS, prov);
    (async () => {
      try {
        const [d, s, raw] = await Promise.all([token.decimals(), token.symbol(), token.balanceOf(account)]);
        setDecimals(Number(d));
        setSymbol(String(s));
        setBalance(ethers.formatUnits(raw, Number(d)));
      } catch (e) {
        console.error("balance load err", e);
        setBalance(null);
      }
    })();
  }, [account, chainId]);

  async function switchOrAddChain() {
    if (!window.ethereum) return alert("No wallet");
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID }] });
    } catch (err) {
      if (err && err.code === 4902) {
        // add chain automatically: use Mumbai or mainnet params
        const params = CHAIN_ID === "0x89" ? {
          chainId: "0x89",
          chainName: "Polygon Mainnet",
          nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
          rpcUrls: ["https://polygon-rpc.com/"],
          blockExplorerUrls: ["https://polygonscan.com/"]
        } : {
          chainId: "0x13881",
          chainName: "Polygon Mumbai Testnet",
          nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
          rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
        };
        try {
          await window.ethereum.request({ method: "wallet_addEthereumChain", params: [params] });
        } catch (e) { console.error(e); }
      } else {
        console.error(err);
      }
    }
  }

  async function connect() {
    if (!window.ethereum) return alert("Metamask not installed");
    try {
      const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(ethers.getAddress(accs[0]));
      const ch = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(ch);
      if (ch !== CHAIN_ID) {
        await switchOrAddChain();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function addTokenToWallet() {
    if (!window.ethereum) return alert("No wallet");
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: TOKEN_ADDRESS,
            symbol: symbol || TOKEN_SYMBOL,
            decimals: decimals,
            // image: 'https://your.site/glf.png'
          }
        }
      });
    } catch (e) { console.error(e); }
  }

  return (
    <div className="flex items-center gap-3">
      <div>
        <button className="btn-primary" onClick={connect}>
          {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>
      {account && (
        <div className="text-sm text-slate-600">
          <div>Network: <strong>{chainId}</strong></div>
          <div>Balance: <strong>{balance !== null ? `${balance} ${symbol}` : "—"}</strong></div>
        </div>
      )}
      {account && <button className="px-3 py-2 rounded-xl border" onClick={addTokenToWallet}>Add GLF</button>}
    </div>
  );
}
