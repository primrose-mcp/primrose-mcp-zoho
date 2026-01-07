/**
 * Zoho CRM Campaign Tools
 * Tools for managing campaigns in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatCampaign } from '../utils/formatters.js';

export function registerCampaignTools(server: McpServer, client: CrmClient): void {
  // List Campaigns
  server.tool(
    'zoho_list_campaigns',
    'List campaigns from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of campaigns to return'),
      offset: z.number().optional().describe('Number of campaigns to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listCampaigns({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ campaigns: result.items.map(formatCampaign), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Campaign
  server.tool(
    'zoho_get_campaign',
    'Get a specific campaign by ID from Zoho CRM',
    { id: z.string().describe('The campaign ID') },
    async ({ id }) => {
      const campaign = await client.getCampaign(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatCampaign(campaign), null, 2) }] };
    }
  );

  // Create Campaign
  server.tool(
    'zoho_create_campaign',
    'Create a new campaign in Zoho CRM',
    {
      campaignName: z.string().describe('Campaign name (required)'),
      type: z.string().optional().describe('Campaign type'),
      status: z.string().optional().describe('Status'),
      startDate: z.string().optional().describe('Start date (YYYY-MM-DD)'),
      endDate: z.string().optional().describe('End date (YYYY-MM-DD)'),
      expectedRevenue: z.number().optional().describe('Expected revenue'),
      budgetedCost: z.number().optional().describe('Budgeted cost'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const campaign = await client.createCampaign(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatCampaign(campaign), null, 2) }] };
    }
  );

  // Update Campaign
  server.tool(
    'zoho_update_campaign',
    'Update an existing campaign in Zoho CRM',
    {
      id: z.string().describe('The campaign ID'),
      campaignName: z.string().optional().describe('Campaign name'),
      type: z.string().optional().describe('Campaign type'),
      status: z.string().optional().describe('Status'),
      startDate: z.string().optional().describe('Start date'),
      endDate: z.string().optional().describe('End date'),
      expectedRevenue: z.number().optional().describe('Expected revenue'),
      budgetedCost: z.number().optional().describe('Budgeted cost'),
      actualCost: z.number().optional().describe('Actual cost'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const campaign = await client.updateCampaign(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatCampaign(campaign), null, 2) }] };
    }
  );

  // Delete Campaign
  server.tool(
    'zoho_delete_campaign',
    'Delete a campaign from Zoho CRM',
    { id: z.string().describe('The campaign ID to delete') },
    async ({ id }) => {
      await client.deleteCampaign(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Campaign ${id} deleted` }, null, 2) }] };
    }
  );

  // Search Campaigns
  server.tool(
    'zoho_search_campaigns',
    'Search for campaigns in Zoho CRM',
    {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results'),
      offset: z.number().optional().describe('Number of results to skip'),
    },
    async ({ query, limit, offset }) => {
      const result = await client.searchCampaigns({ query, limit, offset });
      return { content: [{ type: 'text' as const, text: JSON.stringify({ campaigns: result.items.map(formatCampaign), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }] };
    }
  );
}
