# Plugin Template

This directory contains a template for creating new blockchain plugins for BitPaper.

## Quick Start

1. **Copy this directory** to create your plugin:

   ```bash
   cp -r src/plugins/_template src/plugins/[blockchain-name]
   ```

2. **Replace placeholders** in `index.ts`:

   - `[BLOCKCHAIN_NAME]` → Your blockchain name (e.g., `Cardano`, `Polkadot`)
   - `[blockchain-id]` → Lowercase ID (e.g., `cardano`, `polkadot`)
   - `[SYMBOL]` → Token symbol (e.g., `ADA`, `DOT`)
   - `[ICON]` → Unicode icon (e.g., `◈`, `⬡`)
   - `[DERIVATION_PATH]` → BIP44 path if applicable

3. **Implement the required methods**:

   - `generateWallet()` - Core wallet generation logic
   - `getExplorerUrl()` - Block explorer URL
   - `validateAddress()` - Address validation
   - `formatWalletInfo()` - Custom formatting (optional)

4. **Update `plugin.json`** with your blockchain metadata

5. **Register your plugin** in `src/plugins/index.ts`

6. **Build and test**:
   ```bash
   yarn build
   bitpaper generate --dry-run --currencies [blockchain-id]
   ```

## Files

- **`index.ts`** - Main plugin implementation with template code
- **`plugin.json`** - Plugin metadata (optional but recommended)
- **`README.md`** - This file

## Full Documentation

For complete documentation, examples, and best practices, see:

📖 **[PLUGIN_DEVELOPMENT.md](../../../PLUGIN_DEVELOPMENT.md)**

## Need Help?

- Check existing plugins: `bitcoin`, `ethereum`, `solana`, `chainlink`
- Open a GitHub Discussion
- Contact: yhauxell@gmail.com

Happy plugin development! 🚀
