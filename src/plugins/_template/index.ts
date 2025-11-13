/**
 * [BLOCKCHAIN_NAME] Plugin Template
 * Implements BlockchainProvider for [BLOCKCHAIN_NAME] wallet generation
 *
 * INSTRUCTIONS:
 * 1. Copy this template to a new directory: src/plugins/[your-blockchain]/
 * 2. Replace all [PLACEHOLDER] values with your blockchain's information
 * 3. Implement the wallet generation logic
 * 4. Update plugin.json with your blockchain metadata
 * 5. Register your plugin in src/plugins/index.ts
 * 6. Run `yarn build` to compile
 * 7. Test with `bitpaper generate --currencies [your-blockchain]`
 */

import * as qrcode from "qrcode-terminal";
import {
  BlockchainProvider,
  PluginMetadata,
  WalletInfo,
} from "../../core/interfaces";

class [BLOCKCHAIN_NAME]Provider implements BlockchainProvider {
  readonly metadata: PluginMetadata = {
    id: "[blockchain-id]", // lowercase, no spaces (e.g., "cardano", "polkadot")
    name: "[Blockchain Name]", // Display name (e.g., "Cardano", "Polkadot")
    symbol: "[SYMBOL]", // Token symbol (e.g., "ADA", "DOT")
    icon: "[ICON]", // Unicode icon/emoji (e.g., "◈", "⬡")
    version: "1.0.0",
    description: "[Brief description of the blockchain]",
    author: "Your Name",
    derivationPath: "[DERIVATION_PATH]", // Optional: BIP44 path if applicable
  };

  /**
   * Generate a wallet from the provided seed
   * 
   * @param seed - The BIP39 seed buffer (64 bytes)
   * @returns WalletInfo object containing address, private key, and public key
   */
  generateWallet(seed: Buffer): WalletInfo {
    // TODO: Implement your wallet generation logic here
    // 
    // Common steps:
    // 1. Derive keys from the seed (use appropriate derivation for your blockchain)
    // 2. Generate the public address
    // 3. Extract the private key
    // 4. Return the WalletInfo object
    //
    // Example for BIP44-based chains:
    // const hdNode = someLibrary.fromSeed(seed);
    // const wallet = hdNode.derivePath(this.metadata.derivationPath!);
    // 
    // return {
    //   address: wallet.address,
    //   privateKey: wallet.privateKey.toString("hex"),
    //   publicKey: wallet.publicKey.toString("hex"),
    // };

    throw new Error("Not implemented - please implement generateWallet()");
  }

  /**
   * Get the blockchain explorer URL for an address
   * 
   * @param address - The wallet address
   * @returns Full URL to view the address on a block explorer
   */
  getExplorerUrl(address: string): string {
    // TODO: Replace with your blockchain's explorer URL
    return `https://[blockchain-explorer].com/address/${address}`;
  }

  /**
   * Format wallet information for display
   * 
   * @param wallet - The WalletInfo object
   * @returns Array of formatted strings for console output
   */
  async formatWalletInfo(wallet: WalletInfo): Promise<string[]> {
    const lines: string[] = [];

    // Header with blockchain name
    lines.push(
      `${this.metadata.icon}  ${this.metadata.name.toUpperCase()} (${
        this.metadata.symbol
      })`
    );
    lines.push("-".repeat(80));
    
    // Address and explorer link
    lines.push(`Address:     ${wallet.address}`);
    lines.push(`Explorer:    ${this.getExplorerUrl(wallet.address)}`);
    lines.push("");
    
    // QR Code
    lines.push("QR Code:");
    const qrCode = await this.generateQRCode(wallet.address);
    lines.push(qrCode);
    lines.push("");
    
    // Keys
    lines.push(`Private Key: ${wallet.privateKey}`);
    lines.push(`Public Key:  ${wallet.publicKey}`);
    
    // Optional: Add any additional data
    if (wallet.additionalData) {
      for (const [key, value] of Object.entries(wallet.additionalData)) {
        lines.push(`${key}:         ${value}`);
      }
    }
    
    lines.push("");

    return lines;
  }

  /**
   * Validate if an address is valid for this blockchain
   * 
   * @param address - The address to validate
   * @returns true if valid, false otherwise
   */
  validateAddress(address: string): boolean {
    // TODO: Implement address validation for your blockchain
    // 
    // Examples:
    // - Check address format (length, character set)
    // - Verify checksum if applicable
    // - Use blockchain-specific validation library
    //
    // For now, basic regex validation:
    try {
      // Replace with your blockchain's address validation
      return /^[a-zA-Z0-9]{20,100}$/.test(address);
    } catch {
      return false;
    }
  }

  /**
   * Helper method to generate QR code
   */
  private generateQRCode(data: string): Promise<string> {
    return new Promise((resolve) => {
      let qrString = "";
      qrcode.generate(data, { small: true }, (qr) => {
        qrString = qr;
        resolve(qrString);
      });
    });
  }

  // ============================================================================
  // OPTIONAL: Advanced Features
  // ============================================================================

  /**
   * Optional: Support testnet
   */
  // supportsTestnet = true;
  // getTestnetExplorerUrl(address: string): string {
  //   return `https://testnet.[blockchain-explorer].com/address/${address}`;
  // }

  /**
   * Optional: Lifecycle hook - called before wallet generation
   */
  // async onBeforeGenerate(context: GenerationContext): Promise<void> {
  //   console.log(`Preparing to generate ${this.metadata.name} wallet...`);
  // }

  /**
   * Optional: Lifecycle hook - called after wallet generation
   */
  // async onAfterGenerate(wallet: WalletInfo, context: GenerationContext): Promise<void> {
  //   console.log(`Generated ${this.metadata.name} wallet: ${wallet.address}`);
  // }
}

// Export provider instance
export const provider = new [BLOCKCHAIN_NAME]Provider();
export default provider;

