# GitHub Actions Setup Guide

This project uses GitHub Actions to automatically publish to npm when code is merged to main.

## 📋 Setup Instructions

### Step 1: Create npm Access Token

1. Login to npm: https://www.npmjs.com/
2. Click your profile icon → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select type: **Automation**
5. Copy the token (you won't see it again!)

### Step 2: Add Token to GitHub Secrets

1. Go to your repository: https://github.com/yhauxell/bitpaper
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

### Step 3: Test the Workflow

1. Update the version in `package.json`:

   ```bash
   yarn version --patch
   ```

2. Commit and push:

   ```bash
   git add package.json
   git commit -m "Bump version to X.X.X"
   git push origin main
   ```

3. Check the Actions tab on GitHub to see the workflow run!

## 🔄 How It Works

### Build and Publish Workflow (`publish.yml`)

**Triggers when:**

- Code is pushed/merged to `main` branch
- Files in `package.json`, `src/`, `bin/`, or `yarn.lock` change

**What it does:**

1. ✅ Installs dependencies
2. ✅ Builds the project (ALWAYS runs for validation)
3. ✅ Checks if version number changed
4. ✅ Publishes to npm (only if version changed)
5. ✅ Creates a git tag (only if version changed, e.g., `v1.0.0`)

**Publishing behavior:**

- Build ALWAYS runs to validate code on main branch
- Publishing only happens when version changes
- No redundant workflow runs with CI

### CI Workflow (`ci.yml`)

**Triggers when:**

- Pull requests to `main` (NOT on direct pushes to main)

**What it does:**

1. ✅ Checks out code
2. ✅ Installs dependencies
3. ✅ Builds the project
4. ✅ Verifies build output

**Why separate?**

- CI validates PRs before merge
- Build & Publish validates and publishes on main
- No redundant workflow runs!

## 📦 Publishing Workflow

### Option 1: Manual Version Bump (Recommended)

```bash
# For bug fixes (1.0.0 -> 1.0.1)
yarn version --patch

# For new features (1.0.0 -> 1.1.0)
yarn version --minor

# For breaking changes (1.0.0 -> 2.0.0)
yarn version --major

# Push to trigger publish
git push --follow-tags
```

### Option 2: Manual Edit

1. Edit version in `package.json`
2. Commit and push to `main`
3. GitHub Actions will automatically publish

## 🔍 Monitoring

- **Actions tab**: https://github.com/yhauxell/bitpaper/actions
- **npm package**: https://www.npmjs.com/package/bitpaper

## ⚠️ Troubleshooting

### "Invalid or missing token"

- Check that `NPM_TOKEN` secret is set correctly
- Verify token hasn't expired
- Regenerate token if needed

### "You cannot publish over the previously published versions"

- Make sure you bumped the version number in `package.json`
- Check current version: `npm view bitpaper version`

### Workflow doesn't trigger

- Ensure changes are in `package.json`, `src/`, or `bin/`
- Check Actions tab for any errors
- Verify branch name is exactly `main`

## 🛡️ Security Notes

- ✅ NPM_TOKEN is stored securely in GitHub Secrets
- ✅ Token is never exposed in logs
- ✅ Only runs on your repository
- ✅ Requires push access to main branch
