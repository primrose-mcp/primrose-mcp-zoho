/**
 * Zoho CRM MCP Server - Main Entry Point
 *
 * This file sets up the MCP server using Cloudflare's Agents SDK.
 * It supports both stateless (McpServer) and stateful (McpAgent) modes.
 *
 * MULTI-TENANT ARCHITECTURE:
 * Tenant credentials are parsed from request headers,
 * allowing a single server deployment to serve multiple customers.
 *
 * Required Headers:
 * - X-CRM-Base-URL: Zoho API domain (e.g., 'https://www.zohoapis.com')
 * - X-CRM-Access-Token: OAuth access token (if using pre-obtained token)
 *
 * OR for OAuth refresh flow:
 * - X-CRM-Base-URL: Zoho API domain
 * - X-CRM-Client-ID: OAuth client ID
 * - X-CRM-Client-Secret: OAuth client secret
 * - X-CRM-Refresh-Token: OAuth refresh token
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { createCrmClient } from './client.js';
// Core CRM modules
import { registerActivityTools } from './tools/activities.js';
import { registerCompanyTools } from './tools/companies.js';
import { registerContactTools } from './tools/contacts.js';
import { registerDealTools } from './tools/deals.js';
// Extended CRM modules
import { registerLeadTools } from './tools/leads.js';
import { registerProductTools } from './tools/products.js';
import { registerQuoteTools } from './tools/quotes.js';
import { registerSalesOrderTools } from './tools/sales_orders.js';
import { registerPurchaseOrderTools } from './tools/purchase_orders.js';
import { registerInvoiceTools } from './tools/invoices.js';
import { registerVendorTools } from './tools/vendors.js';
import { registerPriceBookTools } from './tools/price_books.js';
import { registerCampaignTools } from './tools/campaigns.js';
import { registerCaseTools } from './tools/cases.js';
import { registerSolutionTools } from './tools/solutions.js';
import { registerEventTools } from './tools/events.js';
import { registerNoteTools } from './tools/notes.js';
import { registerAttachmentTools } from './tools/attachments.js';
// Advanced APIs
import { registerCoqlTools } from './tools/coql.js';
import { registerBulkTools } from './tools/bulk.js';
import { registerNotificationTools } from './tools/notifications.js';
import { registerRelatedRecordTools } from './tools/related_records.js';
import { registerMetadataTools } from './tools/metadata.js';
import { registerTagTools } from './tools/tags.js';
import { registerUserTools } from './tools/users.js';
import {
  type Env,
  type TenantCredentials,
  parseTenantCredentials,
  validateCredentials,
} from './types/env.js';

// =============================================================================
// MCP Server Configuration
// =============================================================================

const SERVER_NAME = 'primrose-mcp-zoho';
const SERVER_VERSION = '1.0.0';

// =============================================================================
// MCP Agent (Stateful - uses Durable Objects)
// =============================================================================

/**
 * McpAgent provides stateful MCP sessions backed by Durable Objects.
 *
 * NOTE: For multi-tenant deployments, use the stateless mode (Option 2) instead.
 * The stateful McpAgent is better suited for single-tenant deployments where
 * credentials can be stored as wrangler secrets.
 *
 * Use this when you need:
 * - Session state persistence
 * - Per-user rate limiting
 * - Cached API responses
 *
 * @deprecated For multi-tenant support, use stateless mode with per-request credentials
 */
export class CrmMcpAgent extends McpAgent<Env> {
  server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  async init() {
    // NOTE: Stateful mode requires credentials to be configured differently.
    // For multi-tenant, use the stateless endpoint at /mcp instead.
    throw new Error(
      'Stateful mode (McpAgent) is not supported for multi-tenant deployments. ' +
        'Use the stateless /mcp endpoint with X-CRM-API-Key header instead.'
    );
  }
}

// =============================================================================
// Stateless MCP Server (Recommended - no Durable Objects needed)
// =============================================================================

/**
 * Creates a stateless MCP server instance with tenant-specific credentials.
 *
 * MULTI-TENANT: Each request provides credentials via headers, allowing
 * a single server deployment to serve multiple tenants.
 *
 * @param credentials - Tenant credentials parsed from request headers
 */
