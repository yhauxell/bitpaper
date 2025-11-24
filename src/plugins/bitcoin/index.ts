/**
 * Bitcoin Plugin
 * Implements BlockchainProvider for Bitcoin wallet generation
 * Supports multiple address formats: Legacy (P2PKH), P2SH-SegWit, and Native SegWit
 */

import { BIP32Factory } from "bip32";
import * as bitcoin from "bitcoinjs-lib";
import * as qrcode from "qrcode-terminal";
import * as ecc from "tiny-secp256k1";
import {
  MultiFormatProvider,
  PluginMetadata,
  WalletInfo,
} from "../../core/interfaces";

// Initialize BIP32 with tiny-secp256k1
const bip32 = BIP32Factory(ecc);

const BITCOIN_NETWORK = bitcoin.networks.bitcoin;

// Bitcoin address format types
export type BitcoinAddressFormat = "legacy" | "p2sh-segwit" | "native-segwit";

class BitcoinProvider implements MultiFormatProvider {
  readonly supportsMultipleFormats = true as const;

  readonly metadata: PluginMetadata = {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    version: "1.1.0",
    description:
      "Bitcoin wallet generation with multiple address formats (Legacy, P2SH-SegWit, Native SegWit)",
    author: "BitPaper Team",
    derivationPath: "m/44'/0'/0'/0/0",
  };

  /**
   * Generate address in specified format
   */
  private generateAddress(
    publicKey: Buffer,
    format: BitcoinAddressFormat
  ): string {
    let payment;

    switch (format) {
      case "legacy":
        // P2PKH (Legacy) - starts with "1"
        payment = bitcoin.payments.p2pkh({
          pubkey: publicKey,
          network: BITCOIN_NETWORK,
        });
        break;

      case "p2sh-segwit":
        // P2SH-SegWit (P2WPKH wrapped in P2SH) - starts with "3"
        payment = bitcoin.payments.p2sh({
          redeem: bitcoin.payments.p2wpkh({
            pubkey: publicKey,
            network: BITCOIN_NETWORK,
          }),
          network: BITCOIN_NETWORK,
        });
        break;

      case "native-segwit":
        // P2WPKH (Native SegWit) - starts with "bc1"
        payment = bitcoin.payments.p2wpkh({
          pubkey: publicKey,
          network: BITCOIN_NETWORK,
        });
        break;

      default:
        throw new Error(`Unsupported address format: ${format}`);
    }

    if (!payment.address) {
      throw new Error(`Failed to generate ${format} Bitcoin address`);
    }

    return payment.address;
  }

  /**
   * Get alternative address formats for the same key pair
   */
  getAlternativeFormats(wallet: WalletInfo): Record<string, string> {
    const publicKey = Buffer.from(wallet.publicKey, "hex");

    return {
      "Legacy (P2PKH)": this.generateAddress(publicKey, "legacy"),
      "P2SH-SegWit": this.generateAddress(publicKey, "p2sh-segwit"),
      "Native SegWit (P2WPKH)": this.generateAddress(
        publicKey,
        "native-segwit"
      ),
    };
  }

