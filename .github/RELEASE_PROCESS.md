# 📦 Release Process & Automated Changelog

This document explains how releases and changelogs are automatically generated for BitPaper.

## 🎯 Overview

BitPaper uses GitHub Actions to automatically:
- Generate changelogs from commit messages and PR labels
- Publish to npm with provenance
- Create GitHub releases with detailed notes
- Tag versions in git

## 🔄 How It Works

### 1. Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` - New feature → 🚀 Features section
- `fix:` - Bug fix → 🐛 Bug Fixes section
- `docs:` - Documentation → 📚 Documentation section
- `chore:`, `refactor:`, `test:` → 🧰 Maintenance section
- `perf:` - Performance → ⚡ Performance section
- `security:` - Security → 🔐 Security section

**Examples:**
```bash
feat: add Cardano (ADA) blockchain support
fix: correct Bitcoin address validation for bech32
docs: improve plugin development guide
chore: update dependencies
perf: optimize wallet generation speed
```

### 2. Pull Request Labels

When creating a PR, apply these labels for proper categorization:

| Label | Changelog Section |
|-------|-------------------|
| `feature`, `feat`, `enhancement` | 🚀 Features |
| `bug`, `fix`, `bugfix` | 🐛 Bug Fixes |
| `docs`, `documentation` | 📚 Documentation |
| `chore`, `refactor`, `test`, `style` | 🧰 Maintenance |
| `security` | 🔐 Security |
| `performance`, `perf` | ⚡ Performance |
| `ui`, `ux`, `design` | 🎨 UI/UX |
| `ignore-for-release` | _Excluded from changelog_ |

**Pro Tip:** The system automatically detects labels from commit messages, but manual labels provide more control.

### 3. Version Bumping

To release a new version:

```bash
# Patch release (0.0.10 → 0.0.11) - Bug fixes, small changes
npm version patch

# Minor release (0.0.10 → 0.1.0) - New features, backward compatible
npm version minor

# Major release (0.0.10 → 1.0.0) - Breaking changes
npm version major
```

**Important:** Just bump the version and push. The workflow handles everything else!

```bash
npm version patch -m "chore: bump version to %s"
git push origin main
```

### 4. Automatic Publishing

When you push to `main`, the GitHub Action:

1. ✅ Builds the project
2. ✅ Checks if version exists on npm
3. ✅ Generates changelog from commits & PRs
4. ✅ Creates a git tag
5. ✅ Publishes to npm with provenance
6. ✅ Creates a GitHub release with auto-generated notes

## 📝 Changelog Generation

### How Commits Are Categorized

The changelog builder:
1. Scans commits since the last release
2. Extracts type from conventional commit format
3. Groups by category
4. Includes PR links and author credits

### Example Output

```markdown
## 🚀 Features
- Add Cardano (ADA) blockchain support by @contributor in #123
- Add multi-wallet generation by @contributor in #124

## 🐛 Bug Fixes
- Fix Bitcoin address validation for bech32 by @maintainer in #125
- Correct QR code generation for long addresses by @contributor in #126

## 📚 Documentation
- Improve plugin development guide by @contributor in #127
- Add troubleshooting section to README by @maintainer in #128

**Full Changelog**: https://github.com/yhauxell/bitpaper/compare/v0.0.9...v0.0.10
```

## 🎯 Best Practices

### For Contributors

1. **Use conventional commit messages** - Helps with automatic categorization
   ```bash
   feat: add new blockchain support
   ```

2. **Apply appropriate PR labels** - Ensures proper changelog sections
   
3. **Write descriptive commit messages** - They become your changelog
   ```bash
   # Good
   feat: add Polkadot (DOT) with parachain support
   
   # Not so good
   feat: add stuff
   ```

4. **Reference issues/PRs** - Creates automatic links
   ```bash
   fix: correct address validation (fixes #123)
   ```

### For Maintainers

1. **Review PR labels** before merging
2. **Ensure version bump** is committed before release
3. **Check npm token** is valid (automation token, not publish token)
4. **Verify GitHub permissions** - `contents: write` and `id-token: write`

## 🔐 npm Authentication

### Token Requirements

- **Token Type:** Automation (not Publish)
- **Reason:** Automation tokens work in CI/CD without 2FA prompts
- **Secret Name:** `NPM_TOKEN` in GitHub repository secrets

### Creating an Automation Token

1. Go to [npmjs.com](https://www.npmjs.com/) → Access Tokens
2. Click **Generate New Token** → **Automation**
3. Copy the token
4. Add to GitHub: Settings → Secrets → Actions → `NPM_TOKEN`

## 🐛 Troubleshooting

### "Version already published"

- The version in `package.json` already exists on npm
- Bump the version: `npm version patch`

### "Authentication failed"

- Check npm token is valid
- Ensure it's an **Automation** token (not Publish)
- Verify secret name is exactly `NPM_TOKEN`

### "Permission denied" for tags

- Workflow needs `contents: write` permission
- Check `.github/workflows/publish.yml` has proper permissions

### Changelog is empty

- Ensure commits follow conventional format
- Check PR labels are applied correctly
- Verify there are commits since last release

## 📚 References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [npm Automation Tokens](https://docs.npmjs.com/about-authentication-tokens)

## 🎉 Example Release Flow

```bash
# 1. Make changes
git checkout -b feat/add-cardano
# ... make changes ...
git commit -m "feat: add Cardano (ADA) blockchain support"
git push origin feat/add-cardano

# 2. Create PR with labels: feature, blockchain

# 3. After PR is merged to main
git checkout main
git pull

# 4. Bump version
npm version minor  # 0.0.10 → 0.1.0

# 5. Push (triggers automatic release)
git push origin main

# 6. 🎉 Done! Check:
# - npm: https://www.npmjs.com/package/bitpaper
# - GitHub Releases: https://github.com/yhauxell/bitpaper/releases
```

---

**Questions?** Open an issue or check [CONTRIBUTING.md](../../CONTRIBUTING.md)

