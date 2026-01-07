/**
 * Zoho CRM Quote Tools
 * Tools for managing quotes in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatQuote } from '../utils/formatters.js';

export function registerQuoteTools(server: McpServer, client: CrmClient): void {
  // List Quotes
  server.tool(
    'zoho_list_quotes',
    'List quotes from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of quotes to return'),
      offset: z.number().optional().describe('Number of quotes to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listQuotes({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ quotes: result.items.map(formatQuote), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Quote
  server.tool(
    'zoho_get_quote',
    'Get a specific quote by ID from Zoho CRM',
    { id: z.string().describe('The quote ID') },
    async ({ id }) => {
      const quote = await client.getQuote(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatQuote(quote), null, 2) }] };
    }
  );

  // Create Quote
  server.tool(
    'zoho_create_quote',
    'Create a new quote in Zoho CRM',
    {
      subject: z.string().describe('Quote subject (required)'),
      dealId: z.string().optional().describe('Associated deal ID'),
      contactId: z.string().optional().describe('Associated contact ID'),
      accountId: z.string().optional().describe('Associated account ID'),
      validUntil: z.string().optional().describe('Valid until date (YYYY-MM-DD)'),
      quoteStage: z.string().optional().describe('Quote stage'),
      termsAndConditions: z.string().optional().describe('Terms and conditions'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const quote = await client.createQuote(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatQuote(quote), null, 2) }] };
    }
  );

  // Update Quote
  server.tool(
    'zoho_update_quote',
    'Update an existing quote in Zoho CRM',
    {
      id: z.string().describe('The quote ID'),
      subject: z.string().optional().describe('Quote subject'),
      dealId: z.string().optional().describe('Associated deal ID'),
      contactId: z.string().optional().describe('Associated contact ID'),
      accountId: z.string().optional().describe('Associated account ID'),
      validUntil: z.string().optional().describe('Valid until date'),
      quoteStage: z.string().optional().describe('Quote stage'),
      termsAndConditions: z.string().optional().describe('Terms and conditions'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const quote = await client.updateQuote(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatQuote(quote), null, 2) }] };
    }
  );

  // Delete Quote
  server.tool(
    'zoho_delete_quote',
    'Delete a quote from Zoho CRM',
    { id: z.string().describe('The quote ID to delete') },
    async ({ id }) => {
      await client.deleteQuote(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Quote ${id} deleted` }, null, 2) }] };
    }
  );

  // Search Quotes
  server.tool(
    'zoho_search_quotes',
    'Search for quotes in Zoho CRM',
    {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results'),
      offset: z.number().optional().describe('Number of results to skip'),
    },
    async ({ query, limit, offset }) => {
      const result = await client.searchQuotes({ query, limit, offset });
      return { content: [{ type: 'text' as const, text: JSON.stringify({ quotes: result.items.map(formatQuote), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }] };
    }
  );
}
