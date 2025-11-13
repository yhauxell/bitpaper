# BitPaper 🔐

A secure CLI tool to generate paper wallets for multiple cryptocurrencies: **Bitcoin**, **Ethereum**, **Solana**, and **Chainlink**.

Built with [Commander.js](https://github.com/tj/commander.js/) - the most popular Node.js CLI framework.

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

This generates one wallet set containing addresses and keys for Bitcoin, Ethereum, Solana, and Chainlink.

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

### Show Help

```bash
bitpaper --help
bitpaper generate --help
```

## 📋 What Gets Generated

Each wallet set includes:

### 🔑 BIP39 Mnemonic (24 words)

- A master seed phrase that can recover **ALL** wallets
- **MOST IMPORTANT** - Store this securely!
- Can be used to restore wallets in any compatible wallet software

### ₿ Bitcoin (BTC)

- **Address**: For receiving Bitcoin
- **Private Key**: For sending Bitcoin or importing to wallets
- **WIF** (Wallet Import Format): Alternative private key format
- **Public Key**: For verification
- **Format**: Native SegWit (P2WPKH) for lower fees
- **Derivation Path**: `m/44'/0'/0'/0/0`

### ♦ Ethereum (ETH)

- **Address**: For receiving Ethereum
- **Private Key**: For sending ETH or importing to MetaMask
- **Public Key**: For verification
- Works with all ERC-20 tokens
- **Derivation Path**: `m/44'/60'/0'/0/0`

### 🔗 Chainlink (LINK)

- **Address**: For receiving LINK tokens
- **Private Key**: For sending LINK or importing to wallets
- **Note**: Uses Ethereum addresses (LINK is an ERC-20 token)
- **Derivation Path**: `m/44'/60'/0'/0/0`

### ◎ Solana (SOL)

- **Address**: For receiving Solana
- **Private Key**: For sending SOL or importing to Phantom/Solflare
- **Public Key**: For verification

## 📖 How to Use Generated Wallets

### Receiving Funds

1. Use the **Address** to receive funds
2. Share the address publicly - it's safe
3. Test with a small amount first

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

### Prerequisites

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

## 📚 Additional Resources

- [BIP39 Specification](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [Bitcoin Paper Wallets](https://en.bitcoin.it/wiki/Paper_wallet)
- [Ethereum Private Keys](https://ethereum.org/en/developers/docs/accounts/#account-creation)
- [Solana Key Pairs](https://docs.solana.com/wallet-guide/cli#keypair-generation)

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
