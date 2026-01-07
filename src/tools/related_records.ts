/**
 * Zoho CRM Related Records Tools
 * Tools for managing related records between modules in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';

export function registerRelatedRecordTools(server: McpServer, client: CrmClient): void {
  // Get Related Records
  server.tool(
    'zoho_get_related_records',
    'Get related records for a specific record in Zoho CRM',
    {
      module: z.string().describe('Parent module name (e.g., Accounts, Contacts, Deals)'),
      recordId: z.string().describe('Parent record ID'),
      relatedModule: z.string().describe('Related module name (e.g., Contacts, Deals, Notes)'),
      limit: z.number().optional().describe('Maximum number of related records to return'),
      offset: z.number().optional().describe('Number of related records to skip'),
    },
    async ({ module, recordId, relatedModule, limit, offset }) => {
      const result = await client.listRelatedRecords(module, recordId, relatedModule, { limit, offset });
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            relatedRecords: result.items,
            pagination: {
              count: result.count,
              total: result.total,
              hasMore: result.hasMore,
            },
          }, null, 2)
        }],
      };
    }
  );

  // Add Related Record
  server.tool(
    'zoho_add_related_record',
    'Link a related record to a parent record in Zoho CRM',
    {
      module: z.string().describe('Parent module name'),
      recordId: z.string().describe('Parent record ID'),
      relatedModule: z.string().describe('Related module name'),
      relatedRecordId: z.string().describe('Related record ID to link'),
    },
    async ({ module, recordId, relatedModule, relatedRecordId }) => {
      await client.addRelatedRecord(module, recordId, relatedModule, relatedRecordId);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            message: `Related record ${relatedRecordId} linked successfully.`,
          }, null, 2)
        }],
      };
    }
  );

  // Remove Related Record
  server.tool(
    'zoho_remove_related_record',
    'Unlink a related record from a parent record in Zoho CRM',
    {
      module: z.string().describe('Parent module name'),
      recordId: z.string().describe('Parent record ID'),
      relatedModule: z.string().describe('Related module name'),
      relatedRecordId: z.string().describe('Related record ID to unlink'),
    },
    async ({ module, recordId, relatedModule, relatedRecordId }) => {
      await client.removeRelatedRecord(module, recordId, relatedModule, relatedRecordId);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            message: `Related record ${relatedRecordId} unlinked successfully.`,
          }, null, 2)
        }],
      };
    }
  );
}
