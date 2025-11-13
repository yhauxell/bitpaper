# Plugin Development Guide

This guide will help you create plugins to add support for new blockchains to BitPaper.

## 📋 Table of Contents

- [Overview](#overview)
- [Plugin Architecture](#plugin-architecture)
- [Getting Started](#getting-started)
- [Creating a Plugin](#creating-a-plugin)
- [Testing Your Plugin](#testing-your-plugin)
- [Best Practices](#best-practices)
- [Example Plugins](#example-plugins)
- [Publishing Your Plugin](#publishing-your-plugin)

## Overview

BitPaper uses a plugin-based architecture that allows contributors to add support for new blockchains without modifying the core codebase. Each blockchain is implemented as a plugin that follows the `BlockchainProvider` interface.

### Key Features

- **Isolated**: Each plugin is self-contained in its own directory
- **Type-safe**: Full TypeScript support with strict typing
- **Extensible**: Support for lifecycle hooks and custom features
- **Auto-discovered**: Plugins are automatically registered at startup
- **Testable**: Easy to test plugins in isolation

## Plugin Architecture

### Core Interfaces

All plugins must implement the `BlockchainProvider` interface:

```typescript
interface BlockchainProvider {
  // Metadata
  readonly metadata: PluginMetadata;

  // Core wallet generation
  generateWallet(seed: Buffer): Promise<WalletInfo> | WalletInfo;

  // Display and formatting
  getExplorerUrl(address: string): string;
  formatWalletInfo(wallet: WalletInfo): Promise<string[]> | string[];

  // Validation
  validateAddress(address: string): boolean;

  // Optional lifecycle hooks
  onBeforeGenerate?(context: GenerationContext): Promise<void> | void;
  onAfterGenerate?(
    wallet: WalletInfo,
    context: GenerationContext
  ): Promise<void> | void;
}
```

### Plugin Structure

Each plugin consists of:

```
src/plugins/[blockchain-name]/
├── index.ts       # Main plugin implementation
└── plugin.json    # Plugin metadata (optional)
```

## Getting Started

### Prerequisites

- Node.js 16+
- Yarn or npm
- TypeScript knowledge
- Understanding of BIP39/BIP44 (for HD wallets)

### 1. Clone and Setup

```bash
git clone https://github.com/yhauxell/bitpaper.git
cd bitpaper
yarn install
yarn build
```

### 2. Generate Plugin Scaffold

Use the built-in plugin generator powered by [Plop](https://plopjs.com/):

```bash
yarn generate:plugin
```

This interactive command will prompt you for:

- Blockchain name (e.g., Cardano, Polkadot)
- Token symbol (e.g., ADA, DOT)
- Unicode icon (e.g., ◈, ⬡)
- Description
- Author name
- Block explorer URL
- BIP44 derivation path (if applicable)
- Main npm package dependency (optional)

The generator will automatically:

- ✅ Create all necessary files with your information
- ✅ Register the plugin in `src/plugins/index.ts`
- ✅ Set up the correct directory structure
- ✅ Provide next steps and instructions

**Manual Alternative:**

If you prefer manual setup:

```bash
cp -r src/plugins/_template src/plugins/[your-blockchain]
```

Replace `[your-blockchain]` with your blockchain name in lowercase (e.g., `cardano`, `polkadot`, `avalanche`).

## Creating a Plugin

### Quick Start with Generator

If you used `yarn generate:plugin`, most of the scaffolding is done! The generator creates:

1. **`index.ts`** - Main plugin file with metadata pre-filled
2. **`plugin.json`** - Plugin manifest with your configuration
3. **`README.md`** - Plugin-specific documentation

Your plugin is already registered in `src/plugins/index.ts`, so you can jump straight to implementing the wallet generation logic.

### Step 1: Update Plugin Metadata (if needed)

If you're working with the manual template or need to adjust metadata, open `src/plugins/[your-blockchain]/index.ts` and update:

```typescript
readonly metadata: PluginMetadata = {
  id: "cardano",           // Unique ID (lowercase, no spaces)
  name: "Cardano",         // Display name
  symbol: "ADA",           // Token symbol
  icon: "◈",              // Unicode icon
  version: "1.0.0",        // Plugin version
  description: "Cardano wallet generation with Shelley address support",
  author: "Your Name",
  derivationPath: "m/44'/1815'/0'/0/0", // BIP44 path (if applicable)
};
```

### Step 2: Install Dependencies

Add any blockchain-specific libraries to `package.json`:

```bash
yarn add cardano-wallet-js
yarn add @types/cardano-wallet-js --dev  # If types are available
```

### Step 3: Implement Wallet Generation

The most important method is `generateWallet()`:

```typescript
generateWallet(seed: Buffer): WalletInfo {
  // 1. Import required libraries
  const cardano = require('cardano-wallet-js');

  // 2. Derive keys from seed
  const wallet = cardano.fromSeed(seed, this.metadata.derivationPath);

  // 3. Generate address
  const address = wallet.getAddress();

  // 4. Return wallet info
  return {
    address: address,
    privateKey: wallet.getPrivateKey().toString('hex'),
    publicKey: wallet.getPublicKey().toString('hex'),
    additionalData: {
      // Optional: Include blockchain-specific data
      stakeAddress: wallet.getStakeAddress(),
    },
  };
}
```

### Step 4: Implement Explorer URL

```typescript
getExplorerUrl(address: string): string {
  return `https://cardanoscan.io/address/${address}`;
}
```

### Step 5: Implement Address Validation

```typescript
validateAddress(address: string): boolean {
  try {
    // Use blockchain-specific validation
    return cardano.Address.isValid(address);
  } catch {
    return false;
  }
}
```

### Step 6: Format Wallet Display (Optional Customization)

You can customize how the wallet is displayed:

```typescript
async formatWalletInfo(wallet: WalletInfo): Promise<string[]> {
  const lines: string[] = [];

  lines.push(`${this.metadata.icon}  ${this.metadata.name.toUpperCase()} (${this.metadata.symbol})`);
  lines.push("-".repeat(80));
  lines.push(`Payment Address: ${wallet.address}`);

  // Show stake address if available
  if (wallet.additionalData?.stakeAddress) {
    lines.push(`Stake Address:   ${wallet.additionalData.stakeAddress}`);
  }

  lines.push(`Explorer:        ${this.getExplorerUrl(wallet.address)}`);
  lines.push("");

  // QR Code
  lines.push("QR Code:");
  const qrCode = await this.generateQRCode(wallet.address);
  lines.push(qrCode);
  lines.push("");

  // Keys
  lines.push(`Private Key:     ${wallet.privateKey}`);
  lines.push(`Public Key:      ${wallet.publicKey}`);
  lines.push("");

  return lines;
}
```

### Step 7: Register Your Plugin

Add your plugin to `src/plugins/index.ts`:

```typescript
import bitcoinProvider from "./bitcoin";
import ethereumProvider from "./ethereum";
import solanaProvider from "./solana";
import chainlinkProvider from "./chainlink";
import cardanoProvider from "./cardano"; // Add this

export function registerBuiltInPlugins(): void {
  const registry = getRegistry();

  registry.register(bitcoinProvider);
  registry.register(ethereumProvider);
  registry.register(solanaProvider);
  registry.register(chainlinkProvider);
  registry.register(cardanoProvider); // Add this
}

export {
  bitcoinProvider,
  ethereumProvider,
  solanaProvider,
  chainlinkProvider,
  cardanoProvider, // Add this
};
```

## Testing Your Plugin

### 1. Build the Project

```bash
yarn build
```

### 2. Test with Dry Run

```bash
bitpaper generate --dry-run --currencies cardano
```

This generates a test wallet without creating real keys.

### 3. Verify Plugin Info

```bash
bitpaper info
```

Your plugin should appear in the list.

### 4. Test Real Generation (Offline!)

```bash
bitpaper generate --currencies cardano
```

**⚠️ Always test real key generation on an air-gapped machine!**

### 5. Verify Output

Check that:

- ✅ Address is in correct format
- ✅ QR code displays correctly
- ✅ Explorer link is valid
- ✅ All keys are present
- ✅ Address can be validated by blockchain tools

## Best Practices

### Security

1. **Never log private keys** - Even during development
2. **Use secure random generation** - Let BIP39 handle entropy
3. **Test on testnet first** - If available for your blockchain
4. **Audit dependencies** - Review security of blockchain libraries

### Code Quality

1. **TypeScript strict mode** - Leverage type safety
2. **Error handling** - Wrap critical operations in try-catch
3. **Validation** - Validate all outputs before returning
4. **Documentation** - Comment complex blockchain-specific logic

### Performance

1. **Lazy loading** - Import heavy libraries only when needed
2. **Async operations** - Use async for I/O bound operations
3. **Caching** - Cache derivation if generating multiple addresses

### User Experience

1. **Clear icons** - Choose distinctive Unicode icons
2. **Helpful URLs** - Use popular, stable block explorers
3. **Additional info** - Include blockchain-specific details users need
4. **Error messages** - Provide clear, actionable error messages

## Example Plugins

### Bitcoin Plugin

Location: `src/plugins/bitcoin/index.ts`

Features:

- Native SegWit (P2WPKH) addresses
- WIF private key export
- BIP44 derivation path

Key learnings:

- Using `bitcoinjs-lib` for address generation
- Handling different address formats
- Network selection (mainnet/testnet)

### Ethereum Plugin

Location: `src/plugins/ethereum/index.ts`

Features:

- ERC-20 compatible addresses
- Ethers.js integration
- Checksummed addresses

Key learnings:

- HD wallet derivation with ethers
- Address checksumming
- ERC-20 token compatibility

### Solana Plugin

Location: `src/plugins/solana/index.ts`

Features:

- Ed25519 keypair generation
- Base58 address encoding
- Direct seed usage (non-BIP44)

Key learnings:

- Non-BIP44 blockchain integration
- Using first 32 bytes of seed
- Base58 encoding

## Publishing Your Plugin

### As a Pull Request (Recommended)

1. Fork the repository
2. Create your plugin in `src/plugins/[blockchain]/`
3. Add tests if possible
4. Update `src/plugins/index.ts`
5. Submit a PR with:
   - Description of the blockchain
   - Testing evidence
   - Dependencies rationale

### As an External Plugin (Future)

We're working on support for external plugins via npm packages. Stay tuned!

## Advanced Features

### Lifecycle Hooks

```typescript
async onBeforeGenerate(context: GenerationContext): Promise<void> {
  // Called before wallet generation
  console.log(`Generating in ${context.isDryRun ? 'dry-run' : 'live'} mode`);
}

async onAfterGenerate(wallet: WalletInfo, context: GenerationContext): Promise<void> {
  // Called after wallet generation
  // Useful for validation or additional processing
}
```

### Multiple Address Formats

```typescript
class MyProvider implements MultiFormatProvider {
  supportsMultipleFormats = true as const;

  getAlternativeFormats(wallet: WalletInfo): Record<string, string> {
    return {
      Legacy: convertToLegacy(wallet.address),
      SegWit: convertToSegWit(wallet.address),
      "Native SegWit": wallet.address,
    };
  }
}
```

### Testnet Support

```typescript
supportsTestnet = true;

getTestnetExplorerUrl(address: string): string {
  return `https://testnet.explorer.com/address/${address}`;
}
```

## Need Help?

- 📚 Check existing plugins for reference
- 💬 Open a GitHub Discussion for questions
- 🐛 Report issues on GitHub
- 📧 Contact maintainers: yhauxell@gmail.com

## Contributing

We welcome all blockchain integrations! Please ensure your plugin:

1. ✅ Follows the plugin template structure
2. ✅ Implements all required interface methods
3. ✅ Includes proper error handling
4. ✅ Has been tested thoroughly
5. ✅ Uses well-maintained dependencies
6. ✅ Includes documentation for unique features

Thank you for contributing to BitPaper! 🎉