function createStatelessServer(credentials: TenantCredentials): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Create client with tenant-specific credentials
  const client = createCrmClient(credentials);

  // Core CRM modules
  registerContactTools(server, client);
  registerCompanyTools(server, client);
  registerDealTools(server, client);
  registerActivityTools(server, client);

  // Extended CRM modules
  registerLeadTools(server, client);
  registerProductTools(server, client);
  registerQuoteTools(server, client);
  registerSalesOrderTools(server, client);
  registerPurchaseOrderTools(server, client);
  registerInvoiceTools(server, client);
  registerVendorTools(server, client);
  registerPriceBookTools(server, client);
  registerCampaignTools(server, client);
  registerCaseTools(server, client);
  registerSolutionTools(server, client);
  registerEventTools(server, client);
  registerNoteTools(server, client);
  registerAttachmentTools(server, client);

  // Advanced APIs
  registerCoqlTools(server, client);
  registerBulkTools(server, client);
  registerNotificationTools(server, client);
  registerRelatedRecordTools(server, client);
  registerMetadataTools(server, client);
  registerTagTools(server, client);
  registerUserTools(server, client);

  server.tool('zoho_test_connection', 'Test the connection to the Zoho CRM API', {}, async () => {
    try {
      const result = await client.testConnection();
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

// =============================================================================
// Worker Export
// =============================================================================

export default {
  /**
   * Main fetch handler for the Worker
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', server: SERVER_NAME }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ==========================================================================
    // Option 1: Stateful MCP with McpAgent (requires Durable Objects)
    // ==========================================================================
    // Uncomment to use McpAgent for stateful sessions:
    //
    // if (url.pathname === '/sse' || url.pathname === '/mcp') {
    //   return CrmMcpAgent.serveSSE('/sse').fetch(request, env, ctx);
    // }

    // ==========================================================================
    // Option 2: Stateless MCP with Streamable HTTP (Recommended for multi-tenant)
    // ==========================================================================
    if (url.pathname === '/mcp' && request.method === 'POST') {
      // Parse tenant credentials from request headers
      const credentials = parseTenantCredentials(request);

      // Validate credentials are present
      try {
        validateCredentials(credentials);
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Unauthorized',
            message: error instanceof Error ? error.message : 'Invalid credentials',
            required_headers: [
              'X-CRM-Base-URL',
              'X-CRM-Access-Token OR (X-CRM-Client-ID + X-CRM-Client-Secret + X-CRM-Refresh-Token)',
            ],
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Create server with tenant-specific credentials
      const server = createStatelessServer(credentials);

      // Import and use createMcpHandler for streamable HTTP
      // This is the recommended approach for stateless MCP servers
      const { createMcpHandler } = await import('agents/mcp');
      const handler = createMcpHandler(server);
      return handler(request, env, ctx);
    }

    // SSE endpoint for legacy clients
    if (url.pathname === '/sse') {
      // For SSE, we need to use McpAgent with serveSSE
      // Enable Durable Objects in wrangler.jsonc to use this
      return new Response('SSE endpoint requires Durable Objects. Enable in wrangler.jsonc.', {
        status: 501,
      });
    }

    // Default response
    return new Response(
      JSON.stringify({
        name: SERVER_NAME,
        version: SERVER_VERSION,
        description: 'Multi-tenant Zoho CRM MCP Server',
        endpoints: {
          mcp: '/mcp (POST) - Streamable HTTP MCP endpoint',
          health: '/health - Health check',
        },
        authentication: {
          description: 'Pass tenant credentials via request headers',
          option1: {
            description: 'Direct access token',
            required_headers: {
              'X-CRM-Base-URL':
                "Zoho API domain (e.g., 'https://www.zohoapis.com' or regional variant)",
              'X-CRM-Access-Token': 'OAuth access token',
            },
          },
          option2: {
            description: 'OAuth refresh flow',
            required_headers: {
              'X-CRM-Base-URL': 'Zoho API domain',
              'X-CRM-Client-ID': 'OAuth client ID',
              'X-CRM-Client-Secret': 'OAuth client secret',
              'X-CRM-Refresh-Token': 'OAuth refresh token',
            },
          },
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
