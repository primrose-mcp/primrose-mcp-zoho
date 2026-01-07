/**
 * Zoho CRM Case Tools
 * Tools for managing support cases in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatCase } from '../utils/formatters.js';

export function registerCaseTools(server: McpServer, client: CrmClient): void {
  // List Cases
  server.tool(
    'zoho_list_cases',
    'List support cases from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of cases to return'),
      offset: z.number().optional().describe('Number of cases to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listCases({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ cases: result.items.map(formatCase), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Case
  server.tool(
    'zoho_get_case',
    'Get a specific case by ID from Zoho CRM',
    { id: z.string().describe('The case ID') },
    async ({ id }) => {
      const c = await client.getCase(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatCase(c), null, 2) }] };
    }
  );

  // Create Case
  server.tool(
    'zoho_create_case',
    'Create a new support case in Zoho CRM',
    {
      subject: z.string().describe('Case subject (required)'),
      status: z.string().optional().describe('Status'),
      type: z.string().optional().describe('Case type'),
      priority: z.string().optional().describe('Priority'),
      origin: z.string().optional().describe('Case origin'),
      accountId: z.string().optional().describe('Associated account ID'),
      contactId: z.string().optional().describe('Associated contact ID'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const c = await client.createCase(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatCase(c), null, 2) }] };
    }
  );

  // Update Case
  server.tool(
    'zoho_update_case',
    'Update an existing case in Zoho CRM',
    {
      id: z.string().describe('The case ID'),
      subject: z.string().optional().describe('Case subject'),
      status: z.string().optional().describe('Status'),
      type: z.string().optional().describe('Case type'),
      priority: z.string().optional().describe('Priority'),
      origin: z.string().optional().describe('Case origin'),
      solution: z.string().optional().describe('Solution'),
      internalComments: z.string().optional().describe('Internal comments'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const c = await client.updateCase(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatCase(c), null, 2) }] };
    }
  );

  // Delete Case
  server.tool(
    'zoho_delete_case',
    'Delete a case from Zoho CRM',
    { id: z.string().describe('The case ID to delete') },
    async ({ id }) => {
      await client.deleteCase(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Case ${id} deleted` }, null, 2) }] };
    }
  );

  // Search Cases
  server.tool(
    'zoho_search_cases',
    'Search for cases in Zoho CRM',
    {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results'),
      offset: z.number().optional().describe('Number of results to skip'),
    },
    async ({ query, limit, offset }) => {
      const result = await client.searchCases({ query, limit, offset });
      return { content: [{ type: 'text' as const, text: JSON.stringify({ cases: result.items.map(formatCase), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }] };
    }
  );
}
