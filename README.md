# BitPaper 🔐

[![Build and Publish](https://github.com/yhauxell/bitpaper/actions/workflows/publish.yml/badge.svg)](https://github.com/yhauxell/bitpaper/actions/workflows/publish.yml)
[![npm version](https://badge.fury.io/js/bitpaper.svg)](https://www.npmjs.com/package/bitpaper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A secure CLI tool to generate paper wallets for multiple cryptocurrencies: **Bitcoin**, **Ethereum**, **Solana**, and **Chainlink**.

Built with [Commander.js](https://github.com/tj/commander.js/) - the most popular Node.js CLI framework.

### ✨ Key Features

- 🔐 **100% Offline** - Generate wallets without internet connection
- 🎯 **Multi-Currency** - Bitcoin, Ethereum, Solana, Chainlink support
- 🔌 **Plugin Architecture** - Easy to add new blockchains
- ⚡ **Plugin Generator** - Scaffold new plugins in 2 minutes with `yarn generate:plugin`
- 📱 **QR Codes** - Scannable QR codes for each address
- 🔗 **Explorer Links** - Direct links to blockchain explorers
- 🧪 **Dry-Run Mode** - Test without generating real keys
- 📝 **BIP39/BIP44** - Industry-standard HD wallet generation
- 🎨 **Interactive CLI** - Beautiful, user-friendly interface
- 🔒 **Type-Safe** - Full TypeScript support

## 📚 Quick Links

**For Users:**

- 📦 [Installation](#-installation) - Get started in 30 seconds
- 🚀 [Usage Guide](#-usage) - Generate your first wallet
- ⚠️ [Security Guide](#️-critical-security-warnings) - Essential safety practices
- 📋 [What Gets Generated](#-what-gets-generated) - Understand the output

**For Developers:**

- 🔌 [Plugin Generator](#-for-developers--contributors) - Add new blockchains (2 min setup!)
- 📖 [Plugin Development Guide](./PLUGIN_DEVELOPMENT.md) - Complete API documentation
- 🏗️ [Plugin Architecture](./PLUGIN_ARCHITECTURE.md) - Technical design patterns
- 🤝 [Contributing Guide](./CONTRIBUTING.md) - How to contribute

**Additional:**

- 🔧 [Development Setup](#-development) - Local development
- 📦 [Publishing Guide](./PUBLISHING.md) - npm publishing workflow
- 📚 [Additional Resources](#-additional-resources) - Standards & documentation

## 📖 What is a Paper Wallet?

A **paper wallet** is a physical document containing your cryptocurrency addresses and private keys, stored completely offline. Think of it as printing out your bank account information, but with cryptographic keys instead.

### Why "Paper"?

The name refers to the **storage method**, not the addresses themselves:

```
Digital Keys → Written/Printed on Paper → "Paper Wallet"
```

### Types of Crypto Storage:

| Type                | Storage          | Example            | Online? |
| ------------------- | ---------------- | ------------------ | ------- |
| **Hot Wallet**      | Software, Online | MetaMask, Coinbase | ✅ Yes  |
| **Hardware Wallet** | USB Device       | Ledger, Trezor     | ❌ No   |
| **Paper Wallet**    | Physical Paper   | BitPaper output    | ❌ No   |

### Benefits:

- ✅ **100% offline** - Immune to hacking
- ✅ **No electronics** - Can't fail or corrupt
- ✅ **Long-term storage** - Works for decades
- ✅ **No batteries** - Unlike hardware wallets
- ✅ **Low cost** - Just paper and ink

### Drawbacks:

- ⚠️ Physical damage (fire, water, deterioration)
- ⚠️ Can be lost or stolen (like cash)
- ⚠️ Not convenient for frequent transactions
- ⚠️ Must manually type keys when spending

## 🔐 How Cryptocurrency Addresses Work

### The Key Concept: Math, Not Registration

**Important:** Cryptocurrency addresses are generated using **pure mathematics** - they don't need to be "registered" on the blockchain!

```
Traditional Banking:
Bank assigns you account number → Stored in bank database → Now you can receive money

Cryptocurrency:
You generate address with math → No database entry → Can receive crypto immediately
```

### What BitPaper Does:

```typescript
1. Generate Random Number (256 bits of entropy)
   ↓
2. Create Mnemonic Seed Phrase (24 words)
   ↓
3. Derive Keys Using Elliptic Curve Cryptography
   ↓
4. Generate Public Key from Private Key (one-way math)
   ↓
5. Hash Public Key to Create Address (more one-way math)
```

**All of this happens locally on your computer. No internet. No blockchain interaction.**

### When Does the Blockchain Get Involved?

The blockchain **only** knows about your address when:

#### ✅ Someone Sends You Funds:

```
Before first transaction:
- Your address exists: Only in your wallet
- Blockchain record: None (address is "invisible")

After first transaction:
- Transaction broadcast to network
- Blockchain records: "0.001 BTC sent to YOUR_ADDRESS"
- Now your address appears on blockchain with balance
```

#### ✅ You Spend Funds:

```
You sign transaction with private key
→ Broadcast to network
→ Blockchain verifies signature matches address
→ Transaction processed
```

### Are These Real Addresses?

**YES! 100% real.** Here's why:

1. **Mathematically Valid** - Generated using the same cryptographic standards as hardware wallets
2. **Blockchain-Ready** - Will be accepted immediately when first used
3. **Industry Standard Libraries** - Uses the same code as MetaMask, Ledger, and Trezor
4. **Can Hold Real Value** - Send real cryptocurrency to them and it will be there

### The Address Space is HUGE

```
Bitcoin addresses: 2^160 = ~1.4 × 10^48 possible addresses
Ethereum addresses: 2^160 = ~1.4 × 10^48 possible addresses
Solana addresses: 2^256 = ~1.15 × 10^77 possible addresses

For comparison:
- Atoms in human body: ~7 × 10^27
- Stars in observable universe: ~10^24
- Grains of sand on Earth: ~7.5 × 10^18
```

There are more Bitcoin addresses than atoms in a million human bodies!

### Could Someone Else Generate the Same Address?

**Technically yes, but practically... NEVER.**

```
Probability of collision: ~1 in 10^48

You're more likely to:
✓ Win the lottery 6 times in a row
✓ Be struck by lightning 10 times in one day
✓ Find a specific atom in the universe

To get 50% chance of ONE collision:
- Need to generate: 2^80 addresses (1.2 septillion)
- At 1 billion/second: Would take 38 BILLION years
- Age of universe: 13.8 billion years

Historical evidence:
- Bitcoin launched: 2009
- Addresses generated: Billions+
- Collisions found: ZERO
```

**The cryptographic security of address generation is rock solid!** This is why wallets can generate addresses offline without checking if they "already exist."

## ⚠️ Critical Security Warnings

**READ BEFORE USING:**

1. ⚠️ **Run this tool OFFLINE** on a secure, air-gapped computer
2. ⚠️ **Never share** private keys or seed phrases with anyone
3. ⚠️ Store paper wallets in a **secure physical location** (safe, vault)
4. ⚠️ Make **backup copies** and store in separate secure locations
5. ⚠️ **Verify addresses** before sending any funds
6. ⚠️ This tool is for **educational/personal use only**

## 📦 Installation

### Option 1: Global Installation (Recommended)

```bash
npm install -g bitpaper
# or
yarn global add bitpaper
```

Then run from anywhere:

```bash
bitpaper generate
```

### Option 2: Local Development

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd bitpaper
yarn install
yarn build
```

Then use via yarn or link locally:

```bash
yarn link
bitpaper generate
```

Or run directly:

```bash
node bin/cli.js generate
```

## 🚀 Usage

### Generate a Single Wallet Set

```bash
bitpaper generate
```

This will show an **interactive selection menu** where you can choose which cryptocurrencies to generate (all are selected by default).

**Interactive Example:**

```
? Select cryptocurrencies to generate: (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ ₿  Bitcoin (BTC)
 ◉ ♦  Ethereum (ETH)
 ◉ ◎  Solana (SOL)
 ◉ 🔗 Chainlink (LINK)
```

### Select Specific Cryptocurrencies (Non-Interactive)

```bash
# Generate only Bitcoin and Ethereum
bitpaper generate --currencies bitcoin,ethereum

# Generate only Solana
bitpaper generate --currencies solana

# Mix and match
bitpaper generate --currencies bitcoin,solana,chainlink
```

### Dry Run (Test Without Generating Real Keys)

```bash
bitpaper generate --dry-run
```

**Perfect for:**

- ✅ Testing the CLI before real use
- ✅ Seeing the output format
- ✅ Demonstrations and screenshots
- ✅ CI/CD pipeline testing

**⚠️ NO real cryptographic keys are generated in dry-run mode!**

### Generate Multiple Wallet Sets

```bash
bitpaper generate --count 5
```

Generate 5 wallet sets at once.

### Save to File

```bash
bitpaper generate --output wallets.txt
```

**Important:** After printing/backing up, securely delete the file:

```bash
shred -vfz -n 10 wallets.txt  # Linux/Mac
```

### Skip Warnings/Instructions

```bash
bitpaper generate --no-warnings --no-instructions
```

### Verify a Mnemonic Phrase

```bash
bitpaper verify "word1 word2 word3 ... word24"
```

Checks if a 24-word mnemonic phrase is valid.

### Show Supported Cryptocurrencies

```bash
bitpaper info
```

### Combine Options

```bash
# Generate 3 sets with only Bitcoin and Ethereum, save to file
bitpaper generate --count 3 --currencies bitcoin,ethereum --output wallets.txt

# Dry-run with specific currencies
bitpaper generate --dry-run --currencies solana

# Non-interactive with no warnings
bitpaper generate --currencies bitcoin --no-warnings --no-instructions
```

### Show Help

```bash
bitpaper --help
bitpaper generate --help
```

## 👩‍💻 For Developers & Contributors

Want to add support for a new blockchain? BitPaper makes it easy!

### Quick Start: Generate a Plugin

```bash
# Clone the repo
git clone https://github.com/yhauxell/bitpaper.git
cd bitpaper
yarn install

# Generate a new blockchain plugin
yarn generate:plugin
```

The interactive generator will create all necessary files and register your plugin automatically!

### Available Commands

```bash
yarn generate:plugin  # Generate new blockchain plugin
yarn build           # Build the project
yarn dev             # Run in development mode
```

### Documentation for Contributors

- **[Plugin Generator Guide](./PLUGIN_GENERATOR.md)** - Step-by-step scaffolding guide
- **[Plugin Development Guide](./PLUGIN_DEVELOPMENT.md)** - Complete API documentation
- **[Contributing Guide](./CONTRIBUTING.md)** - Contribution workflow
- **[Plugin Architecture](./PLUGIN_ARCHITECTURE.md)** - Technical design

### Why Contribute?

- ✅ **Easy**: Plugin generator handles all boilerplate
- ✅ **Fast**: Create plugin scaffold in under 2 minutes
- ✅ **Type-safe**: Full TypeScript support with interfaces
- ✅ **Documented**: Comprehensive guides and examples
- ✅ **Impactful**: Help users secure their crypto assets

**See something missing? [Open an issue](https://github.com/yhauxell/bitpaper/issues) or submit a PR!**

## 📋 What Gets Generated

Each wallet set includes:

### 🔑 BIP39 Mnemonic (24 words)

- A master seed phrase that can recover **ALL** wallets
- **MOST IMPORTANT** - Store this securely!
- Can be used to restore wallets in any compatible wallet software

### ₿ Bitcoin (BTC)

- **Address**: For receiving Bitcoin
- **Explorer Link**: Direct link to Blockchair (check balance/transactions)
- **QR Code**: Scannable QR code for easy address sharing
- **Private Key**: For sending Bitcoin or importing to wallets
- **WIF** (Wallet Import Format): Alternative private key format
- **Public Key**: For verification
- **Format**: Native SegWit (P2WPKH) for lower fees
- **Derivation Path**: `m/44'/0'/0'/0/0`

### ♦ Ethereum (ETH)

- **Address**: For receiving Ethereum
- **Explorer Link**: Direct link to Etherscan (check balance/transactions)
- **QR Code**: Scannable QR code for easy address sharing
- **Private Key**: For sending ETH or importing to MetaMask
- **Public Key**: For verification
- Works with all ERC-20 tokens
- **Derivation Path**: `m/44'/60'/0'/0/0`

### 🔗 Chainlink (LINK)

- **Address**: For receiving LINK tokens
- **Explorer Link**: Direct link to Etherscan (check balance/transactions)
- **QR Code**: Scannable QR code for easy address sharing
- **Private Key**: For sending LINK or importing to wallets
- **Note**: Uses Ethereum addresses (LINK is an ERC-20 token)
- **Derivation Path**: `m/44'/60'/0'/0/0`

### ◎ Solana (SOL)

- **Address**: For receiving Solana
- **Explorer Link**: Direct link to Solscan (check balance/transactions)
- **QR Code**: Scannable QR code for easy address sharing
- **Private Key**: For sending SOL or importing to Phantom/Solflare
- **Public Key**: For verification

## 📖 How to Use Generated Wallets

### Receiving Funds

1. Use the **Address** to receive funds
2. **Share using QR Code** - Scan with wallet apps instead of typing manually
3. Share the address publicly - it's safe
4. Test with a small amount first

### Using QR Codes

Each address includes a **scannable QR code** that makes receiving funds easier:

**Benefits:**

- ✅ No typing errors
- ✅ Fast and convenient
- ✅ Works with all major wallet apps
- ✅ Can be scanned from printed paper wallets

**How to use:**

1. Open your wallet app (MetaMask, Phantom, etc.)
2. Select "Send" or "Transfer"
3. Click "Scan QR Code"
4. Point your camera at the QR code on your paper wallet
5. Confirm the transaction

**For printing:**

- QR codes print clearly on paper
- Use high-quality printer for best results
- Test scanning before storing away

### Sending Funds

You'll need the **Private Key**:

**Bitcoin:**

- Import the WIF or private key into any Bitcoin wallet
- Recommended: Bitcoin Core, Electrum, or hardware wallets

**Ethereum & Chainlink:**

- Import private key into MetaMask, MyEtherWallet, or similar
- For LINK: Add the token contract to your wallet

**Solana:**

- Import private key into Phantom, Solflare, or similar
- Or use the CLI: `solana-keygen recover`

### Using the Seed Phrase

Instead of individual private keys, you can restore ALL wallets using the 24-word mnemonic:

- Bitcoin: Use BIP44 path `m/44'/0'/0'/0/0`
- Ethereum: Use BIP44 path `m/44'/60'/0'/0/0`
- Solana: Use first 32 bytes of seed

## 🛡️ Security Best Practices

### Before Generation

1. **Disconnect from internet** - Run on an offline computer
2. **Use a clean system** - Preferably a live USB OS like Tails
3. **Verify the code** - Review the source before running

### During Generation

1. **Write down immediately** - Have paper and pen ready
2. **Double-check** - Verify you wrote everything correctly
3. **Don't take photos** - Never digitally photograph private keys

### After Generation

1. **Store securely** - Use a fireproof safe or safety deposit box
2. **Make multiple copies** - Store in different secure locations
3. **Test with small amounts** - Verify everything works before large transfers
4. **Delete digital files** - Securely wipe any generated files:
   ```bash
   shred -vfz -n 10 wallets.txt
   ```

### Long-term Storage

1. **Use archival paper** - Won't degrade over time
2. **Consider metal** - Engrave keys on steel plates for fire/water resistance
3. **Protect from elements** - Keep dry and away from heat/light
4. **Plan inheritance** - Consider how heirs will access (secure instructions)

## ⚠️ Common Mistakes to Avoid

1. ❌ Don't generate wallets on an online computer
2. ❌ Don't store private keys in cloud storage
3. ❌ Don't take screenshots or photos
4. ❌ Don't email private keys to yourself
5. ❌ Don't use the same wallet for multiple purposes
6. ❌ Don't forget to make backup copies
7. ❌ Don't throw away the paper - it's your only access!

## 🧪 Testing

Always test with small amounts first:

1. Generate a wallet
2. Send a small test amount to the address
3. Verify you can see the balance
4. Try sending the test amount back
5. Only then use for larger amounts

## 🔧 Technical Details

### Standards Used

- **BIP39**: Mnemonic phrase generation (24 words, 256-bit entropy)
- **BIP32**: Hierarchical deterministic wallets
- **BIP44**: Multi-account hierarchy for deterministic wallets
  - Bitcoin: `m/44'/0'/0'/0/0`
  - Ethereum: `m/44'/60'/0'/0/0`
- **P2WPKH**: Bitcoin Native SegWit addresses (lower fees)

### Dependencies

- **[Commander.js](https://github.com/tj/commander.js/)**: CLI framework (~25M weekly downloads)
- **[Chalk](https://github.com/chalk/chalk)**: Terminal styling
- **[Ora](https://github.com/sindresorhus/ora)**: Loading spinners
- **[bip39](https://github.com/bitcoinjs/bip39)**: Mnemonic generation
- **[bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)**: Bitcoin wallet generation
- **[ethers](https://github.com/ethers-io/ethers.js)**: Ethereum wallet generation
- **[@solana/web3.js](https://github.com/solana-labs/solana-web3.js)**: Solana wallet generation

### Entropy Source

- Uses Node.js `crypto.randomBytes()` for secure random number generation
- Requires system entropy for cryptographically secure keys

### Supported Networks

- **Bitcoin**: Mainnet (change `BITCOIN_NETWORK` in code for testnet)
- **Ethereum**: All EVM-compatible networks
- **Solana**: Mainnet-beta
- **Chainlink**: Ethereum mainnet (ERC-20)

## 🛠️ Development

### Build

```bash
yarn build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

### Run in Development Mode

```bash
yarn dev generate --count 1
# or use ts-node directly
yarn ts-node src/index.ts generate
```

### Project Structure

```
bitpaper/
├── bin/
│   └── cli.js           # Executable entry point
├── src/
│   ├── index.ts         # Main CLI logic (Commander.js)
│   ├── wallet-generator.ts  # Wallet generation functions
│   └── ui.ts            # UI/display functions
├── dist/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── LICENSE
├── .npmignore
└── README.md
```

## 📦 Publishing to npm

### 🤖 Automated Publishing (GitHub Actions)

This project uses GitHub Actions to automatically publish to npm when code is merged to main!

**Setup (One-time):**

1. Create npm token at [npmjs.com](https://www.npmjs.com/settings/tokens)
2. Add token as `NPM_TOKEN` secret in GitHub repository settings
3. See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for detailed instructions

**To Publish a New Version:**

```bash
# Bump version
yarn version --patch  # or --minor, --major

# Push to GitHub
git push --follow-tags

# GitHub Actions will automatically publish to npm! 🚀
```

### 📝 Manual Publishing

If you prefer to publish manually:

**Prerequisites:**

1. **Create an npm account**: [https://www.npmjs.com/signup](https://www.npmjs.com/signup)
2. **Login to npm**:
   ```bash
   npm login
   # or
   yarn login
   ```

### Pre-publish Checklist

Before publishing, make sure:

- ✅ All tests pass (if you have tests)
- ✅ Build succeeds: `yarn build`
- ✅ Package contents are correct: `yarn pack --dry-run`
- ✅ Version number is updated in `package.json`
- ✅ CHANGELOG is updated (if you have one)
- ✅ README is up to date
- ✅ Git repository is clean and pushed

### Publishing Steps

#### 1. Test the Package Locally

```bash
# Build and create a test tarball
yarn pack

# Test installation from the tarball
npm install -g ./yausell-bitpaper-v1.0.0.tgz

# Test the CLI
bitpaper --help

# Uninstall test
npm uninstall -g bitpaper
```

#### 2. Update Version

Follow [Semantic Versioning](https://semver.org/):

```bash
# Patch release (1.0.0 -> 1.0.1) - bug fixes
yarn version --patch

# Minor release (1.0.0 -> 1.1.0) - new features
yarn version --minor

# Major release (1.0.0 -> 2.0.0) - breaking changes
yarn version --major
```

#### 3. Publish to npm

**For Public Scoped Package:**

```bash
npm publish --access public
# or
yarn publish --access public
```

**For Unscoped Package** (if you remove `@yausell/` from the name):

```bash
npm publish
# or
yarn publish
```

#### 4. Verify Publication

```bash
# Check on npm
npm view bitpaper

# Install and test
npm install -g bitpaper
bitpaper --help
```

### Updating the Package

When you make changes:

1. Make your code changes
2. Update version: `yarn version --patch` (or --minor/--major)
3. Build: `yarn build`
4. Publish: `yarn publish --access public`

### Publishing Tips

- **Use npm tags** for pre-releases:

  ```bash
  npm publish --tag beta --access public
  ```

- **Unpublish within 72 hours** if you make a mistake:

  ```bash
  npm unpublish bitpaper@1.0.0
  ```

- **Deprecate old versions** instead of unpublishing:
  ```bash
  npm deprecate bitpaper@1.0.0 "Please upgrade to 1.0.1"
  ```

## 🔌 Extending BitPaper with New Blockchains

BitPaper uses a **plugin-based architecture** that makes it easy to add support for new blockchains without modifying core files.

### Plugin Architecture Features

- ✅ **Self-contained**: Each blockchain in its own plugin directory
- ✅ **Type-safe**: Full TypeScript support with strict interfaces
- ✅ **Auto-discovered**: Plugins are automatically registered
- ✅ **Extensible**: Support for lifecycle hooks and custom features
- ✅ **No core changes**: Add blockchains without touching existing code

### Adding a New Blockchain

**Using the Plugin Generator (Recommended):**

```bash
yarn generate:plugin
```

This interactive command will:

- ✅ Prompt for blockchain details (name, symbol, icon, explorer URL, etc.)
- ✅ Generate all necessary files with your configuration
- ✅ Auto-register the plugin in `src/plugins/index.ts`
- ✅ Provide implementation guidance and next steps

**Manual Setup:**

1. Copy the plugin template:

   ```bash
   cp -r src/plugins/_template src/plugins/cardano
   ```

2. Implement the `BlockchainProvider` interface:

   - `generateWallet(seed)` - Create wallet from BIP39 seed
   - `getExplorerUrl(address)` - Return block explorer URL
   - `formatWalletInfo(wallet)` - Format wallet display
   - `validateAddress(address)` - Validate address format

3. Register your plugin in `src/plugins/index.ts`

4. Build and test:
   ```bash
   yarn build
   bitpaper generate --currencies cardano
   ```

### 📖 Comprehensive Plugin Documentation

**Quick Start:**

- **[Plugin Generator Guide](./PLUGIN_GENERATOR.md)** - Interactive plugin scaffolding tool
  - Command reference and usage
  - Prompt explanations
  - Troubleshooting tips
  - Template customization

**Complete Development Guide:**

- **[Plugin Development Guide](./PLUGIN_DEVELOPMENT.md)** - Full implementation guide
  - Complete API documentation
  - Step-by-step tutorial with examples
  - Best practices and security guidelines
  - Testing strategies and workflows
  - Advanced features (lifecycle hooks, testnet support)

**Technical Documentation:**

- **[Plugin Architecture](./PLUGIN_ARCHITECTURE.md)** - System design documentation
  - Architecture overview and design patterns
  - Core interfaces and components
  - Plugin generator implementation
  - Migration summary and benefits

**Contributing:**

- **[Contributing Guide](./CONTRIBUTING.md)** - Contribution workflow
  - Development setup
  - Code style and conventions
  - Pull request process
  - Security guidelines

### Current Built-in Plugins

- **Bitcoin** (`src/plugins/bitcoin/`) - Native SegWit support
- **Ethereum** (`src/plugins/ethereum/`) - ERC-20 compatible
- **Solana** (`src/plugins/solana/`) - Ed25519 keypairs
- **Chainlink** (`src/plugins/chainlink/`) - ERC-20 token

### Contributing a Plugin

We welcome blockchain integrations! Please ensure:

- ✅ Follows plugin template structure
- ✅ Includes proper error handling
- ✅ Uses well-maintained dependencies
- ✅ Tested thoroughly with dry-run and real generation
- ✅ Documentation for unique features

Submit a PR to add your blockchain to BitPaper! 🚀

## 📚 Additional Resources

### BitPaper Documentation

- **[Plugin Generator Guide](./PLUGIN_GENERATOR.md)** - Automated plugin scaffolding
- **[Plugin Development Guide](./PLUGIN_DEVELOPMENT.md)** - Complete development documentation
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project
- **[Plugin Architecture](./PLUGIN_ARCHITECTURE.md)** - Technical design and patterns
- **[Publishing Guide](./PUBLISHING.md)** - npm publishing workflow

### Cryptocurrency Standards

- **[BIP39 Specification](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)** - Mnemonic code standard
- **[BIP32 Specification](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)** - Hierarchical Deterministic Wallets
- **[BIP44 Specification](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)** - Multi-Account Hierarchy
- **[SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)** - Registered coin types

### Blockchain Documentation

- **[Bitcoin Paper Wallets](https://en.bitcoin.it/wiki/Paper_wallet)** - Bitcoin wiki
- **[Ethereum Private Keys](https://ethereum.org/en/developers/docs/accounts/#account-creation)** - Ethereum docs
- **[Solana Key Pairs](https://docs.solana.com/wallet-guide/cli#keypair-generation)** - Solana documentation

### Tools & Libraries

- **[Commander.js](https://github.com/tj/commander.js/)** - CLI framework
- **[Plop](https://plopjs.com/)** - Plugin generator tool
- **[bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)** - Bitcoin library
- **[ethers.js](https://docs.ethers.org/)** - Ethereum library

## 🆘 Support & Issues

This tool is provided as-is for educational purposes. Always:

- Test thoroughly before using with real funds
- Understand the risks of self-custody
- Consider hardware wallets for large amounts
- Consult with security professionals for high-value storage

## 📄 License

MIT License - Use at your own risk.

---

**Remember: With great power comes great responsibility. You are your own bank!** 🏦
