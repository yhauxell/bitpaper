/**
 * Wallet Generation Module
 *
 * Core functionality for generating cryptocurrency wallets
 */

import { Keypair } from "@solana/web3.js";
import { BIP32Factory } from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { ethers } from "ethers";
import * as qrcode from "qrcode-terminal";
import * as ecc from "tiny-secp256k1";

// Initialize BIP32 with tiny-secp256k1
const bip32 = BIP32Factory(ecc);

/**
 * Generate QR code as string
 */
function generateQRCode(data: string): Promise<string> {
  return new Promise((resolve) => {
    let qrString = "";
    qrcode.generate(data, { small: true }, (qr) => {
      qrString = qr;
      resolve(qrString);
    });
  });
}

// ============================================================================
// Types
// ============================================================================

export interface BitcoinWallet {
  type: "Bitcoin";
  address: string;
  privateKey: string;
  publicKey: string;
  wif: string; // Wallet Import Format
}

export interface EthereumWallet {
  type: "Ethereum" | "Chainlink";
  address: string;
  privateKey: string;
  publicKey: string;
}

export interface SolanaWallet {
  type: "Solana";
  address: string;
  privateKey: string;
  publicKey: string;
}

export interface WalletSet {
  mnemonic: string;
  bitcoin?: BitcoinWallet;
  ethereum?: EthereumWallet;
  solana?: SolanaWallet;
  chainlink?: EthereumWallet;
  timestamp: string;
  selectedCurrencies: string[];
}

// ============================================================================
// Configuration
// ============================================================================

const BITCOIN_NETWORK = bitcoin.networks.bitcoin; // Use bitcoin.networks.testnet for testnet

// ============================================================================
// Wallet Generation Functions
// ============================================================================

/**
 * Generate a Bitcoin wallet from seed
 */
export function generateBitcoinWallet(seed: Buffer): BitcoinWallet {
  // Derive Bitcoin key from seed
  const root = bip32.fromSeed(seed, BITCOIN_NETWORK);

  // Use BIP44 path for Bitcoin: m/44'/0'/0'/0/0
  const path = "m/44'/0'/0'/0/0";
  const child = root.derivePath(path);

  if (!child.privateKey) {
    throw new Error("Failed to derive Bitcoin private key");
  }

  // Generate P2WPKH (native segwit) address
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
    network: BITCOIN_NETWORK,
  });

  if (!address) {
    throw new Error("Failed to generate Bitcoin address");
  }

  return {
    type: "Bitcoin",
    address,
    privateKey: child.privateKey.toString("hex"),
    publicKey: child.publicKey.toString("hex"),
    wif: child.toWIF(),
  };
}

/**
 * Generate an Ethereum wallet from seed
 */
export function generateEthereumWallet(
  seed: Buffer,
  type: "Ethereum" | "Chainlink" = "Ethereum"
): EthereumWallet {
  // Derive Ethereum key from seed using BIP44 path: m/44'/60'/0'/0/0
  const hdNode = ethers.HDNodeWallet.fromSeed(seed);
  const path = "m/44'/60'/0'/0/0";
  const wallet = hdNode.derivePath(path);

  return {
    type,
    address: wallet.address,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
  };
}

/**
 * Generate a Solana wallet from seed
 */
export function generateSolanaWallet(seed: Buffer): SolanaWallet {
  // Use first 32 bytes of seed for Solana keypair
  const keypair = Keypair.fromSeed(seed.slice(0, 32));

  return {
    type: "Solana",
    address: keypair.publicKey.toBase58(),
    privateKey: Buffer.from(keypair.secretKey).toString("hex"),
    publicKey: keypair.publicKey.toBase58(),
  };
}

/**
 * Generate a complete wallet set with mnemonic
 */
export function generateWalletSet(currencies?: string[]): WalletSet {
  // Default to all currencies if none specified
  const selected = currencies || ["bitcoin", "ethereum", "solana", "chainlink"];

  // Generate a strong mnemonic (24 words for maximum security)
  const mnemonic = bip39.generateMnemonic(256);

  // Convert mnemonic to seed
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // Generate wallets for selected blockchains
  const walletSet: WalletSet = {
    mnemonic,
    timestamp: new Date().toISOString(),
    selectedCurrencies: selected,
  };

  if (selected.includes("bitcoin")) {
    walletSet.bitcoin = generateBitcoinWallet(seed);
  }

  if (selected.includes("ethereum")) {
    walletSet.ethereum = generateEthereumWallet(seed, "Ethereum");
  }

  if (selected.includes("solana")) {
    walletSet.solana = generateSolanaWallet(seed);
  }

  if (selected.includes("chainlink")) {
    walletSet.chainlink = generateEthereumWallet(seed, "Chainlink");
  }

  return walletSet;
}

/**
 * Generate a dummy wallet set for dry-run mode (no real keys generated)
 */
