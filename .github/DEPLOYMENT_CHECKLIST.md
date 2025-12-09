# ✅ Deployment Checklist

Use this checklist to ensure everything is configured correctly for automated releases.

## 🔐 npm Configuration

- [ ] **Create Automation Token on npm**
  - Go to [npmjs.com](https://www.npmjs.com/) → Access Tokens
  - Click "Generate New Token" → Select **"Automation"** (not Publish!)
  - Copy the token (starts with `npm_...`)
- [ ] **Add Token to GitHub Secrets**

  - Go to https://github.com/yhauxell/bitpaper/settings/secrets/actions
  - Click "New repository secret" or update existing `NPM_TOKEN`
  - Name: `NPM_TOKEN`
  - Value: (paste your automation token)
  - Click "Add secret"

- [ ] **Verify Token Type**
  - ⚠️ Must be "Automation" token (not "Publish" or "Classic")
  - Automation tokens work in CI/CD without 2FA

## 🏷️ GitHub Labels

- [ ] **Sync Labels to Repository**
  - Option A: Push changes (automatic sync)
  - Option B: Manual trigger
    1. Go to https://github.com/yhauxell/bitpaper/actions
    2. Click "Sync Labels" workflow
    3. Click "Run workflow" button
    4. Verify labels appear at https://github.com/yhauxell/bitpaper/labels

## 📝 Commit Changes

- [ ] **Stage all new files**

  ```bash
  git add .github/ CHANGELOG.md package.json
  ```

- [ ] **Commit with conventional format**

  ```bash
  git commit -m "chore: add automated release workflow and changelog generation"
  ```

- [ ] **Push to main**
  ```bash
  git push origin main
  ```

## 🧪 Test the Workflow

- [ ] **Watch the workflow run**

  - Go to https://github.com/yhauxell/bitpaper/actions
  - Click on the latest "Build and Publish" workflow
  - Verify it completes (even if it skips publishing)

- [ ] **Test a release** (after workflow passes)

  ```bash
  # Bump version
  npm version patch -m "chore: bump version to %s"

  # Push (triggers release)
  git push origin main
  git push --tags
  ```

- [ ] **Verify the release**
  - [ ] Check npm: https://www.npmjs.com/package/bitpaper
  - [ ] Check GitHub Releases: https://github.com/yhauxell/bitpaper/releases
  - [ ] Verify provenance badge appears on npm
  - [ ] Check changelog is generated correctly

## 🔍 Verify Components

- [ ] **Workflow Files Exist**

  - [ ] `.github/workflows/publish.yml`
  - [ ] `.github/workflows/sync-labels.yml`
  - [ ] `.github/workflows/ci.yml` (existing)

- [ ] **Configuration Files Exist**

  - [ ] `.github/release.yml`
  - [ ] `.github/labels.yml`
  - [ ] `CHANGELOG.md`

- [ ] **Documentation Exists**

  - [ ] `.github/RELEASE_PROCESS.md`
  - [ ] `.github/PULL_REQUEST_TEMPLATE.md`
  - [ ] `.github/WORKFLOWS.md`
  - [ ] `.github/SETUP_SUMMARY.md`

- [ ] **Package.json Updated**
  - [ ] `CHANGELOG.md` included in `files` array

## 🎯 Workflow Permissions

- [ ] **Verify GitHub Permissions** (already configured)
  - [ ] `contents: write` - for creating tags
  - [ ] `id-token: write` - for npm provenance
  - Check in `.github/workflows/publish.yml` lines 13-14

## 📋 First Release Test

After everything is set up, do a test release:

```bash
# 1. Current state
git pull origin main

# 2. Bump version
npm version patch

# 3. Push and watch
git push origin main

# 4. Monitor
# - Watch GitHub Actions: https://github.com/yhauxell/bitpaper/actions
# - Should see: Build → Tag → Publish → Release
# - Check for errors in the workflow logs

# 5. Verify success
# - npm package updated: https://www.npmjs.com/package/bitpaper
# - GitHub release created: https://github.com/yhauxell/bitpaper/releases
# - Changelog generated correctly
# - Git tag created
```

## ⚠️ Common Issues

### Issue: "Authentication failed" on npm publish

**Solution:**

- Verify you created an **Automation** token (not Publish)
- Check secret name is exactly `NPM_TOKEN`
- Ensure token is active on npmjs.com

### Issue: "Version already published"

**Solution:**

- The version in package.json already exists on npm
- Bump version: `npm version patch`

### Issue: "Permission denied" creating tags

**Solution:**

- Already fixed! Workflow has `contents: write` permission

### Issue: Changelog is empty

**Solution:**

- Ensure you have commits since last release
- Use conventional commit format (`feat:`, `fix:`, etc.)
- Apply PR labels when merging

### Issue: Labels not syncing

**Solution:**

- Verify `.github/labels.yml` exists
- Manually trigger "Sync Labels" workflow
- Check workflow logs for errors

## 🎉 Success Criteria

Your setup is complete when:

- ✅ Workflow runs without errors
- ✅ Package publishes to npm automatically
- ✅ GitHub releases are created with changelogs
- ✅ Git tags are created automatically
- ✅ npm provenance badge appears
- ✅ Labels are synced to repository

## 📊 Maintenance

Regular checks:

- [ ] **Monthly:** Verify npm token hasn't expired
- [ ] **Before major releases:** Review CHANGELOG.md
- [ ] **After releases:** Verify release notes are accurate
- [ ] **Periodically:** Update workflow action versions

## 📞 Getting Help

If you encounter issues:

1. Check workflow logs: https://github.com/yhauxell/bitpaper/actions
2. Read troubleshooting: [RELEASE_PROCESS.md](./RELEASE_PROCESS.md)
3. Review npm token type (must be "Automation")
4. Open an issue with workflow logs attached

## 🔗 Quick Links

- 🏠 Repository: https://github.com/yhauxell/bitpaper
- 📦 npm Package: https://www.npmjs.com/package/bitpaper
- 🚀 GitHub Actions: https://github.com/yhauxell/bitpaper/actions
- 📝 Releases: https://github.com/yhauxell/bitpaper/releases
- 🔑 Secrets: https://github.com/yhauxell/bitpaper/settings/secrets/actions
- 🏷️ Labels: https://github.com/yhauxell/bitpaper/labels

---

**Ready to deploy?** Check off each item above, then do a test release! 🚀
