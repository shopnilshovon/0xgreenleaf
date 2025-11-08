import React, { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { TOKEN_SYMBOL } from "../config";
import { getTokenContract } from "../lib/web3";

const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const DEFAULT_CHAIN = import.meta.env.VITE_CHAIN_ID || "0x89"; // default to Polygon mainnet

export default function WalletConnect() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(18);
  const [symbol, setSymbol] = useState(TOKEN_SYMBOL || "GLF");
  const [loadingBalance, setLoadingBalance] = useState(false);

  const loadTokenBalance = useCallback(async (acct) => {
    if (!acct) {
      setBalance(null);
      return;
    }
    if (!TOKEN_ADDRESS) {
      setBalance(null);
      return;
    }
    try {
      setLoadingBalance(true);
      const prov = new ethers.BrowserProvider(window.ethereum);
      const token = getTokenContract(TOKEN_ADDRESS, prov);
      const [d, s, raw] = await Promise.all([
        token.decimals(),
        token.symbol(),
        token.balanceOf(acct)
      ]);
      setDecimals(Number(d));
      setSymbol(String(s));
      setBalance(ethers.formatUnits(raw, Number(d)));
    } catch (err) {
      console.error("Failed to load token info/balance:", err);
      setBalance(null);
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccounts = (accounts) => {
      if (accounts && accounts.length > 0) {
        try { setAccount(ethers.getAddress(accounts[0])); } catch { setAccount(accounts[0]); }
      } else {
        setAccount(null);
        setBalance(null);
      }
    };

    const handleChain = (c) => {
      setChainId(c);
      // if account exists, reload balance for new chain
      if (account) loadTokenBalance(account);
    };

    window.ethereum.on("accountsChanged", handleAccounts);
    window.ethereum.on("chainChanged", handleChain);

    // initial read
    (async () => {
      try {
        const currentChain = await window.ethereum.request({ method: "eth_chainId" });
        setChainId(currentChain);
      } catch (e) { /* ignore */ }

      try {
        const accs = await window.ethereum.request({ method: "eth_accounts" });
        if (accs && accs.length > 0) {
          try { setAccount(ethers.getAddress(accs[0])); } catch { setAccount(accs[0]); }
        }
      } catch (e) { /* ignore */ }
    })();

    return () => {
      try {
        window.ethereum.removeListener("accountsChanged", handleAccounts);
        window.ethereum.removeListener("chainChanged", handleChain);
      } catch (e) { /* ignore cleanup errors */ }
    };
  }, [account, loadTokenBalance]);

  // whenever account or chainId changes, reload balance
  useEffect(() => {
    if (account && chainId) loadTokenBalance(account);
    else setBalance(null);
  }, [account, chainId, loadTokenBalance]);

  async function switchOrAddChain(requiredChain = DEFAULT_CHAIN) {
    if (!window.ethereum) throw new Error("No injected wallet");
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: requiredChain }]
      });
      setChainId(requiredChain);
      return true;
    } catch (switchError) {
      // 4902: chain is not added to wallet
      if (switchError && (switchError.code === 4902 || switchError?.message?.includes("4902"))) {
        const params = requiredChain === "0x89" ? {
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
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [params]
          });
          setChainId(requiredChain);
          return true;
        } catch (addErr) {
          console.error("Failed to add chain to wallet:", addErr);
          throw addErr;
        }
      } else {
        console.error("Failed to switch chain:", switchError);
        throw switchError;
      }
    }
  }

  async function connect() {
    if (!window.ethereum) return alert("MetaMask (or compatible wallet) is not installed.");
    try {
      // Try switching to required chain first (user will be prompted)
      try {
        await switchOrAddChain(DEFAULT_CHAIN);
      } catch (e) {
        // if user cancels or switching failed, continue but warn later
        console.warn("Chain switch/add failed or cancelled:", e);
      }

      // then request accounts
      const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (!accs || accs.length === 0) return;
      const normalized = ethers.getAddress(accs[0]);
      setAccount(normalized);

      // update chain id after connection
      const ch = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(ch);

      // load balance
      await loadTokenBalance(normalized);
    } catch (err) {
      console.error("Wallet connect failed:", err);
      alert(err?.message || "Failed to connect wallet");
    }
  }

  async function addTokenToWallet() {
    if (!window.ethereum) return alert("No wallet");
    if (!TOKEN_ADDRESS) return alert("Token address not configured.");
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: TOKEN_ADDRESS,
            symbol: symbol || TOKEN_SYMBOL || "GLF",
            decimals: decimals || 18
            // image: 'https://your.site/glf.png'
          }
        }
      });
    } catch (err) {
      console.error("addTokenToWallet error:", err);
    }
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
          <div>Network: <strong>{chainId || "—"}</strong></div>
          <div>
            Balance:{" "}
            <strong>
              {loadingBalance ? "loading..." : (balance !== null ? `${balance} ${symbol}` : "—")}
            </strong>
          </div>
        </div>
      )}

      {account && (
        <button className="px-3 py-2 rounded-xl border" onClick={addTokenToWallet}>Add {symbol || "GLF"}</button>
      )}
    </div>
  );
}