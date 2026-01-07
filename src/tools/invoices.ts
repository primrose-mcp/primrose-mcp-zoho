/**
 * Zoho CRM Invoice Tools
 * Tools for managing invoices in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatInvoice } from '../utils/formatters.js';

export function registerInvoiceTools(server: McpServer, client: CrmClient): void {
  // List Invoices
  server.tool(
    'zoho_list_invoices',
    'List invoices from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of invoices to return'),
      offset: z.number().optional().describe('Number of invoices to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listInvoices({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ invoices: result.items.map(formatInvoice), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Invoice
  server.tool(
    'zoho_get_invoice',
    'Get a specific invoice by ID from Zoho CRM',
    { id: z.string().describe('The invoice ID') },
    async ({ id }) => {
      const invoice = await client.getInvoice(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatInvoice(invoice), null, 2) }] };
    }
  );

  // Create Invoice
  server.tool(
    'zoho_create_invoice',
    'Create a new invoice in Zoho CRM',
    {
      subject: z.string().describe('Invoice subject (required)'),
      salesOrderId: z.string().optional().describe('Associated sales order ID'),
      dealId: z.string().optional().describe('Associated deal ID'),
      contactId: z.string().optional().describe('Associated contact ID'),
      accountId: z.string().optional().describe('Associated account ID'),
      status: z.string().optional().describe('Status'),
      invoiceDate: z.string().optional().describe('Invoice date (YYYY-MM-DD)'),
      dueDate: z.string().optional().describe('Due date (YYYY-MM-DD)'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const invoice = await client.createInvoice(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatInvoice(invoice), null, 2) }] };
    }
  );

  // Update Invoice
  server.tool(
    'zoho_update_invoice',
    'Update an existing invoice in Zoho CRM',
    {
      id: z.string().describe('The invoice ID'),
      subject: z.string().optional().describe('Invoice subject'),
      status: z.string().optional().describe('Status'),
      invoiceDate: z.string().optional().describe('Invoice date'),
      dueDate: z.string().optional().describe('Due date'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const invoice = await client.updateInvoice(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatInvoice(invoice), null, 2) }] };
    }
  );

  // Delete Invoice
  server.tool(
    'zoho_delete_invoice',
    'Delete an invoice from Zoho CRM',
    { id: z.string().describe('The invoice ID to delete') },
    async ({ id }) => {
      await client.deleteInvoice(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Invoice ${id} deleted` }, null, 2) }] };
    }
  );

  // Search Invoices
  server.tool(
    'zoho_search_invoices',
    'Search for invoices in Zoho CRM',
    {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results'),
      offset: z.number().optional().describe('Number of results to skip'),
    },
    async ({ query, limit, offset }) => {
      const result = await client.searchInvoices({ query, limit, offset });
      return { content: [{ type: 'text' as const, text: JSON.stringify({ invoices: result.items.map(formatInvoice), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }] };
    }
  );
}
