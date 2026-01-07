/**
 * Zoho CRM COQL Tools
 * Tools for executing COQL (CRM Object Query Language) queries
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';

export function registerCoqlTools(server: McpServer, client: CrmClient): void {
  // Execute COQL Query
  server.tool(
    'zoho_coql_query',
    'Execute a COQL (CRM Object Query Language) query in Zoho CRM. COQL is SQL-like syntax for querying Zoho CRM data.',
    {
      selectQuery: z.string().describe('The COQL SELECT query (e.g., "select Last_Name, First_Name from Contacts where Last_Name = \'Smith\' limit 10")'),
    },
    async ({ selectQuery }) => {
      const result = await client.executeCoql(selectQuery);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            data: result.data,
            info: result.info,
          }, null, 2)
        }],
      };
    }
  );
}
