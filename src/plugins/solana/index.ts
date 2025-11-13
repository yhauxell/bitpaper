/**
 * Solana Plugin
 * Implements BlockchainProvider for Solana wallet generation
 */

import { Keypair } from "@solana/web3.js";
import * as qrcode from "qrcode-terminal";
import {
  BlockchainProvider,
  PluginMetadata,
  WalletInfo,
} from "../../core/interfaces";

class SolanaProvider implements BlockchainProvider {
  readonly metadata: PluginMetadata = {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    version: "1.0.0",
    description: "Solana wallet generation plugin",
    author: "BitPaper Team",
  };

  generateWallet(seed: Buffer): WalletInfo {
    // Use first 32 bytes of seed for Solana keypair
    const keypair = Keypair.fromSeed(seed.slice(0, 32));

    return {
      address: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString("hex"),
      publicKey: keypair.publicKey.toBase58(),
    };
  }

  getExplorerUrl(address: string): string {
    return `https://solscan.io/account/${address}`;
  }

  async formatWalletInfo(wallet: WalletInfo): Promise<string[]> {
    const lines: string[] = [];

    lines.push(
      `${this.metadata.icon}  ${this.metadata.name.toUpperCase()} (${
        this.metadata.symbol
      })`
    );
    lines.push("-".repeat(80));
    lines.push(`Address:     ${wallet.address}`);
    lines.push(`Explorer:    ${this.getExplorerUrl(wallet.address)}`);
    lines.push("");
    lines.push("QR Code:");

    // Generate QR code
    const qrCode = await this.generateQRCode(wallet.address);
    lines.push(qrCode);

    lines.push("");
    lines.push(`Private Key: ${wallet.privateKey}`);
    lines.push(`Public Key:  ${wallet.publicKey}`);
    lines.push("");

    return lines;
  }

  validateAddress(address: string): boolean {
    try {
      // Solana addresses are base58 encoded and 32-44 characters long
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    } catch {
      return false;
    }
  }

  private generateQRCode(data: string): Promise<string> {
    return new Promise((resolve) => {
      let qrString = "";
      qrcode.generate(data, { small: true }, (qr) => {
        qrString = qr;
        resolve(qrString);
      });
    });
  }
}

// Export provider instance
export const provider = new SolanaProvider();
export default provider;
