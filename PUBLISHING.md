# Quick Publishing Guide

This is a quick reference for publishing updates to npm.

## First Time Setup

1. Create npm account: https://www.npmjs.com/signup
2. Login to npm:
   ```bash
   npm login
   ```

## Publishing Checklist

- [ ] Code is working and tested
- [ ] `yarn build` succeeds
- [ ] README is up to date
- [ ] All changes are committed to git
- [ ] Version is updated

## Quick Publish Commands

```bash
# 1. Build the project
yarn build

# 2. Test the package
yarn pack --dry-run

# 3. Update version (choose one)
yarn version --patch   # 1.0.0 -> 1.0.1 (bug fixes)
yarn version --minor   # 1.0.0 -> 1.1.0 (new features)
yarn version --major   # 1.0.0 -> 2.0.0 (breaking changes)

# 4. Publish to npm
yarn publish --access public

# 5. Push git tags
git push --follow-tags
```

## Verify Publication

```bash
# Check package on npm
npm view bitpaper

# Test global installation
npm install -g bitpaper
paper-wallet --help
```

## Common Issues

### "You must be logged in to publish packages"

```bash
npm login
```

### "You do not have permission to publish"

Make sure you're logged in with the correct npm account:

```bash
npm whoami
```

### "Package name too similar to existing package"

Consider using a scoped package name (already done: `bitpaper`)

### Need to fix a published version?

```bash
# If published within 72 hours, you can unpublish:
npm unpublish bitpaper@1.0.0

# Otherwise, deprecate and publish a new version:
npm deprecate bitpaper@1.0.0 "Please upgrade to 1.0.1"
yarn version --patch
yarn publish --access public
```

## Beta/Pre-release Versions

```bash
# Update to pre-release version
yarn version --prerelease --preid beta  # 1.0.0 -> 1.0.1-beta.0

# Publish with beta tag
npm publish --tag beta --access public

# Users install with:
npm install -g bitpaper@beta
```
