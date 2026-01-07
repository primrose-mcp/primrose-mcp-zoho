/**
 * Zoho CRM Attachment Tools
 * Tools for managing attachments in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatAttachment } from '../utils/formatters.js';

export function registerAttachmentTools(server: McpServer, client: CrmClient): void {
  // List Attachments for Record
  server.tool(
    'zoho_list_attachments',
    'List attachments for a specific record in Zoho CRM',
    {
      module: z.string().describe('Module name (Leads, Contacts, Accounts, Deals, etc.)'),
      recordId: z.string().describe('The record ID'),
      limit: z.number().optional().describe('Maximum number of attachments to return'),
      offset: z.number().optional().describe('Number of attachments to skip'),
    },
    async ({ module, recordId, limit, offset }) => {
      const result = await client.listAttachments(module, recordId, { limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ attachments: result.items.map(formatAttachment), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Delete Attachment
  server.tool(
    'zoho_delete_attachment',
    'Delete an attachment from Zoho CRM',
    {
      module: z.string().describe('Module name'),
      recordId: z.string().describe('The record ID'),
      attachmentId: z.string().describe('The attachment ID to delete'),
    },
    async ({ module, recordId, attachmentId }) => {
      await client.deleteAttachment(module, recordId, attachmentId);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Attachment ${attachmentId} deleted` }, null, 2) }] };
    }
  );
}
