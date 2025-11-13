/**
 * UI Module
 * 
 * User interface elements for the CLI
 */

import chalk from 'chalk';

/**
 * Print security warnings
 */
export function printSecurityWarnings(): void {
  console.log('');
  console.log(chalk.bold.red('🔐 SECURITY WARNINGS'));
  console.log(chalk.gray('='.repeat(80)));
  console.log('');
  console.log(chalk.yellow('  ⚠️  Run this script OFFLINE on a secure, air-gapped computer'));
  console.log(chalk.yellow('  ⚠️  Never share private keys or seed phrases with anyone'));
  console.log(chalk.yellow('  ⚠️  Store paper wallets in a secure physical location (safe, vault)'));
  console.log(chalk.yellow('  ⚠️  Make backup copies and store in separate secure locations'));
  console.log(chalk.yellow('  ⚠️  Verify addresses before sending funds'));
  console.log(chalk.yellow('  ⚠️  Use at your own risk - this is for educational purposes'));
  console.log('');
  console.log(chalk.gray('='.repeat(80)));
  console.log('');
}

/**
 * Print usage instructions
 */
export function printUsageInstructions(): void {
  console.log('');
  console.log(chalk.bold.cyan('📖 USAGE INSTRUCTIONS'));
  console.log(chalk.gray('='.repeat(80)));
  console.log('');
  console.log(chalk.white('1. Seed Phrase: Write down the 24-word mnemonic phrase'));
  console.log(chalk.white('2. Addresses: Use these to RECEIVE funds'));
  console.log(chalk.white('3. Private Keys: Use these to SEND funds or import to wallets'));
  console.log(chalk.white('4. Store Securely: Keep multiple copies in separate secure locations'));
  console.log(chalk.white('5. Test First: Send small amounts first to verify addresses work'));
  console.log('');
  console.log(chalk.bold('To import wallets:'));
  console.log(chalk.white('  • Bitcoin: Use WIF or private key in any Bitcoin wallet'));
  console.log(chalk.white('  • Ethereum/LINK: Import private key in MetaMask or similar'));
  console.log(chalk.white('  • Solana: Import private key in Phantom or Solflare wallet'));
  console.log('');
  console.log(chalk.gray('='.repeat(80)));
  console.log('');
}

