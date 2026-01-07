/**
 * Zoho CRM Purchase Order Tools
 * Tools for managing purchase orders in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatPurchaseOrder } from '../utils/formatters.js';

export function registerPurchaseOrderTools(server: McpServer, client: CrmClient): void {
  // List Purchase Orders
  server.tool(
    'zoho_list_purchase_orders',
    'List purchase orders from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of purchase orders to return'),
      offset: z.number().optional().describe('Number of purchase orders to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listPurchaseOrders({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ purchaseOrders: result.items.map(formatPurchaseOrder), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Purchase Order
  server.tool(
    'zoho_get_purchase_order',
    'Get a specific purchase order by ID from Zoho CRM',
    { id: z.string().describe('The purchase order ID') },
    async ({ id }) => {
      const po = await client.getPurchaseOrder(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatPurchaseOrder(po), null, 2) }] };
    }
  );

  // Create Purchase Order
  server.tool(
    'zoho_create_purchase_order',
    'Create a new purchase order in Zoho CRM',
    {
      subject: z.string().describe('Purchase order subject (required)'),
      vendorId: z.string().describe('Vendor ID (required)'),
      contactId: z.string().optional().describe('Associated contact ID'),
      status: z.string().optional().describe('Status'),
      dueDate: z.string().optional().describe('Due date (YYYY-MM-DD)'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const po = await client.createPurchaseOrder(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatPurchaseOrder(po), null, 2) }] };
    }
  );

  // Update Purchase Order
  server.tool(
    'zoho_update_purchase_order',
    'Update an existing purchase order in Zoho CRM',
    {
      id: z.string().describe('The purchase order ID'),
      subject: z.string().optional().describe('Purchase order subject'),
      vendorId: z.string().optional().describe('Vendor ID'),
      status: z.string().optional().describe('Status'),
      dueDate: z.string().optional().describe('Due date'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const po = await client.updatePurchaseOrder(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatPurchaseOrder(po), null, 2) }] };
    }
  );

  // Delete Purchase Order
  server.tool(
    'zoho_delete_purchase_order',
    'Delete a purchase order from Zoho CRM',
    { id: z.string().describe('The purchase order ID to delete') },
    async ({ id }) => {
      await client.deletePurchaseOrder(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Purchase order ${id} deleted` }, null, 2) }] };
    }
  );
}
