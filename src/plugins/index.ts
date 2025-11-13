/**
 * Plugin Auto-Registration
 * Automatically registers all built-in plugins
 */

import { getRegistry } from "../core/PluginRegistry";
// Import statements
import bitcoinProvider from "./bitcoin";
import chainlinkProvider from "./chainlink";
import ethereumProvider from "./ethereum";
import solanaProvider from "./solana";

/**
 * Register all built-in plugins
 */
export function registerBuiltInPlugins(): void {
  const registry = getRegistry();

  // Register all built-in blockchain providers
  registry.register(bitcoinProvider);
  registry.register(ethereumProvider);
  registry.register(solanaProvider);
  registry.register(chainlinkProvider);
}

// Export providers for direct access if needed
export { bitcoinProvider, chainlinkProvider, ethereumProvider, solanaProvider };
