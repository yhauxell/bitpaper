# Contributing to BitPaper

Thank you for your interest in contributing to BitPaper! 🎉

## Ways to Contribute

### 1. Add Support for New Blockchains 🔗

The easiest and most valuable contribution is adding support for new cryptocurrencies!

#### Quick Start

```bash
# Clone and setup
git clone https://github.com/yhauxell/bitpaper.git
cd bitpaper
yarn install

# Generate plugin scaffold
yarn generate:plugin

# Follow the prompts and implement the wallet generation logic
# See PLUGIN_DEVELOPMENT.md for detailed guidance
```

#### What We're Looking For

- Well-tested implementations
- Popular blockchains with active communities
- Clear documentation
- Proper error handling

#### Plugin Checklist

Before submitting a PR for a new blockchain:

- [ ] Used `yarn generate:plugin` or followed the template structure
- [ ] Implemented all required `BlockchainProvider` methods
- [ ] Added proper address validation
- [ ] Tested with `--dry-run` flag
- [ ] Tested with real key generation (offline!)
- [ ] Verified explorer links work
- [ ] Updated plugin README with blockchain-specific notes
- [ ] Used well-maintained, secure dependencies
- [ ] Added comments for complex blockchain-specific logic

### 2. Improve Documentation 📖

- Fix typos or unclear explanations
- Add examples or use cases
- Translate documentation
- Improve plugin templates

### 3. Report Bugs 🐛

Found a bug? Please open an issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version)
- **Never include private keys or seed phrases!**

### 4. Suggest Features 💡

Have an idea? Open an issue with:

- Clear description of the feature
- Use case and benefits
- Potential implementation approach

## Development Workflow

### Setup

```bash
git clone https://github.com/yhauxell/bitpaper.git
cd bitpaper
yarn install
yarn build
```

### Making Changes

1. **Fork the repository**

2. **Create a feature branch**

   ```bash
   git checkout -b feature/add-cardano-support
   ```

3. **Make your changes**

   - Follow existing code style
   - Add comments for complex logic
   - Update documentation

4. **Test your changes**

   ```bash
   yarn build

   # Test with dry-run
   bitpaper generate --dry-run --currencies your-blockchain

   # Test real generation (OFFLINE ONLY!)
   bitpaper generate --currencies your-blockchain
   ```

5. **Commit with clear messages**

   ```bash
   git add .
   git commit -m "feat: add Cardano (ADA) blockchain support"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/add-cardano-support
   ```

### Commit Message Convention

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

Examples:

- `feat: add Polkadot blockchain support`
- `fix: correct Bitcoin address validation`
- `docs: improve plugin development guide`

## Code Style

### TypeScript

- Use strict TypeScript
- Provide type annotations
- Avoid `any` types
- Use interfaces for plugin contracts

### Formatting

- Use 2 spaces for indentation
- Use double quotes for strings
- Add trailing commas
- Run formatter before committing

### Comments

- Explain **why**, not what
- Document complex blockchain-specific logic
- Add JSDoc for public methods
- Include references to blockchain specs

## Plugin Development Guidelines

### Security

1. **Never log sensitive data**

   - No private keys in console
   - No seed phrases in errors
   - Be careful with debug statements

2. **Validate inputs**

   - Check address formats
   - Validate derivation paths
   - Handle edge cases

3. **Use secure dependencies**
   - Only well-maintained packages
   - Check for known vulnerabilities
   - Keep dependencies minimal

### Testing

1. **Dry-run testing**

   ```bash
   bitpaper generate --dry-run --currencies your-blockchain
   ```

2. **Real generation (offline!)**

   - Disconnect from internet
   - Test on air-gapped machine
   - Verify addresses on blockchain explorers

3. **Address validation**
   - Test valid addresses
   - Test invalid addresses
   - Test edge cases

### Documentation

Each plugin should include:

1. **README.md** with:

   - Blockchain overview
   - Implementation notes
   - Special considerations
   - Testing instructions

2. **Code comments** for:
   - Complex derivation logic
   - Blockchain-specific quirks
   - Security considerations
   - External references

## Pull Request Process

### Before Submitting

- [ ] Code builds without errors
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Plugin tested in dry-run mode
- [ ] Plugin tested with real generation (offline)
- [ ] Commit messages follow convention
- [ ] No private keys or seeds in code/commits

### PR Description

Include:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] New blockchain support
- [ ] Bug fix
- [ ] Documentation update
- [ ] Other (describe)

## Blockchain Details (if applicable)

- Name: Cardano
- Symbol: ADA
- Derivation: BIP44 m/44'/1815'/0'/0/0
- Explorer: cardanoscan.io

## Testing

- [x] Tested with --dry-run
- [x] Tested with real generation (offline)
- [x] Verified addresses on explorer
- [x] Validated address format

## Additional Notes

Any blockchain-specific considerations
```

### Review Process

1. Maintainers will review your PR
2. Address any feedback
3. Once approved, PR will be merged
4. Your contribution will be in the next release!

## Getting Help

- 📖 Read [PLUGIN_DEVELOPMENT.md](./PLUGIN_DEVELOPMENT.md)
- 💬 Open a GitHub Discussion
- 🐛 Check existing Issues
- 📧 Email: yhauxell@gmail.com

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

## Recognition

Contributors will be:

- Listed in release notes
- Credited in README
- Thanked in the community!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making BitPaper better! 🚀**

Your contributions help people around the world secure their cryptocurrency assets.
