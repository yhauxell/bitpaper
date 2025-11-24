/**
 * Wallet Generation Module
 *
 * Compatibility layer that uses the plugin system
 */

import * as bip39 from "bip39";
import chalk from "chalk";
import { getRegistry } from "./core/PluginRegistry";
import { WalletFactory } from "./core/WalletFactory";

const walletFactory = new WalletFactory();
const registry = getRegistry();

// ============================================================================
// Legacy Types (for backward compatibility)
// ============================================================================

export interface BitcoinWallet {
  type: "Bitcoin";
  address: string;
  privateKey: string;
  publicKey: string;
  wif: string;
  formats?: Record<string, string>;
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
// Wallet Generation Functions (using plugin system)
// ============================================================================

/**
 * Generate a complete set of wallets for selected cryptocurrencies
 */
export function generateWalletSet(
  selectedCurrencies: string[] = []
): WalletSet {
  // Generate BIP39 mnemonic (24 words for maximum security)
  const mnemonic = bip39.generateMnemonic(256);
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  return generateWalletSetFromSeed(seed, mnemonic, selectedCurrencies);
}

/**
 * Generate wallet set from existing seed
 */
function generateWalletSetFromSeed(
  seed: Buffer,
  mnemonic: string,
  selectedCurrencies: string[]
): WalletSet {
  const timestamp = new Date().toISOString();
  const walletSet: WalletSet = {
    mnemonic,
    timestamp,
    selectedCurrencies:
      selectedCurrencies.length > 0 ? selectedCurrencies : registry.getIds(),
  };

  // Generate wallets for selected currencies using plugins
  const currencies = walletSet.selectedCurrencies;

  for (const currency of currencies) {
    const provider = registry.get(currency);
    if (!provider) {
      console.warn(`Provider "${currency}" not found. Skipping.`);
      continue;
    }

    try {
      // Call generateWallet (it returns WalletInfo, not Promise for our current plugins)
      const walletResult = provider.generateWallet(seed);
      // Handle both sync and async providers
      const wallet = walletResult instanceof Promise ? undefined : walletResult;

      if (!wallet) {
        // If it was async, we can't handle it in sync function
        console.warn(
          `Async wallet generation not supported in legacy API for "${currency}"`
        );
        continue;
      }

      // Map to legacy format
      switch (currency) {
        case "bitcoin":
          walletSet.bitcoin = {
            type: "Bitcoin",
            address: wallet.address,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
            wif: wallet.additionalData?.wif || "",
            formats: wallet.additionalData?.formats,
          };
          break;
        case "ethereum":
          walletSet.ethereum = {
            type: "Ethereum",
            address: wallet.address,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
          };
          break;
        case "solana":
          walletSet.solana = {
            type: "Solana",
            address: wallet.address,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
          };
          break;
        case "chainlink":
          walletSet.chainlink = {
            type: "Chainlink",
            address: wallet.address,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
          };
          break;
      }
    } catch (error) {
      console.error(`Error generating wallet for "${currency}":`, error);
    }
  }

  return walletSet;
}

/**
 * Generate dummy wallet set for testing/demo purposes
 */
export function generateDummyWalletSet(
  selectedCurrencies: string[] = []
): WalletSet {
  const dummyMnemonic =
    "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art";
  const seed = bip39.mnemonicToSeedSync(dummyMnemonic);

  return generateWalletSetFromSeed(seed, dummyMnemonic, selectedCurrencies);
}

/**
 * Format a wallet set for display/output
 */
export async function formatWalletSet(
  walletSet: WalletSet,
  setNumber: number = 1
): Promise<string> {
  const lines: string[] = [];

  // Header
  lines.push("");
  lines.push(chalk.bold.cyan("═".repeat(80)));
  lines.push(chalk.bold.cyan(`  PAPER WALLET SET #${setNumber}`));
  lines.push(chalk.bold.cyan("═".repeat(80)));
  lines.push("");

  // Timestamp
  lines.push(
    chalk.gray(`Generated: ${new Date(walletSet.timestamp).toLocaleString()}`)
  );
  lines.push("");

  // Mnemonic
  lines.push(chalk.bold.yellow("🔐 MASTER SEED PHRASE (BIP39 Mnemonic)"));
  lines.push(chalk.yellow("-".repeat(80)));
  lines.push(chalk.bold(walletSet.mnemonic));
  lines.push("");
  lines.push(
    chalk.red(
      "⚠️  CRITICAL: Write this down and store it securely! This can recover ALL wallets below."
    )
  );
  lines.push("");
  lines.push(chalk.gray("─".repeat(80)));
  lines.push("");

  // Individual wallets - use plugin system for formatting
  for (const currency of walletSet.selectedCurrencies) {
    const provider = registry.get(currency);
    if (!provider) continue;

    let wallet;
    switch (currency) {
      case "bitcoin":
        wallet = walletSet.bitcoin;
        break;
      case "ethereum":
        wallet = walletSet.ethereum;
        break;
      case "solana":
        wallet = walletSet.solana;
        break;
      case "chainlink":
        wallet = walletSet.chainlink;
        break;
    }

    if (wallet) {
      // Convert legacy wallet to plugin WalletInfo format
      const additionalData: Record<string, any> = {};
      
      if ((wallet as any).wif) {
        additionalData.wif = (wallet as any).wif;
      }
      
      if ((wallet as any).formats) {
        additionalData.formats = (wallet as any).formats;
      }

      const walletInfo = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        additionalData: Object.keys(additionalData).length > 0 
          ? additionalData 
          : undefined,
      };

      const formattedLines = await provider.formatWalletInfo(walletInfo);
      lines.push(...formattedLines);
    }
  }

  lines.push(chalk.bold.cyan("═".repeat(80)));
  lines.push("");

  return lines.join("\n");
}

/**
 * Verify a BIP39 mnemonic is valid
 */
export function verifyMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Restore wallets from a mnemonic phrase
 */
export function restoreFromMnemonic(
  mnemonic: string,
  selectedCurrencies: string[] = []
): WalletSet | null {
  if (!verifyMnemonic(mnemonic)) {
    return null;
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  return generateWalletSetFromSeed(seed, mnemonic, selectedCurrencies);
}