  generateWallet(seed: Buffer): WalletInfo {
    // Derive Bitcoin key from seed
    const root = bip32.fromSeed(seed, BITCOIN_NETWORK);

    // Use BIP44 path for Bitcoin
    const path = this.metadata.derivationPath!;
    const child = root.derivePath(path);

    if (!child.privateKey) {
      throw new Error("Failed to derive Bitcoin private key");
    }

    // Generate Native SegWit address as default (most efficient and modern)
    const address = this.generateAddress(child.publicKey, "native-segwit");

    // Store all address formats in additionalData
    const alternativeFormats = this.getAlternativeFormats({
      address: "",
      privateKey: child.privateKey.toString("hex"),
      publicKey: child.publicKey.toString("hex"),
    });

    return {
      address,
      privateKey: child.privateKey.toString("hex"),
      publicKey: child.publicKey.toString("hex"),
      additionalData: {
        wif: child.toWIF(),
        formats: alternativeFormats,
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

    // Get format preference from global configuration
    let formatPreference = (global as any).__formatPreference || "all";

    // Validate format for Bitcoin
    const validFormats = ["legacy", "p2sh-segwit", "native-segwit", "all"];
    if (!validFormats.includes(formatPreference)) {
      console.warn(
        `⚠️  Warning: Bitcoin does not support format "${formatPreference}".`
      );
      console.warn(`    Valid Bitcoin formats: ${validFormats.join(", ")}`);
      console.warn(`    Showing all formats instead.`);
      console.warn("");
      formatPreference = "all";
    }

    // Display address formats based on user preference
    if (wallet.additionalData?.formats) {
      const formats = wallet.additionalData.formats as Record<string, string>;

      // Determine which formats to display
      const shouldShowLegacy =
        formatPreference === "all" || formatPreference === "legacy";
      const shouldShowP2SH =
        formatPreference === "all" || formatPreference === "p2sh-segwit";
      const shouldShowNativeSegwit =
        formatPreference === "all" || formatPreference === "native-segwit";

      // If showing all formats, use plural header
      if (formatPreference === "all") {
        lines.push("ADDRESS FORMATS:");
      } else {
        lines.push("ADDRESS:");
      }
      lines.push("");

      // Legacy format
      if (shouldShowLegacy && formats["Legacy (P2PKH)"]) {
        lines.push(`  Legacy (P2PKH):           ${formats["Legacy (P2PKH)"]}`);
        lines.push(`    • Starts with "1", widely supported, higher fees`);
        lines.push("");
      }

      // P2SH-SegWit format
      if (shouldShowP2SH && formats["P2SH-SegWit"]) {
        lines.push(`  P2SH-SegWit:              ${formats["P2SH-SegWit"]}`);
        lines.push(`    • Starts with "3", compatible SegWit, medium fees`);
        lines.push("");
      }

      // Native SegWit format (default)
      if (shouldShowNativeSegwit && formats["Native SegWit (P2WPKH)"]) {
        lines.push(
          `  Native SegWit (P2WPKH):   ${formats["Native SegWit (P2WPKH)"]} ⭐ Recommended`
        );
        lines.push(`    • Starts with "bc1", lowest fees, best efficiency`);
        lines.push("");
      }

      if (formatPreference === "all") {
        lines.push(
          "💡 All addresses above are derived from the same private key."
        );
        lines.push(
          "   Choose the format that works best for your wallet/exchange."
        );
      } else {
        lines.push(
          "💡 All address formats are available from the same private key."
        );
        lines.push("   Use --format=all to see all available formats.");
      }
    } else {
      // Fallback for wallets without format data
      lines.push(`Address:     ${wallet.address}`);
    }

    lines.push("");

    // Determine which address to use for explorer and QR code
    let primaryAddress = wallet.address;
    let addressLabel = "";

    if (wallet.additionalData?.formats) {
      const formats = wallet.additionalData.formats as Record<string, string>;

      switch (formatPreference) {
        case "legacy":
          primaryAddress = formats["Legacy (P2PKH)"] || wallet.address;
          addressLabel = "Legacy";
          break;
        case "p2sh-segwit":
          primaryAddress = formats["P2SH-SegWit"] || wallet.address;
          addressLabel = "P2SH-SegWit";
          break;
        case "native-segwit":
          primaryAddress = formats["Native SegWit (P2WPKH)"] || wallet.address;
          addressLabel = "Native SegWit";
          break;
        default: // "all"
          primaryAddress = formats["Native SegWit (P2WPKH)"] || wallet.address;
          addressLabel = "Native SegWit";
      }
    }

    lines.push(`Explorer:    ${this.getExplorerUrl(primaryAddress)}`);
    lines.push("");
    lines.push(`QR Code${addressLabel ? ` (${addressLabel})` : ""}:`);

    const qrCode = await this.generateQRCode(primaryAddress);
    lines.push(qrCode);

    lines.push("");
    lines.push("PRIVATE KEYS:");
    lines.push(`  Private Key (hex): ${wallet.privateKey}`);

    if (wallet.additionalData?.wif) {
      lines.push(`  WIF Format:        ${wallet.additionalData.wif}`);
    }

    lines.push("");
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
