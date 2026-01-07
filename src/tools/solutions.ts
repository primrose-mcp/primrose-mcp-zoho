/**
 * Zoho CRM Solution Tools
 * Tools for managing solutions in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatSolution } from '../utils/formatters.js';

export function registerSolutionTools(server: McpServer, client: CrmClient): void {
  // List Solutions
  server.tool(
    'zoho_list_solutions',
    'List solutions from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of solutions to return'),
      offset: z.number().optional().describe('Number of solutions to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listSolutions({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ solutions: result.items.map(formatSolution), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Solution
  server.tool(
    'zoho_get_solution',
    'Get a specific solution by ID from Zoho CRM',
    { id: z.string().describe('The solution ID') },
    async ({ id }) => {
      const solution = await client.getSolution(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatSolution(solution), null, 2) }] };
    }
  );

  // Create Solution
  server.tool(
    'zoho_create_solution',
    'Create a new solution in Zoho CRM',
    {
      solutionTitle: z.string().describe('Solution title (required)'),
      status: z.string().optional().describe('Status'),
      productId: z.string().optional().describe('Associated product ID'),
      question: z.string().optional().describe('Question'),
      answer: z.string().optional().describe('Answer'),
      addToKnowledgeBase: z.boolean().optional().describe('Add to knowledge base'),
    },
    async (input) => {
      const solution = await client.createSolution(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatSolution(solution), null, 2) }] };
    }
  );

  // Update Solution
  server.tool(
    'zoho_update_solution',
    'Update an existing solution in Zoho CRM',
    {
      id: z.string().describe('The solution ID'),
      solutionTitle: z.string().optional().describe('Solution title'),
      status: z.string().optional().describe('Status'),
      question: z.string().optional().describe('Question'),
      answer: z.string().optional().describe('Answer'),
      addToKnowledgeBase: z.boolean().optional().describe('Add to knowledge base'),
    },
    async ({ id, ...input }) => {
      const solution = await client.updateSolution(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatSolution(solution), null, 2) }] };
    }
  );

  // Delete Solution
  server.tool(
    'zoho_delete_solution',
    'Delete a solution from Zoho CRM',
    { id: z.string().describe('The solution ID to delete') },
    async ({ id }) => {
      await client.deleteSolution(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Solution ${id} deleted` }, null, 2) }] };
    }
  );

  // Search Solutions
  server.tool(
    'zoho_search_solutions',
    'Search for solutions in Zoho CRM',
    {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results'),
      offset: z.number().optional().describe('Number of results to skip'),
    },
    async ({ query, limit, offset }) => {
      const result = await client.searchSolutions({ query, limit, offset });
      return { content: [{ type: 'text' as const, text: JSON.stringify({ solutions: result.items.map(formatSolution), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }] };
    }
  );
}
