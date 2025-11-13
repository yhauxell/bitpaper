/**
 * Plugin manifest structure for plugin.json files
 */

export interface PluginManifest {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  version: string;
  description: string;
  author: string;

  dependencies?: Record<string, string>;

  features?: {
    nativeSegwit?: boolean;
    multipleFormats?: boolean;
    testnet?: boolean;
    [key: string]: any;
  };

  derivationPath?: string;

  explorerUrls: {
    mainnet: string;
    testnet?: string;
  };

  // Custom plugin-specific configuration
  config?: Record<string, any>;
}
