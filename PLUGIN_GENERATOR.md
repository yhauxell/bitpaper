# Plugin Generator Guide

## Overview

BitPaper includes a powerful plugin generator powered by [Plop](https://plopjs.com/) that makes creating new blockchain plugins fast and easy.

## Quick Start

```bash
yarn generate:plugin
```

That's it! The generator will guide you through the rest.

## What It Does

The plugin generator:

1. **Asks Interactive Questions**

   - Blockchain name (e.g., Cardano, Polkadot)
   - Token symbol (e.g., ADA, DOT)
   - Unicode icon (e.g., ◈, ⬡)
   - Description
   - Author name
   - Block explorer URL
   - Whether it uses BIP44 derivation
   - BIP44 path (if applicable)
   - Main npm package dependency (optional)

2. **Validates Your Inputs**

   - Ensures correct naming format
   - Checks if plugin already exists
   - Validates URLs and derivation paths
   - Confirms symbol format

3. **Generates Files**

   - `src/plugins/[blockchain]/index.ts` - Main implementation
   - `src/plugins/[blockchain]/plugin.json` - Metadata
   - `src/plugins/[blockchain]/README.md` - Documentation

4. **Auto-Registers Plugin**

   - Adds import statement to `src/plugins/index.ts`
   - Registers provider in the registry
   - Exports provider for external use

5. **Provides Next Steps**
   - Installation commands for dependencies
   - Implementation checklist
   - Testing instructions
   - Documentation links

## Example Session

```bash
$ yarn generate:plugin

? Blockchain name (e.g., Cardano, Polkadot): Cardano
? Token symbol (e.g., ADA, DOT): ADA
? Unicode icon (e.g., ◈, ⬡, 🔷): ◈
? Brief description: Cardano wallet generation plugin
? Author name: John Doe
? Block explorer base URL: https://cardanoscan.io/address
? Does this blockchain use BIP44 derivation? Yes
? BIP44 derivation path: m/44'/1815'/0'/0/0
? Main npm package for this blockchain (optional): @emurgo/cardano-serialization-lib-nodejs

✅ Plugin scaffolded successfully!

📁 Files created:
   • src/plugins/cardano/index.ts
   • src/plugins/cardano/plugin.json
   • src/plugins/cardano/README.md
   • Updated src/plugins/index.ts

⚠️  Next Steps:
1. Install dependencies (if needed):
   yarn add @emurgo/cardano-serialization-lib-nodejs

2. Implement the wallet generation logic:
   • Edit src/plugins/cardano/index.ts
   • Implement generateWallet() method
   • Implement validateAddress() method

3. Build and test:
   yarn build
   bitpaper generate --dry-run --currencies cardano

4. See the plugin README for more details:
   cat src/plugins/cardano/README.md

📖 Full documentation: PLUGIN_DEVELOPMENT.md
```

## Generated File Structure

### index.ts

```typescript
class CardanoProvider implements BlockchainProvider {
  readonly metadata: PluginMetadata = {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    icon: "◈",
    version: "1.0.0",
    description: "Cardano wallet generation plugin",
    author: "John Doe",
    derivationPath: "m/44'/1815'/0'/0/0",
  };

  generateWallet(seed: Buffer): WalletInfo {
    // TODO: Implement
    throw new Error("Cardano wallet generation not yet implemented");
  }

  // ... other methods with TODOs
}
```

### plugin.json

```json
{
  "id": "cardano",
  "name": "Cardano",
  "symbol": "ADA",
  "icon": "◈",
  "version": "1.0.0",
  "description": "Cardano wallet generation plugin",
  "author": "John Doe",
  "dependencies": {
    "@emurgo/cardano-serialization-lib-nodejs": "^1.0.0"
  },
  "derivationPath": "m/44'/1815'/0'/0/0",
  "explorerUrls": {
    "mainnet": "https://cardanoscan.io/address/{address}"
  }
}
```

### README.md

```markdown
# Cardano Plugin

This plugin adds Cardano (ADA) support to BitPaper.

## Status

⚠️ **Work in Progress** - This plugin is not yet fully implemented.

## TODO

- [ ] Install required dependencies
- [ ] Implement `generateWallet()` method
- [ ] Implement `validateAddress()` method
- [ ] Test wallet generation in dry-run mode
- [ ] Test with real key generation (offline!)
- [ ] Update this README with implementation details

## Dependencies

[Instructions for installing dependencies]

## Implementation Guide

[Step-by-step guidance]

## Resources

[Links to blockchain documentation]
```

## Prompt Reference

| Prompt              | Description     | Validation                           | Example                                  |
| ------------------- | --------------- | ------------------------------------ | ---------------------------------------- |
| **Blockchain name** | Display name    | Must start with letter, alphanumeric | Cardano, Polkadot                        |
| **Token symbol**    | Currency symbol | 2-10 uppercase letters               | ADA, DOT, AVAX                           |
| **Unicode icon**    | Display icon    | Any character                        | ◈, ⬡, 🔷                                 |
| **Description**     | Brief summary   | Any text                             | Cardano wallet generation plugin         |
| **Author name**     | Your name       | Any text                             | John Doe                                 |
| **Explorer URL**    | Block explorer  | Valid HTTP/HTTPS URL                 | https://cardanoscan.io/address           |
| **Uses BIP44**      | HD wallet       | Yes/No                               | Yes                                      |
| **Derivation path** | BIP44 path      | Valid BIP44 format                   | m/44'/1815'/0'/0/0                       |
| **Dependencies**    | npm package     | Any text (optional)                  | @emurgo/cardano-serialization-lib-nodejs |

## Name Transformations

The generator automatically transforms your blockchain name:

| Input     | Case   | Used For                  | Example           |
| --------- | ------ | ------------------------- | ----------------- |
| "Cardano" | Pascal | Class names               | `CardanoProvider` |
| "Cardano" | Camel  | Variables                 | `cardanoProvider` |
| "Cardano" | Kebab  | File/directory names, IDs | `cardano`         |
| "ADA"     | Upper  | Token symbols             | `ADA`             |

## Customizing Templates

Templates are located in `plop-templates/`:

- `plugin-index.hbs` - TypeScript implementation
- `plugin-manifest.hbs` - JSON metadata
- `plugin-readme.hbs` - Documentation

You can customize these templates using [Handlebars](https://handlebarsjs.com/) syntax.

### Available Variables

- `{{name}}` - Original name input
- `{{symbol}}` - Token symbol
- `{{icon}}` - Unicode icon
- `{{description}}` - Description text
- `{{author}}` - Author name
- `{{explorerUrl}}` - Explorer URL
- `{{derivationPath}}` - BIP44 path (if provided)
- `{{dependencies}}` - npm package (if provided)

### Available Helpers

Plop provides built-in case transformation helpers:

- `{{pascalCase name}}` - PascalCase
- `{{camelCase name}}` - camelCase
- `{{kebabCase name}}` - kebab-case
- `{{snakeCase name}}` - snake_case
- `{{upperCase text}}` - UPPERCASE
- `{{lowerCase text}}` - lowercase

## Advanced Configuration

The generator configuration is in `plopfile.js`. You can customize:

### Add New Prompts

```javascript
prompts: [
  // ... existing prompts
  {
    type: "confirm",
    name: "supportsStaking",
    message: "Does this blockchain support staking?",
    default: false,
  },
];
```

### Add Custom Validation

```javascript
{
  type: 'input',
  name: 'tokenSupply',
  message: 'Total token supply:',
  validate: function(value) {
    if (isNaN(value)) {
      return 'Must be a number';
    }
    return true;
  }
}
```

### Add Custom Actions

```javascript
actions: [
  // ... existing actions
  {
    type: "add",
    path: "src/plugins/{{kebabCase name}}/utils.ts",
    templateFile: "plop-templates/utils.hbs",
  },
];
```

## Troubleshooting

### Plugin Already Exists

```
? Blockchain name: Cardano
❌ Plugin "cardano" already exists!
```

**Solution**: Choose a different name or delete the existing plugin directory.

### Invalid Derivation Path

```
? BIP44 derivation path: m/44/1815/0/0/0
❌ Invalid BIP44 path format. Example: m/44'/1815'/0'/0/0
```

**Solution**: Use the correct format with apostrophes for hardened keys: `m/44'/1815'/0'/0/0`

### Build Fails After Generation

```
error TS2345: Argument of type 'CardanoProvider' is not assignable to parameter
```

**Solution**: Run `yarn build` again. The first build after generation might fail due to TypeScript cache.

## Tips & Best Practices

### Choosing Icons

- Use single character Unicode symbols
- Avoid emojis that render differently across platforms
- Test in terminal to ensure it displays correctly
- Popular choices: ◈ ⬡ ◎ ♦ ▲ ● ◉

### Naming Conventions

- Use official blockchain name (e.g., "Cardano" not "ADA")
- Use official token symbol (check CoinMarketCap)
- Keep description under 80 characters
- Use consistent author format

### Explorer URLs

- Use the most popular explorer for the blockchain
- Prefer explorers that support direct address links
- Format: `https://explorer.com/address` (without trailing slash)
- Verify the URL actually works

### Derivation Paths

- Follow BIP44 standard: `m/44'/coin_type'/account'/change/index`
- Use registered coin types from [SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- Most chains use: `m/44'/coin_type'/0'/0/0`
- Some chains (like Cardano) have unique paths

## See Also

- [PLUGIN_DEVELOPMENT.md](./PLUGIN_DEVELOPMENT.md) - Complete development guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [PLUGIN_ARCHITECTURE.md](./PLUGIN_ARCHITECTURE.md) - Technical architecture
- [Plop Documentation](https://plopjs.com/documentation) - Template generator docs

## Support

Need help?

- 📖 Read the documentation
- 💬 Open a GitHub Discussion
- 🐛 Report issues on GitHub
- 📧 Email: yhauxell@gmail.com

Happy plugin development! 🚀
