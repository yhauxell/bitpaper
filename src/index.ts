#!/usr/bin/env node

/**
 * Paper Wallet Generator CLI
 *
 * A secure CLI tool to generate paper wallets for multiple cryptocurrencies:
 * - Bitcoin (BTC)
 * - Ethereum (ETH)
 * - Solana (SOL)
 * - Chainlink (LINK - uses Ethereum addresses)
 *
 * ⚠️ SECURITY WARNINGS:
 * 1. Run this script OFFLINE on a secure, air-gapped computer
 * 2. Never share or expose private keys or seed phrases
 * 3. Store paper wallets in a secure physical location
 * 4. This script is for educational/personal use only
 * 5. Always verify generated addresses before sending funds
 */

import chalk from "chalk";
import { Command } from "commander";
import * as crypto from "crypto";
import * as fs from "fs";
import inquirer from "inquirer";
import ora from "ora";
import { printSecurityWarnings, printUsageInstructions } from "./ui";
import {
  formatWalletSet,
  generateDummyWalletSet,
  generateWalletSet,
} from "./wallet-generator";

const program = new Command();

program
  .name("bitpaper")
  .description("Generate secure paper wallets for multiple cryptocurrencies")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate paper wallet(s)")
  .option("-c, --count <number>", "Number of wallet sets to generate", "1")
  .option("-o, --output <file>", "Save output to file")
  .option(
    "--currencies <list>",
    "Comma-separated list of currencies (bitcoin,ethereum,solana,chainlink)"
  )
  .option("--dry-run", "Show output format without generating real addresses")
  .option("--no-warnings", "Skip security warnings")
  .option("--no-instructions", "Skip usage instructions")
  .action(async (options) => {
    const count = parseInt(options.count, 10);

    if (isNaN(count) || count < 1) {
      console.error(chalk.red("❌ Error: Count must be a positive number"));
      process.exit(1);
    }

    // Handle currency selection
    let selectedCurrencies: string[] = [];

    if (options.currencies) {
      // Parse comma-separated list from command line
      selectedCurrencies = options.currencies
        .split(",")
        .map((c: string) => c.trim().toLowerCase())
        .filter((c: string) =>
          ["bitcoin", "ethereum", "solana", "chainlink"].includes(c)
        );

      if (selectedCurrencies.length === 0) {
        console.error(
          chalk.red(
            "❌ Error: No valid currencies specified. Use: bitcoin, ethereum, solana, chainlink"
          )
        );
        process.exit(1);
      }
    } else {
      // Interactive selection using inquirer
      const answers = await inquirer.prompt([
        {
          type: "checkbox",
          name: "currencies",
          message: "Select cryptocurrencies to generate:",
          choices: [
            {
              name: "₿  Bitcoin (BTC)",
              value: "bitcoin",
              checked: true,
            },
            {
              name: "♦  Ethereum (ETH)",
              value: "ethereum",
              checked: true,
            },
            {
              name: "◎  Solana (SOL)",
              value: "solana",
              checked: true,
            },
            {
              name: "🔗 Chainlink (LINK)",
              value: "chainlink",
              checked: true,
            },
          ],
          validate: (answer: string[]) => {
            if (answer.length < 1) {
              return "You must choose at least one cryptocurrency.";
            }
            return true;
          },
        },
      ]);

      selectedCurrencies = answers.currencies;
    }

    console.log("");
    console.log(
      chalk.cyan(
        `📝 Generating wallets for: ${selectedCurrencies
          .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
          .join(", ")}`
      )
    );
    console.log("");

    // Show dry-run notice
    if (options.dryRun) {
      console.log("");
      console.log(chalk.yellow.bold("🔍 DRY-RUN MODE"));
      console.log(
        chalk.yellow(
          "No real addresses are being generated. This is for demonstration only."
        )
      );
      console.log(
        chalk.yellow("⚠️  DO NOT send real funds to these addresses!")
      );
      console.log("");
    }

    if (options.warnings && !options.dryRun) {
      printSecurityWarnings();
    }

    // Skip entropy check in dry-run mode
    if (!options.dryRun) {
      // Verify cryptographic entropy is available
      try {
        crypto.randomBytes(32);
      } catch (error) {
        console.error(
          chalk.red("❌ Error: Insufficient entropy for secure key generation")
        );
        console.error(
          chalk.yellow(
            "Please ensure your system has adequate random number generation."
          )
        );
        process.exit(1);
      }
    }

    const spinner = ora({
      text: options.dryRun
        ? `Generating ${count} example wallet set(s)...`
        : `Generating ${count} wallet set(s)...`,
      color: "cyan",
    }).start();

    try {
      const outputs: string[] = [];

      for (let i = 1; i <= count; i++) {
        spinner.text = options.dryRun
          ? `Generating example wallet set ${i}/${count}...`
          : `Generating wallet set ${i}/${count}...`;
        const walletSet = options.dryRun
          ? generateDummyWalletSet(selectedCurrencies)
          : generateWalletSet(selectedCurrencies);
        const formatted = await formatWalletSet(walletSet, i);
        outputs.push(formatted);
      }

      spinner.succeed(
        options.dryRun
          ? chalk.yellow(`Generated ${count} example wallet set(s)!`)
          : chalk.green(`Generated ${count} wallet set(s)!`)
      );
      console.log("");

      // Display or save output
      if (options.output) {
        const content = outputs.join("\n");
        fs.writeFileSync(options.output, content, "utf-8");
        console.log(chalk.green(`✅ Wallets saved to: ${options.output}`));
        console.log("");
        if (!options.dryRun) {
          console.log(chalk.yellow("⚠️  Remember to:"));
          console.log(
            chalk.yellow("   1. Delete this file after printing/backing up")
          );
          console.log(
            chalk.yellow(
              "   2. Securely wipe the file (use shred or similar tools)"
            )
          );
          console.log(
            chalk.yellow(
              "   3. Never store unencrypted wallets on networked devices"
            )
          );
          console.log("");
        }
      } else {
        outputs.forEach((output) => console.log(output));
      }

      if (options.instructions && !options.dryRun) {
        printUsageInstructions();
      }

      if (options.dryRun) {
        console.log(chalk.yellow.bold("🔍 DRY-RUN MODE COMPLETE"));
        console.log(
          chalk.yellow(
            "These were example addresses only. No real keys generated."
          )
        );
        console.log(
          chalk.yellow("Remove --dry-run flag to generate real wallets.")
        );
        console.log("");
      } else {
        console.log(chalk.green("✅ Generation complete!"));
        console.log("");
      }
    } catch (error) {
      spinner.fail(chalk.red("Failed to generate wallets"));
      console.error(chalk.red("❌ Error:"), error);
      process.exit(1);
    }
  });

