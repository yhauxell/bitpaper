/**
 * Bitcoin Plugin
 * Implements BlockchainProvider for Bitcoin wallet generation
 */

import { BIP32Factory } from "bip32";
import * as bitcoin from "bitcoinjs-lib";
import * as qrcode from "qrcode-terminal";
import * as ecc from "tiny-secp256k1";
import {
  BlockchainProvider,
  PluginMetadata,
  WalletInfo,
} from "../../core/interfaces";

// Initialize BIP32 with tiny-secp256k1
const bip32 = BIP32Factory(ecc);

const BITCOIN_NETWORK = bitcoin.networks.bitcoin;

class BitcoinProvider implements BlockchainProvider {
  readonly metadata: PluginMetadata = {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    version: "1.0.0",
    description: "Bitcoin wallet generation with Native SegWit support",
    author: "BitPaper Team",
    derivationPath: "m/44'/0'/0'/0/0",
  };

  generateWallet(seed: Buffer): WalletInfo {
    // Derive Bitcoin key from seed
    const root = bip32.fromSeed(seed, BITCOIN_NETWORK);

    // Use BIP44 path for Bitcoin
    const path = this.metadata.derivationPath!;
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
      address,
      privateKey: child.privateKey.toString("hex"),
      publicKey: child.publicKey.toString("hex"),
      additionalData: {
        wif: child.toWIF(),
      },
    };
  }

  getExplorerUrl(address: string): string {
    return `https://blockchair.com/bitcoin/address/${address}`;
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

    if (wallet.additionalData?.wif) {
      lines.push(`WIF:         ${wallet.additionalData.wif}`);
    }

    lines.push(`Public Key:  ${wallet.publicKey}`);
    lines.push("");

    return lines;
  }

  validateAddress(address: string): boolean {
    try {
      bitcoin.address.toOutputScript(address, BITCOIN_NETWORK);
      return true;
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
export const provider = new BitcoinProvider();
export default provider;
