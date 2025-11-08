import { ethers } from "ethers";
import ERC20 from "../abi/ERC20.json";
import STAKING from "../abi/Staking.json";

export function getDefaultProvider(rpcUrl) {
  if (rpcUrl) return new ethers.JsonRpcProvider(rpcUrl);
  return undefined;
}

export async function ensureNetwork(requiredChainIdHex) {
  if (!window.ethereum) throw new Error("No injected wallet");
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId === requiredChainIdHex) return true;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: requiredChainIdHex }]
    });
    return true;
  } catch (err) {
    if (err && err.code === 4902) {
      // chain not added
      // For convenience we will not add params here - handled in UI if needed
      throw new Error("Chain not available in wallet");
    }
    throw err;
  }
}

export function getTokenContract(address, providerOrSigner) {
  return new ethers.Contract(address, ERC20, providerOrSigner);
}

export function getStakingContract(address, providerOrSigner) {
  return new ethers.Contract(address, STAKING, providerOrSigner);
}