program
  .command("verify")
  .description("Verify a mnemonic phrase is valid")
  .argument("<mnemonic>", "The mnemonic phrase to verify (24 words)")
  .action((mnemonic) => {
    const { verifyMnemonic } = require("./wallet-generator");

    if (verifyMnemonic(mnemonic)) {
      console.log(chalk.green("✅ Valid mnemonic phrase"));
    } else {
      console.log(chalk.red("❌ Invalid mnemonic phrase"));
      process.exit(1);
    }
  });

program
  .command("info")
  .description("Show information about supported cryptocurrencies")
  .action(() => {
    console.log("");
    console.log(chalk.bold.cyan("📋 Supported Cryptocurrencies"));
    console.log(chalk.gray("=".repeat(80)));
    console.log("");

    console.log(chalk.bold("₿  Bitcoin (BTC)"));
    console.log("   Network: Mainnet");
    console.log("   Address Type: Native SegWit (P2WPKH)");
    console.log("   Derivation Path: m/44'/0'/0'/0/0");
    console.log("");

    console.log(chalk.bold("♦  Ethereum (ETH)"));
    console.log("   Network: Mainnet");
    console.log("   Compatible with: All ERC-20 tokens");
    console.log("   Derivation Path: m/44'/60'/0'/0/0");
    console.log("");

    console.log(chalk.bold("🔗 Chainlink (LINK)"));
    console.log("   Network: Ethereum (ERC-20 token)");
    console.log("   Uses Ethereum addresses");
    console.log("   Derivation Path: m/44'/60'/0'/0/0");
    console.log("");

    console.log(chalk.bold("◎  Solana (SOL)"));
    console.log("   Network: Mainnet-beta");
    console.log("   Key Generation: From first 32 bytes of seed");
    console.log("");

    console.log(chalk.gray("=".repeat(80)));
    console.log("");
    console.log(chalk.yellow("⚠️  Security Notice:"));
    console.log(
      chalk.yellow(
        "   Always run this tool OFFLINE on a secure, air-gapped computer"
      )
    );
    console.log("");
  });

// Default action if no command specified
program.action(() => {
  program.help();
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.help();
}
