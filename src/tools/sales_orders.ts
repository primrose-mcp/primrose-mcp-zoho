/**
 * Zoho CRM Sales Order Tools
 * Tools for managing sales orders in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatSalesOrder } from '../utils/formatters.js';

export function registerSalesOrderTools(server: McpServer, client: CrmClient): void {
  // List Sales Orders
  server.tool(
    'zoho_list_sales_orders',
    'List sales orders from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of sales orders to return'),
      offset: z.number().optional().describe('Number of sales orders to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listSalesOrders({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ salesOrders: result.items.map(formatSalesOrder), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Sales Order
  server.tool(
    'zoho_get_sales_order',
    'Get a specific sales order by ID from Zoho CRM',
    { id: z.string().describe('The sales order ID') },
    async ({ id }) => {
      const so = await client.getSalesOrder(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatSalesOrder(so), null, 2) }] };
    }
  );

  // Create Sales Order
  server.tool(
    'zoho_create_sales_order',
    'Create a new sales order in Zoho CRM',
    {
      subject: z.string().describe('Sales order subject (required)'),
      dealId: z.string().optional().describe('Associated deal ID'),
      contactId: z.string().optional().describe('Associated contact ID'),
      accountId: z.string().optional().describe('Associated account ID'),
      quoteId: z.string().optional().describe('Associated quote ID'),
      status: z.string().optional().describe('Status'),
      dueDate: z.string().optional().describe('Due date (YYYY-MM-DD)'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const so = await client.createSalesOrder(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatSalesOrder(so), null, 2) }] };
    }
  );

  // Update Sales Order
  server.tool(
    'zoho_update_sales_order',
    'Update an existing sales order in Zoho CRM',
    {
      id: z.string().describe('The sales order ID'),
      subject: z.string().optional().describe('Sales order subject'),
      status: z.string().optional().describe('Status'),
      dueDate: z.string().optional().describe('Due date'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const so = await client.updateSalesOrder(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatSalesOrder(so), null, 2) }] };
    }
  );

  // Delete Sales Order
  server.tool(
    'zoho_delete_sales_order',
    'Delete a sales order from Zoho CRM',
    { id: z.string().describe('The sales order ID to delete') },
    async ({ id }) => {
      await client.deleteSalesOrder(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Sales order ${id} deleted` }, null, 2) }] };
    }
  );
}
