/**
 * Environment Bindings
 *
 * Type definitions for Cloudflare Worker environment variables and bindings.
 *
 * MULTI-TENANT ARCHITECTURE:
 * This server supports multiple tenants. Tenant-specific credentials are passed
 * via request headers, NOT stored in wrangler secrets. This allows a single
 * server instance to serve multiple customers.
 *
 * Request Headers (Option 1 - Direct Access Token):
 * - X-CRM-Base-URL: Zoho API domain (e.g., 'https://www.zohoapis.com')
 * - X-CRM-Access-Token: OAuth access token
 *
 * Request Headers (Option 2 - OAuth Refresh Flow):
 * - X-CRM-Base-URL: Zoho API domain
 * - X-CRM-Client-ID: OAuth client ID
 * - X-CRM-Client-Secret: OAuth client secret
 * - X-CRM-Refresh-Token: OAuth refresh token
 */

// =============================================================================
// Tenant Credentials (parsed from request headers)
// =============================================================================

export interface TenantCredentials {
  /** Zoho API base URL (from X-CRM-Base-URL header) */
  baseUrl?: string;

  /** OAuth Access Token (from X-CRM-Access-Token header) */
  accessToken?: string;

  /** OAuth Client ID (from X-CRM-Client-ID header) */
  clientId?: string;

  /** OAuth Client Secret (from X-CRM-Client-Secret header) */
  clientSecret?: string;

  /** OAuth Refresh Token (from X-CRM-Refresh-Token header) */
  refreshToken?: string;
}

/**
 * Parse tenant credentials from request headers
 */
export function parseTenantCredentials(request: Request): TenantCredentials {
  const headers = request.headers;

  return {
    baseUrl: headers.get('X-CRM-Base-URL') || undefined,
    accessToken: headers.get('X-CRM-Access-Token') || undefined,
    clientId: headers.get('X-CRM-Client-ID') || undefined,
    clientSecret: headers.get('X-CRM-Client-Secret') || undefined,
    refreshToken: headers.get('X-CRM-Refresh-Token') || undefined,
  };
}

/**
 * Validate that required credentials are present for Zoho CRM
 */
export function validateCredentials(credentials: TenantCredentials): void {
  // Option 1: Direct access token
  if (credentials.accessToken) {
    return;
  }

  // Option 2: OAuth refresh flow - need client ID, client secret, and refresh token
  if (credentials.clientId && credentials.clientSecret && credentials.refreshToken) {
    return;
  }

  throw new Error(
    'Missing credentials. Provide either X-CRM-Access-Token header, or all of X-CRM-Client-ID, X-CRM-Client-Secret, and X-CRM-Refresh-Token headers.'
  );
}

// =============================================================================
// Environment Configuration (from wrangler.jsonc vars and bindings)
// =============================================================================

export interface Env {
  // ===========================================================================
  // Environment Variables (from wrangler.jsonc vars)
  // ===========================================================================

  /** Maximum character limit for responses */
  CHARACTER_LIMIT: string;

  /** Default page size for list operations */
  DEFAULT_PAGE_SIZE: string;

  /** Maximum page size allowed */
  MAX_PAGE_SIZE: string;

  // ===========================================================================
  // Bindings
  // ===========================================================================

  /** KV namespace for OAuth token storage */
  OAUTH_KV?: KVNamespace;

  /** Durable Object namespace for MCP sessions */
  MCP_SESSIONS?: DurableObjectNamespace;

  /** Cloudflare AI binding (optional) */
  AI?: Ai;
}

// ===========================================================================
// Helper Functions
// ===========================================================================

/**
 * Get a numeric environment value with a default
 */
export function getEnvNumber(env: Env, key: keyof Env, defaultValue: number): number {
  const value = env[key];
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

/**
 * Get the character limit from environment
 */
export function getCharacterLimit(env: Env): number {
  return getEnvNumber(env, 'CHARACTER_LIMIT', 50000);
}

/**
 * Get the default page size from environment
 */
export function getDefaultPageSize(env: Env): number {
  return getEnvNumber(env, 'DEFAULT_PAGE_SIZE', 20);
}

/**
 * Get the maximum page size from environment
 */
export function getMaxPageSize(env: Env): number {
  return getEnvNumber(env, 'MAX_PAGE_SIZE', 100);
}
