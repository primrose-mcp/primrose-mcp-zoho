/**
 * Zoho CRM Metadata Tools
 * Tools for accessing CRM metadata (modules, fields, layouts, etc.)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';

export function registerMetadataTools(server: McpServer, client: CrmClient): void {
  // List Modules
  server.tool(
    'zoho_list_modules',
    'List all modules available in Zoho CRM',
    {},
    async () => {
      const modules = await client.listModules();
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ modules }, null, 2)
        }],
      };
    }
  );

  // Get Module Metadata
  server.tool(
    'zoho_get_module',
    'Get detailed metadata for a specific module in Zoho CRM',
    {
      module: z.string().describe('Module API name (e.g., Leads, Contacts, Accounts, Deals)'),
    },
    async ({ module }) => {
      const moduleInfo = await client.getModule(module);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(moduleInfo, null, 2)
        }],
      };
    }
  );

  // Get Module Fields
  server.tool(
    'zoho_get_fields',
    'Get all fields for a specific module in Zoho CRM',
    {
      module: z.string().describe('Module API name'),
    },
    async ({ module }) => {
      const fields = await client.listFields(module);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ fields }, null, 2)
        }],
      };
    }
  );

  // Get Layouts
  server.tool(
    'zoho_get_layouts',
    'Get all layouts for a specific module in Zoho CRM',
    {
      module: z.string().describe('Module API name'),
    },
    async ({ module }) => {
      const layouts = await client.listLayouts(module);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ layouts }, null, 2)
        }],
      };
    }
  );

  // Get Custom Views
  server.tool(
    'zoho_get_custom_views',
    'Get all custom views for a specific module in Zoho CRM',
    {
      module: z.string().describe('Module API name'),
    },
    async ({ module }) => {
      const customViews = await client.listCustomViews(module);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ customViews }, null, 2)
        }],
      };
    }
  );

  // Get Related Lists
  server.tool(
    'zoho_get_related_lists',
    'Get all related lists for a specific module in Zoho CRM',
    {
      module: z.string().describe('Module API name'),
    },
    async ({ module }) => {
      const relatedLists = await client.listRelatedLists(module);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ relatedLists }, null, 2)
        }],
      };
    }
  );
}
