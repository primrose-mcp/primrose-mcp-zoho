/**
 * Zoho CRM Vendor Tools
 * Tools for managing vendors in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatVendor } from '../utils/formatters.js';

export function registerVendorTools(server: McpServer, client: CrmClient): void {
  // List Vendors
  server.tool(
    'zoho_list_vendors',
    'List vendors from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of vendors to return'),
      offset: z.number().optional().describe('Number of vendors to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listVendors({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ vendors: result.items.map(formatVendor), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Vendor
  server.tool(
    'zoho_get_vendor',
    'Get a specific vendor by ID from Zoho CRM',
    { id: z.string().describe('The vendor ID') },
    async ({ id }) => {
      const vendor = await client.getVendor(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatVendor(vendor), null, 2) }] };
    }
  );

  // Create Vendor
  server.tool(
    'zoho_create_vendor',
    'Create a new vendor in Zoho CRM',
    {
      vendorName: z.string().describe('Vendor name (required)'),
      email: z.string().optional().describe('Email address'),
      phone: z.string().optional().describe('Phone number'),
      website: z.string().optional().describe('Website'),
      category: z.string().optional().describe('Category'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const vendor = await client.createVendor(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatVendor(vendor), null, 2) }] };
    }
  );

  // Update Vendor
  server.tool(
    'zoho_update_vendor',
    'Update an existing vendor in Zoho CRM',
    {
      id: z.string().describe('The vendor ID'),
      vendorName: z.string().optional().describe('Vendor name'),
      email: z.string().optional().describe('Email address'),
      phone: z.string().optional().describe('Phone number'),
      website: z.string().optional().describe('Website'),
      category: z.string().optional().describe('Category'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const vendor = await client.updateVendor(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatVendor(vendor), null, 2) }] };
    }
  );

  // Delete Vendor
  server.tool(
    'zoho_delete_vendor',
    'Delete a vendor from Zoho CRM',
    { id: z.string().describe('The vendor ID to delete') },
    async ({ id }) => {
      await client.deleteVendor(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Vendor ${id} deleted` }, null, 2) }] };
    }
  );

  // Search Vendors
  server.tool(
    'zoho_search_vendors',
    'Search for vendors in Zoho CRM',
    {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results'),
      offset: z.number().optional().describe('Number of results to skip'),
    },
    async ({ query, limit, offset }) => {
      const result = await client.searchVendors({ query, limit, offset });
      return { content: [{ type: 'text' as const, text: JSON.stringify({ vendors: result.items.map(formatVendor), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }] };
    }
  );
}
