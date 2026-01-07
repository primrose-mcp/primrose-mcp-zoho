/**
 * Zoho CRM Tag Tools
 * Tools for managing tags in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatTag } from '../utils/formatters.js';

export function registerTagTools(server: McpServer, client: CrmClient): void {
  // List Tags
  server.tool(
    'zoho_list_tags',
    'List all tags for a specific module in Zoho CRM',
    {
      module: z.string().describe('Module API name (e.g., Leads, Contacts, Accounts, Deals)'),
    },
    async ({ module }) => {
      const tags = await client.listTags(module);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ tags: tags.map(formatTag) }, null, 2)
        }],
      };
    }
  );

  // Create Tag
  server.tool(
    'zoho_create_tag',
    'Create a new tag in Zoho CRM',
    {
      module: z.string().describe('Module API name'),
      name: z.string().describe('Tag name'),
      colorCode: z.string().optional().describe('Color code for the tag (e.g., #FF5733)'),
    },
    async ({ module, name, colorCode }) => {
      const tag = await client.createTag(module, { name, colorCode });
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(formatTag(tag), null, 2)
        }],
      };
    }
  );

  // Delete Tag
  server.tool(
    'zoho_delete_tag',
    'Delete a tag from Zoho CRM',
    {
      tagId: z.string().describe('Tag ID to delete'),
    },
    async ({ tagId }) => {
      await client.deleteTag(tagId);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ success: true, message: `Tag ${tagId} deleted` }, null, 2)
        }],
      };
    }
  );

  // Add Tags to Records
  server.tool(
    'zoho_add_tags_to_records',
    'Add tags to one or more records in Zoho CRM',
    {
      module: z.string().describe('Module API name'),
      recordIds: z.array(z.string()).describe('List of record IDs'),
      tagNames: z.array(z.string()).describe('List of tag names to add'),
    },
    async ({ module, recordIds, tagNames }) => {
      await client.addTagsToRecords(module, recordIds, tagNames);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            message: `Tags added to ${recordIds.length} record(s)`,
          }, null, 2)
        }],
      };
    }
  );

  // Remove Tags from Records
  server.tool(
    'zoho_remove_tags_from_records',
    'Remove tags from one or more records in Zoho CRM',
    {
      module: z.string().describe('Module API name'),
      recordIds: z.array(z.string()).describe('List of record IDs'),
      tagNames: z.array(z.string()).describe('List of tag names to remove'),
    },
    async ({ module, recordIds, tagNames }) => {
      await client.removeTagsFromRecords(module, recordIds, tagNames);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            message: `Tags removed from ${recordIds.length} record(s)`,
          }, null, 2)
        }],
      };
    }
  );
}
