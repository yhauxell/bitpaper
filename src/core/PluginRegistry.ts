/**
 * Plugin Registry - Central system for managing blockchain plugins
 */

import * as fs from "fs";
import * as path from "path";
import { BlockchainProvider } from "./interfaces";

export class BlockchainPluginRegistry {
  private static instance: BlockchainPluginRegistry;
  private providers: Map<string, BlockchainProvider> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): BlockchainPluginRegistry {
    if (!BlockchainPluginRegistry.instance) {
      BlockchainPluginRegistry.instance = new BlockchainPluginRegistry();
    }
    return BlockchainPluginRegistry.instance;
  }

  /**
   * Register a blockchain provider
   */
  register(provider: BlockchainProvider): void {
    if (this.providers.has(provider.metadata.id)) {
      console.warn(
        `Provider with id "${provider.metadata.id}" is already registered. Overwriting.`
      );
    }
    this.providers.set(provider.metadata.id, provider);
  }

  /**
   * Get a provider by ID
   */
  get(id: string): BlockchainProvider | undefined {
    return this.providers.get(id);
  }

  /**
   * Get all registered providers
   */
  list(): BlockchainProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get all provider IDs
   */
  getIds(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if a provider is registered
   */
  has(id: string): boolean {
    return this.providers.has(id);
  }

  /**
   * Unregister a provider
   */
  unregister(id: string): boolean {
    return this.providers.delete(id);
  }

  /**
   * Clear all providers
   */
  clear(): void {
    this.providers.clear();
  }

  /**
   * Get providers by IDs (with filtering of invalid IDs)
   */
  getProviders(ids: string[]): BlockchainProvider[] {
    const providers: BlockchainProvider[] = [];
    for (const id of ids) {
      const provider = this.get(id);
      if (provider) {
        providers.push(provider);
      }
    }
    return providers;
  }

  /**
   * Load plugins from a directory
   */
  async loadPlugins(pluginDir: string): Promise<void> {
    try {
      const pluginPath = path.resolve(pluginDir);

      if (!fs.existsSync(pluginPath)) {
        console.warn(`Plugin directory not found: ${pluginPath}`);
        return;
      }

      const entries = fs.readdirSync(pluginPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith("_")) {
          await this.loadPlugin(path.join(pluginPath, entry.name));
        }
      }
    } catch (error) {
      console.error("Error loading plugins:", error);
    }
  }

  /**
   * Load a single plugin
   */
  private async loadPlugin(pluginPath: string): Promise<void> {
    try {
      const indexPath = path.join(pluginPath, "index");

      // Dynamic import
      const pluginModule = await import(indexPath);

      // The plugin should export a 'provider' or default export
      const provider =
        pluginModule.provider || pluginModule.default || pluginModule;

      if (this.isValidProvider(provider)) {
        this.register(provider);
      } else {
        console.warn(
          `Invalid plugin at ${pluginPath}: Does not implement BlockchainProvider interface`
        );
      }
    } catch (error) {
      console.error(`Error loading plugin from ${pluginPath}:`, error);
    }
  }

  /**
   * Validate if an object implements BlockchainProvider interface
   */
  private isValidProvider(obj: any): obj is BlockchainProvider {
    return (
      obj &&
      obj.metadata &&
      typeof obj.metadata.id === "string" &&
      typeof obj.metadata.name === "string" &&
      typeof obj.generateWallet === "function" &&
      typeof obj.getExplorerUrl === "function" &&
      typeof obj.formatWalletInfo === "function" &&
      typeof obj.validateAddress === "function"
    );
  }
}

/**
 * Get the global registry instance
 */
export function getRegistry(): BlockchainPluginRegistry {
  return BlockchainPluginRegistry.getInstance();
}
