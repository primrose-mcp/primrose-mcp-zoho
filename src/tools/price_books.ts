/**
 * Zoho CRM Price Book Tools
 * Tools for managing price books in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatPriceBook } from '../utils/formatters.js';

export function registerPriceBookTools(server: McpServer, client: CrmClient): void {
  // List Price Books
  server.tool(
    'zoho_list_price_books',
    'List price books from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of price books to return'),
      offset: z.number().optional().describe('Number of price books to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listPriceBooks({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ priceBooks: result.items.map(formatPriceBook), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Price Book
  server.tool(
    'zoho_get_price_book',
    'Get a specific price book by ID from Zoho CRM',
    { id: z.string().describe('The price book ID') },
    async ({ id }) => {
      const pb = await client.getPriceBook(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatPriceBook(pb), null, 2) }] };
    }
  );

  // Create Price Book
  server.tool(
    'zoho_create_price_book',
    'Create a new price book in Zoho CRM',
    {
      priceBookName: z.string().describe('Price book name (required)'),
      pricingModel: z.enum(['Flat', 'Differential']).optional().describe('Pricing model'),
      active: z.boolean().optional().describe('Is active'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const pb = await client.createPriceBook(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatPriceBook(pb), null, 2) }] };
    }
  );

  // Update Price Book
  server.tool(
    'zoho_update_price_book',
    'Update an existing price book in Zoho CRM',
    {
      id: z.string().describe('The price book ID'),
      priceBookName: z.string().optional().describe('Price book name'),
      pricingModel: z.enum(['Flat', 'Differential']).optional().describe('Pricing model'),
      active: z.boolean().optional().describe('Is active'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const pb = await client.updatePriceBook(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatPriceBook(pb), null, 2) }] };
    }
  );

  // Delete Price Book
  server.tool(
    'zoho_delete_price_book',
    'Delete a price book from Zoho CRM',
    { id: z.string().describe('The price book ID to delete') },
    async ({ id }) => {
      await client.deletePriceBook(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Price book ${id} deleted` }, null, 2) }] };
    }
  );
}
