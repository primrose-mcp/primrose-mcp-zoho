/**
 * Zoho CRM Bulk API Tools
 * Tools for bulk read and write operations in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';

export function registerBulkTools(server: McpServer, client: CrmClient): void {
  // Create Bulk Read Job
  server.tool(
    'zoho_bulk_read_create',
    'Create a bulk read job to export records from Zoho CRM',
    {
      module: z.string().describe('Module name to export (Leads, Contacts, Accounts, Deals, etc.)'),
      fields: z.array(z.string()).optional().describe('List of field API names to include'),
      page: z.number().optional().describe('Page number for pagination'),
    },
    async ({ module, fields, page }) => {
      const job = await client.createBulkReadJob({
        query: {
          module: { api_name: module },
          fields,
          page,
        },
      });
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            jobId: job.id,
            createdTime: job.createdTime,
            message: 'Bulk read job created. Use zoho_bulk_read_status to check job status.',
          }, null, 2)
        }],
      };
    }
  );

  // Get Bulk Read Job Status
  server.tool(
    'zoho_bulk_read_status',
    'Get the status of a bulk read job in Zoho CRM',
    {
      jobId: z.string().describe('The bulk read job ID'),
    },
    async ({ jobId }) => {
      const job = await client.getBulkReadJob(jobId);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(job, null, 2)
        }],
      };
    }
  );

  // Create Bulk Write Job
  server.tool(
    'zoho_bulk_write_create',
    'Create a bulk write job to import records into Zoho CRM. Note: You must first upload a file using the Zoho Files API to get a fileId.',
    {
      module: z.string().describe('Module name to import into (Leads, Contacts, Accounts, Deals, etc.)'),
      operation: z.enum(['insert', 'update', 'upsert']).describe('Operation type'),
      fileId: z.string().describe('File ID from Zoho Files API'),
      findBy: z.string().optional().describe('Field API name to use for matching records (for update/upsert)'),
    },
    async ({ module, operation, fileId, findBy }) => {
      const job = await client.createBulkWriteJob({
        operation,
        resource: [{
          type: 'data',
          module: { api_name: module },
          fileId,
          findBy,
        }],
      });
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            jobId: job.id,
            createdTime: job.createdTime,
            message: 'Bulk write job created. Use zoho_bulk_write_status to check job status.',
          }, null, 2)
        }],
      };
    }
  );

  // Get Bulk Write Job Status
  server.tool(
    'zoho_bulk_write_status',
    'Get the status of a bulk write job in Zoho CRM',
    {
      jobId: z.string().describe('The bulk write job ID'),
    },
    async ({ jobId }) => {
      const job = await client.getBulkWriteJob(jobId);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(job, null, 2)
        }],
      };
    }
  );
}
