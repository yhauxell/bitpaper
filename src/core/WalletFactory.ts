/**
 * Wallet Factory - Creates wallets using registered blockchain providers
 */

import {
  BlockchainProvider,
  GenerationContext,
  WalletInfo,
} from "./interfaces";
import { getRegistry } from "./PluginRegistry";

export interface WalletSet {
  mnemonic: string;
  wallets: Map<string, WalletInfo>;
  providers: Map<string, BlockchainProvider>;
  timestamp: string;
  selectedCurrencies: string[];
}

export class WalletFactory {
  private registry = getRegistry();

  /**
   * Generate wallets for specified blockchain IDs
   */
  async generateWallets(
    seed: Buffer,
    mnemonic: string,
    blockchainIds: string[],
    isDryRun: boolean = false
  ): Promise<WalletSet> {
    const wallets = new Map<string, WalletInfo>();
    const providers = new Map<string, BlockchainProvider>();
    const timestamp = new Date().toISOString();

    const context: GenerationContext = {
      seed,
      mnemonic,
      isDryRun,
      timestamp,
    };

    for (const id of blockchainIds) {
      const provider = this.registry.get(id);
      if (!provider) {
        console.warn(`Provider "${id}" not found. Skipping.`);
        continue;
      }

      try {
        // Call lifecycle hook if available
        if (provider.onBeforeGenerate) {
          await provider.onBeforeGenerate(context);
        }

        // Generate wallet
        const wallet = await provider.generateWallet(seed);

        // Call lifecycle hook if available
        if (provider.onAfterGenerate) {
          await provider.onAfterGenerate(wallet, context);
        }

        wallets.set(id, wallet);
        providers.set(id, provider);
      } catch (error) {
        console.error(`Error generating wallet for "${id}":`, error);
      }
    }

    return {
      mnemonic,
      wallets,
      providers,
      timestamp,
      selectedCurrencies: blockchainIds,
    };
  }

  /**
   * Validate an address for a specific blockchain
   */
  validateAddress(blockchainId: string, address: string): boolean {
    const provider = this.registry.get(blockchainId);
    if (!provider) {
      return false;
    }
    return provider.validateAddress(address);
  }

  /**
   * Get explorer URL for an address
   */
  getExplorerUrl(blockchainId: string, address: string): string | null {
    const provider = this.registry.get(blockchainId);
    if (!provider) {
      return null;
    }
    return provider.getExplorerUrl(address);
  }
}
