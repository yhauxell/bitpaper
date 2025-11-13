/**
 * Ethereum Plugin
 * Implements BlockchainProvider for Ethereum wallet generation
 */

import { ethers } from "ethers";
import * as qrcode from "qrcode-terminal";
import {
  BlockchainProvider,
  PluginMetadata,
  WalletInfo,
} from "../../core/interfaces";

class EthereumProvider implements BlockchainProvider {
  readonly metadata: PluginMetadata = {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "♦",
    version: "1.0.0",
    description: "Ethereum wallet generation with ERC-20 token support",
    author: "BitPaper Team",
    derivationPath: "m/44'/60'/0'/0/0",
  };

  generateWallet(seed: Buffer): WalletInfo {
    // Derive Ethereum key from seed using BIP44 path
    const hdNode = ethers.HDNodeWallet.fromSeed(seed);
    const path = this.metadata.derivationPath!;
    const wallet = hdNode.derivePath(path);

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
    };
  }

  getExplorerUrl(address: string): string {
    return `https://etherscan.io/address/${address}`;
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
    return ethers.isAddress(address);
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
export const provider = new EthereumProvider();
export default provider;
