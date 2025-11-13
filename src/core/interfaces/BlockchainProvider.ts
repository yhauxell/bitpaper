/**
 * Core interface that all blockchain plugins must implement
 */

export interface WalletInfo {
  address: string;
  privateKey: string;
  publicKey: string;
  additionalData?: Record<string, any>;
}

export interface FormattedWallet {
  title: string;
  separator: string;
  lines: string[];
}

export interface GenerationContext {
  seed: Buffer;
  mnemonic: string;
  isDryRun: boolean;
  timestamp: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface PluginMetadata {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  version: string;
  description?: string;
  author?: string;
  derivationPath?: string;
}

/**
 * Main interface that all blockchain providers must implement
 */
export interface BlockchainProvider {
  // Metadata
  readonly metadata: PluginMetadata;

  // Core wallet generation
  generateWallet(seed: Buffer): Promise<WalletInfo> | WalletInfo;

  // Display and formatting
  getExplorerUrl(address: string): string;
  formatWalletInfo(wallet: WalletInfo): Promise<string[]> | string[];

  // Validation
  validateAddress(address: string): boolean;

  // Optional features
  supportsTestnet?: boolean;
  getTestnetExplorerUrl?(address: string): string;

  // Lifecycle hooks (optional)
  onBeforeGenerate?(context: GenerationContext): Promise<void> | void;
  onAfterGenerate?(
    wallet: WalletInfo,
    context: GenerationContext
  ): Promise<void> | void;
}

/**
 * Extended interface for providers that support multiple address formats
 */
export interface MultiFormatProvider extends BlockchainProvider {
  supportsMultipleFormats: true;
  getAlternativeFormats(wallet: WalletInfo): Record<string, string>;
}
