/**
 * Plop Configuration for BitPaper Plugin Generator
 *
 * This file configures the plugin generator for creating new blockchain plugins.
 *
 * Usage: yarn generate:plugin
 */

module.exports = function (plop) {
  // Helper to validate plugin name
  plop.setHelper("validateName", function (text) {
    if (!text || text.trim().length === 0) {
      return "Plugin name is required";
    }
    if (!/^[a-zA-Z][a-zA-Z0-9\s-]*$/.test(text)) {
      return "Plugin name must start with a letter and contain only letters, numbers, spaces, and hyphens";
    }
    return true;
  });

  // Define the plugin generator
  plop.setGenerator("plugin", {
    description: "Generate a new blockchain plugin",

    prompts: [
      {
        type: "input",
        name: "name",
        message: "Blockchain name (e.g., Cardano, Polkadot):",
        validate: function (value) {
          if (!value || value.trim().length === 0) {
            return "Blockchain name is required";
          }
          if (!/^[a-zA-Z][a-zA-Z0-9\s-]*$/.test(value)) {
            return "Name must start with a letter and contain only letters, numbers, spaces, and hyphens";
          }
          // Check if plugin already exists
          const fs = require("fs");
          const path = require("path");
          const kebabName = value.toLowerCase().replace(/\s+/g, "-");
          const pluginPath = path.join(__dirname, "src", "plugins", kebabName);
          if (fs.existsSync(pluginPath)) {
            return `Plugin "${kebabName}" already exists!`;
          }
          return true;
        },
      },
      {
        type: "input",
        name: "symbol",
        message: "Token symbol (e.g., ADA, DOT):",
        validate: function (value) {
          if (!value || value.trim().length === 0) {
            return "Token symbol is required";
          }
          if (!/^[A-Z]{2,10}$/.test(value.toUpperCase())) {
            return "Symbol should be 2-10 uppercase letters";
          }
          return true;
        },
        filter: function (value) {
          return value.toUpperCase();
        },
      },
      {
        type: "input",
        name: "icon",
        message: "Unicode icon (e.g., ◈, ⬡, 🔷):",
        default: "🔷",
        validate: function (value) {
          if (!value || value.trim().length === 0) {
            return "Icon is required";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "Brief description:",
        default: function (answers) {
          return `${answers.name} wallet generation plugin`;
        },
      },
      {
        type: "input",
        name: "author",
        message: "Author name:",
        default: "BitPaper Community",
      },
      {
        type: "input",
        name: "explorerUrl",
        message:
          "Block explorer base URL (e.g., https://cardanoscan.io/address):",
        validate: function (value) {
          if (!value || value.trim().length === 0) {
            return "Explorer URL is required";
          }
          if (!/^https?:\/\/.+/.test(value)) {
            return "Must be a valid HTTP/HTTPS URL";
          }
          return true;
        },
      },
      {
        type: "confirm",
        name: "usesBip44",
        message: "Does this blockchain use BIP44 derivation?",
        default: true,
      },
      {
        type: "input",
        name: "derivationPath",
        message: "BIP44 derivation path (e.g., m/44'/1815'/0'/0/0):",
        when: function (answers) {
          return answers.usesBip44;
        },
        default: "m/44'/0'/0'/0/0",
        validate: function (value) {
          if (!value || value.trim().length === 0) {
            return "Derivation path is required for BIP44 chains";
          }
          if (!/^m\/\d+'?(\/\d+'?)*$/.test(value)) {
            return "Invalid BIP44 path format. Example: m/44'/1815'/0'/0/0";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "dependencies",
        message: "Main npm package for this blockchain (optional):",
        default: "",
      },
    ],

    actions: function (data) {
      const actions = [];

      // Generate index.ts
      actions.push({
        type: "add",
        path: "src/plugins/{{kebabCase name}}/index.ts",
        templateFile: "plop-templates/plugin-index.hbs",
      });

      // Generate plugin.json
      actions.push({
        type: "add",
        path: "src/plugins/{{kebabCase name}}/plugin.json",
        templateFile: "plop-templates/plugin-manifest.hbs",
      });

      // Generate README.md
      actions.push({
        type: "add",
        path: "src/plugins/{{kebabCase name}}/README.md",
        templateFile: "plop-templates/plugin-readme.hbs",
      });

      // Instructions for next steps
      actions.push({
        type: "append",
        path: "src/plugins/index.ts",
        pattern: /(\/\/ Import statements)/gi,
        template:
          'import {{camelCase name}}Provider from "./{{kebabCase name}}";',
      });

      actions.push({
        type: "append",
        path: "src/plugins/index.ts",
        pattern: /(registry\.register\(chainlinkProvider\);)/gi,
        template: "  registry.register({{camelCase name}}Provider);",
      });

      actions.push({
        type: "append",
        path: "src/plugins/index.ts",
        pattern: /(export \{[^}]*)/gi,
        template: ",\n  {{camelCase name}}Provider",
      });

      // Custom action to display next steps
      actions.push(function (answers) {
        const chalk = require("chalk");
        console.log("\n");
        console.log(chalk.green("✅ Plugin scaffolded successfully!"));
        console.log("\n");
        console.log(chalk.cyan.bold("📁 Files created:"));
        console.log(
          `   • src/plugins/${answers.name
            .toLowerCase()
            .replace(/\s+/g, "-")}/index.ts`
        );
        console.log(
          `   • src/plugins/${answers.name
            .toLowerCase()
            .replace(/\s+/g, "-")}/plugin.json`
        );
        console.log(
          `   • src/plugins/${answers.name
            .toLowerCase()
            .replace(/\s+/g, "-")}/README.md`
        );
        console.log(`   • Updated src/plugins/index.ts`);
        console.log("\n");
        console.log(chalk.yellow.bold("⚠️  Next Steps:"));
        console.log(chalk.yellow("1. Install dependencies (if needed):"));
        if (answers.dependencies) {
          console.log(chalk.gray(`   yarn add ${answers.dependencies}`));
        }
        console.log(
          chalk.yellow("\n2. Implement the wallet generation logic:")
        );
        console.log(
          chalk.gray(
            `   • Edit src/plugins/${answers.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/index.ts`
          )
        );
        console.log(chalk.gray("   • Implement generateWallet() method"));
        console.log(chalk.gray("   • Implement validateAddress() method"));
        console.log(chalk.yellow("\n3. Build and test:"));
        console.log(chalk.gray("   yarn build"));
        console.log(
          chalk.gray(
            `   bitpaper generate --dry-run --currencies ${answers.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`
          )
        );
        console.log(
          chalk.yellow("\n4. See the plugin README for more details:")
        );
        console.log(
          chalk.gray(
            `   cat src/plugins/${answers.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/README.md`
          )
        );
        console.log("\n");
        console.log(chalk.cyan("📖 Full documentation: PLUGIN_DEVELOPMENT.md"));
        console.log("\n");

        return "Plugin generation complete!";
      });

      return actions;
    },
  });
};
