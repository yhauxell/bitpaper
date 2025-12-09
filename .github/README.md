# 🤖 GitHub Automation

This folder contains GitHub-specific configuration for automated workflows, releases, and project management.

## 📁 Structure

```
.github/
├── workflows/
│   ├── ci.yml              # Continuous Integration
│   ├── publish.yml         # Automated npm publishing & releases
│   └── sync-labels.yml     # Automatic label synchronization
├── labels.yml              # Label definitions for issues/PRs
├── release.yml             # Release notes configuration
├── PULL_REQUEST_TEMPLATE.md
├── RELEASE_PROCESS.md      # Detailed release guide
└── README.md               # This file
```

## 🚀 Workflows

### 1. Build and Publish (`publish.yml`)

**Trigger:** Push to `main` branch

**What it does:**
- ✅ Builds the TypeScript project
- ✅ Checks if version exists on npm
- ✅ Generates changelog from commits & PR labels
- ✅ Creates git tags
- ✅ Publishes to npm with provenance
- ✅ Creates GitHub releases with auto-generated notes

**Requirements:**
- `NPM_TOKEN` secret (Automation token from npmjs.com)
- Version bump in `package.json`

### 2. Sync Labels (`sync-labels.yml`)

**Trigger:** Changes to `labels.yml` or manual dispatch

**What it does:**
- ✅ Syncs label definitions from `labels.yml` to GitHub
- ✅ Creates missing labels
- ✅ Updates existing labels (color, description)

### 3. CI (`ci.yml`)

**What it does:**
- ✅ Runs tests and linting
- ✅ Validates builds on PRs

## 🏷️ Labels System

Labels are automatically synced from `labels.yml` and used for:

1. **Changelog Generation** - Categorizes changes automatically
2. **Issue Management** - Organizes issues by type
3. **PR Automation** - Triggers specific workflows

### Key Labels

| Category | Labels | Use Case |
|----------|--------|----------|
| Features | `feature`, `feat`, `enhancement` | New functionality |
| Bugs | `bug`, `fix`, `bugfix` | Bug fixes |
| Docs | `docs`, `documentation` | Documentation updates |
| Maintenance | `chore`, `refactor`, `test` | Code maintenance |
| Security | `security` | Security improvements |
| Performance | `performance`, `perf` | Performance optimizations |

## 📝 Release Configuration

### `release.yml`

Configures GitHub's automatic release notes generation:
- Categorizes PRs by label
- Excludes internal changes (dependencies, etc.)
- Formats release notes professionally

### How Releases Work

1. **Developer** bumps version: `npm version patch`
2. **Developer** pushes to main: `git push`
3. **GitHub Actions** automatically:
   - Generates changelog from commits
   - Creates git tag
   - Publishes to npm
   - Creates GitHub release

## 🔐 Secrets Required

| Secret | Purpose | How to Get |
|--------|---------|------------|
| `NPM_TOKEN` | Publishing to npm | [npmjs.com](https://www.npmjs.com) → Access Tokens → **Automation** |
| `GITHUB_TOKEN` | Creating releases/tags | Automatically provided by GitHub |

## 📋 Templates

### Pull Request Template

Located at `PULL_REQUEST_TEMPLATE.md`, helps contributors:
- Describe changes clearly
- Select appropriate labels
- Follow commit conventions
- Complete testing checklist

## 📚 Documentation

- **[RELEASE_PROCESS.md](./RELEASE_PROCESS.md)** - Detailed release guide
- **[../CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
- **[../PLUGIN_DEVELOPMENT.md](../PLUGIN_DEVELOPMENT.md)** - Plugin development guide

## 🎯 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new blockchain support
fix: correct address validation
docs: improve README
chore: update dependencies
perf: optimize wallet generation
```

## 🔄 Changelog Generation

Changelogs are automatically generated from:

1. **Commit messages** - Parsed for conventional commit types
2. **PR labels** - Categorize changes
3. **PR descriptions** - Included in release notes
4. **Authors** - Credit contributors

### Example Output

```markdown
## 🚀 Features
- Add Cardano support by @contributor in #123

## 🐛 Bug Fixes  
- Fix Bitcoin validation by @maintainer in #124

**Full Changelog**: https://github.com/.../compare/v0.0.9...v0.0.10
```

## 🛠️ Maintenance

### Updating Labels

1. Edit `labels.yml`
2. Push to main
3. Labels sync automatically

### Updating Workflows

1. Edit workflow files in `workflows/`
2. Test with `workflow_dispatch` trigger
3. Monitor Actions tab for results

## ⚡ Quick Links

- [GitHub Actions](https://github.com/yhauxell/bitpaper/actions)
- [Releases](https://github.com/yhauxell/bitpaper/releases)
- [npm Package](https://www.npmjs.com/package/bitpaper)
- [Labels](https://github.com/yhauxell/bitpaper/labels)

---

**Need help?** Check [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) or open an issue!

