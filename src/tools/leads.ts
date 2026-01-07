/**
 * Zoho CRM Lead Tools
 * Tools for managing leads in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatLead } from '../utils/formatters.js';

export function registerLeadTools(server: McpServer, client: CrmClient): void {
  // List Leads
  server.tool(
    'zoho_list_leads',
    'List leads from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of leads to return (default: 20, max: 200)'),
      offset: z.number().optional().describe('Number of leads to skip for pagination'),
    },
    async ({ limit, offset }) => {
      const result = await client.listLeads({ limit, offset });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                leads: result.items.map(formatLead),
                pagination: {
                  count: result.count,
                  total: result.total,
                  hasMore: result.hasMore,
                  nextCursor: result.nextCursor,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Get Lead
  server.tool(
    'zoho_get_lead',
    'Get a specific lead by ID from Zoho CRM',
    {
      id: z.string().describe('The lead ID'),
    },
    async ({ id }) => {
      const lead = await client.getLead(id);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(formatLead(lead), null, 2) }],
      };
    }
  );

  // Create Lead
  server.tool(
    'zoho_create_lead',
    'Create a new lead in Zoho CRM',
    {
      lastName: z.string().describe('Last name of the lead (required)'),
      firstName: z.string().optional().describe('First name of the lead'),
      email: z.string().optional().describe('Email address'),
      phone: z.string().optional().describe('Phone number'),
      company: z.string().optional().describe('Company name'),
      title: z.string().optional().describe('Job title'),
      website: z.string().optional().describe('Website URL'),
      industry: z.string().optional().describe('Industry'),
      leadSource: z.string().optional().describe('Lead source'),
      leadStatus: z.string().optional().describe('Lead status'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const lead = await client.createLead(input);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(formatLead(lead), null, 2) }],
      };
    }
  );

  // Update Lead
  server.tool(
    'zoho_update_lead',
    'Update an existing lead in Zoho CRM',
    {
      id: z.string().describe('The lead ID'),
      lastName: z.string().optional().describe('Last name'),
      firstName: z.string().optional().describe('First name'),
      email: z.string().optional().describe('Email address'),
      phone: z.string().optional().describe('Phone number'),
      company: z.string().optional().describe('Company name'),
      title: z.string().optional().describe('Job title'),
      website: z.string().optional().describe('Website URL'),
      industry: z.string().optional().describe('Industry'),
      leadSource: z.string().optional().describe('Lead source'),
      leadStatus: z.string().optional().describe('Lead status'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const lead = await client.updateLead(id, input);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(formatLead(lead), null, 2) }],
      };
    }
  );

  // Delete Lead
  server.tool(
    'zoho_delete_lead',
    'Delete a lead from Zoho CRM',
    {
      id: z.string().describe('The lead ID to delete'),
    },
    async ({ id }) => {
      await client.deleteLead(id);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Lead ${id} deleted` }, null, 2) }],
      };
    }
  );

  // Search Leads
  server.tool(
    'zoho_search_leads',
    'Search for leads in Zoho CRM',
    {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results'),
      offset: z.number().optional().describe('Number of results to skip'),
    },
    async ({ query, limit, offset }) => {
      const result = await client.searchLeads({ query, limit, offset });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                leads: result.items.map(formatLead),
                pagination: {
                  count: result.count,
                  total: result.total,
                  hasMore: result.hasMore,
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Convert Lead
  server.tool(
    'zoho_convert_lead',
    'Convert a lead to contact, account, and optionally a deal',
    {
      id: z.string().describe('The lead ID to convert'),
      dealName: z.string().optional().describe('Name for the new deal'),
      dealStage: z.string().optional().describe('Stage for the new deal'),
      dealClosingDate: z.string().optional().describe('Closing date for the deal (YYYY-MM-DD)'),
      dealAmount: z.number().optional().describe('Amount for the deal'),
      accountName: z.string().optional().describe('Name for the account'),
      contactLastName: z.string().optional().describe('Last name for the contact'),
      contactFirstName: z.string().optional().describe('First name for the contact'),
      carryOverTags: z.boolean().optional().describe('Carry over tags to new records'),
      notifyLeadOwner: z.boolean().optional().describe('Notify the lead owner'),
      notifyNewEntityOwner: z.boolean().optional().describe('Notify new entity owners'),
    },
    async ({ id, dealName, dealStage, dealClosingDate, dealAmount, accountName, contactLastName, contactFirstName, carryOverTags, notifyLeadOwner, notifyNewEntityOwner }) => {
      const input: {
        Deals?: { Deal_Name: string; Stage: string; Closing_Date: string; Amount?: number };
        Accounts?: { Account_Name?: string };
        Contacts?: { Last_Name?: string; First_Name?: string };
        carryOverTags?: boolean;
        notifyLeadOwner?: boolean;
        notifyNewEntityOwner?: boolean;
      } = {};

      if (dealName && dealStage && dealClosingDate) {
        input.Deals = { Deal_Name: dealName, Stage: dealStage, Closing_Date: dealClosingDate };
        if (dealAmount !== undefined) input.Deals.Amount = dealAmount;
      }
      if (accountName) input.Accounts = { Account_Name: accountName };
      if (contactLastName || contactFirstName) {
        input.Contacts = {};
        if (contactLastName) input.Contacts.Last_Name = contactLastName;
        if (contactFirstName) input.Contacts.First_Name = contactFirstName;
      }
      if (carryOverTags !== undefined) input.carryOverTags = carryOverTags;
      if (notifyLeadOwner !== undefined) input.notifyLeadOwner = notifyLeadOwner;
      if (notifyNewEntityOwner !== undefined) input.notifyNewEntityOwner = notifyNewEntityOwner;

      const result = await client.convertLead(id, input);
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