export function generateDummyWalletSet(currencies?: string[]): WalletSet {
  // Default to all currencies if none specified
  const selected = currencies || ["bitcoin", "ethereum", "solana", "chainlink"];

  const walletSet: WalletSet = {
    mnemonic:
      "example word word word word word word word word word word word word word word word word word word word word word word word word",
    timestamp: new Date().toISOString(),
    selectedCurrencies: selected,
  };

  if (selected.includes("bitcoin")) {
    walletSet.bitcoin = {
      type: "Bitcoin",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      privateKey:
        "0000000000000000000000000000000000000000000000000000000000000000",
      publicKey:
        "000000000000000000000000000000000000000000000000000000000000000000",
      wif: "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn",
    };
  }

  if (selected.includes("ethereum")) {
    walletSet.ethereum = {
      type: "Ethereum",
      address: "0x0000000000000000000000000000000000000000",
      privateKey:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      publicKey:
        "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    };
  }

  if (selected.includes("solana")) {
    walletSet.solana = {
      type: "Solana",
      address: "11111111111111111111111111111111",
      privateKey:
        "0000000000000000000000000000000000000000000000000000000000000000",
      publicKey: "11111111111111111111111111111111",
    };
  }

  if (selected.includes("chainlink")) {
    walletSet.chainlink = {
      type: "Chainlink",
      address: "0x0000000000000000000000000000000000000000",
      privateKey:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      publicKey:
        "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    };
  }

  return walletSet;
}

/**
 * Verify a mnemonic phrase is valid
 */
export function verifyMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Format wallet information for display
 */
export async function formatWalletSet(
  walletSet: WalletSet,
  index: number
): Promise<string> {
  const separator = "=".repeat(80);
  const lines: string[] = [];

  lines.push("");
  lines.push(separator);
  lines.push(`  PAPER WALLET SET #${index}`);
  lines.push(`  Generated: ${walletSet.timestamp}`);
  lines.push(separator);
  lines.push("");

  // Mnemonic
  lines.push("🔑 SEED PHRASE (BIP39 Mnemonic - 24 words)");
  lines.push("-".repeat(80));
  lines.push(walletSet.mnemonic);
  lines.push("");
  lines.push(
    "⚠️  CRITICAL: Store this phrase securely. It can recover ALL wallets below."
  );
  lines.push("");

  // Bitcoin
  if (walletSet.bitcoin) {
    lines.push("₿  BITCOIN (BTC)");
    lines.push("-".repeat(80));
    lines.push(`Address:     ${walletSet.bitcoin.address}`);
    lines.push(
      `Explorer:    https://blockchair.com/bitcoin/address/${walletSet.bitcoin.address}`
    );
    lines.push("");
    lines.push("QR Code:");
    const btcQR = await generateQRCode(walletSet.bitcoin.address);
    lines.push(btcQR);
    lines.push("");
    lines.push(`Private Key: ${walletSet.bitcoin.privateKey}`);
    lines.push(`WIF:         ${walletSet.bitcoin.wif}`);
    lines.push(`Public Key:  ${walletSet.bitcoin.publicKey}`);
    lines.push("");
  }

  // Ethereum
  if (walletSet.ethereum) {
    lines.push("♦  ETHEREUM (ETH)");
    lines.push("-".repeat(80));
    lines.push(`Address:     ${walletSet.ethereum.address}`);
    lines.push(
      `Explorer:    https://etherscan.io/address/${walletSet.ethereum.address}`
    );
    lines.push("");
    lines.push("QR Code:");
    const ethQR = await generateQRCode(walletSet.ethereum.address);
    lines.push(ethQR);
    lines.push("");
    lines.push(`Private Key: ${walletSet.ethereum.privateKey}`);
    lines.push(`Public Key:  ${walletSet.ethereum.publicKey}`);
    lines.push("");
  }

  // Chainlink
  if (walletSet.chainlink) {
    lines.push("🔗 CHAINLINK (LINK)");
    lines.push("-".repeat(80));
    lines.push(`Address:     ${walletSet.chainlink.address}`);
    lines.push(
      `Explorer:    https://etherscan.io/address/${walletSet.chainlink.address}`
    );
    lines.push("");
    lines.push("QR Code:");
    const linkQR = await generateQRCode(walletSet.chainlink.address);
    lines.push(linkQR);
    lines.push("");
    lines.push(`Private Key: ${walletSet.chainlink.privateKey}`);
    lines.push("Note: Chainlink uses Ethereum addresses (ERC-20 token)");
    lines.push("");
  }

  // Solana
  if (walletSet.solana) {
    lines.push("◎  SOLANA (SOL)");
    lines.push("-".repeat(80));
    lines.push(`Address:     ${walletSet.solana.address}`);
    lines.push(
      `Explorer:    https://solscan.io/account/${walletSet.solana.address}`
    );
    lines.push("");
    lines.push("QR Code:");
    const solQR = await generateQRCode(walletSet.solana.address);
    lines.push(solQR);
    lines.push("");
    lines.push(`Private Key: ${walletSet.solana.privateKey}`);
    lines.push(`Public Key:  ${walletSet.solana.publicKey}`);
    lines.push("");
  }

  lines.push(separator);
  lines.push("");

  return lines.join("\n");
}
