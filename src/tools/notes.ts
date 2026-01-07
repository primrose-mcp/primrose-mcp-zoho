/**
 * Zoho CRM Note Tools
 * Tools for managing notes in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatNote } from '../utils/formatters.js';

export function registerNoteTools(server: McpServer, client: CrmClient): void {
  // List Notes
  server.tool(
    'zoho_list_notes',
    'List notes from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of notes to return'),
      offset: z.number().optional().describe('Number of notes to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listNotes({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ notes: result.items.map(formatNote), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Note
  server.tool(
    'zoho_get_note',
    'Get a specific note by ID from Zoho CRM',
    { id: z.string().describe('The note ID') },
    async ({ id }) => {
      const note = await client.getNote(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatNote(note), null, 2) }] };
    }
  );

  // Create Note
  server.tool(
    'zoho_create_note',
    'Create a new note in Zoho CRM',
    {
      noteTitle: z.string().describe('Note title (required)'),
      noteContent: z.string().describe('Note content (required)'),
      parentModule: z.string().describe('Parent module (Leads, Contacts, Accounts, Deals, etc.)'),
      parentId: z.string().describe('Parent record ID'),
    },
    async (input) => {
      const note = await client.createNote(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatNote(note), null, 2) }] };
    }
  );

  // Update Note
  server.tool(
    'zoho_update_note',
    'Update an existing note in Zoho CRM',
    {
      id: z.string().describe('The note ID'),
      noteTitle: z.string().optional().describe('Note title'),
      noteContent: z.string().optional().describe('Note content'),
    },
    async ({ id, ...input }) => {
      const note = await client.updateNote(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatNote(note), null, 2) }] };
    }
  );

  // Delete Note
  server.tool(
    'zoho_delete_note',
    'Delete a note from Zoho CRM',
    { id: z.string().describe('The note ID to delete') },
    async ({ id }) => {
      await client.deleteNote(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Note ${id} deleted` }, null, 2) }] };
    }
  );

  // Get Notes for Record
  server.tool(
    'zoho_get_record_notes',
    'Get all notes for a specific record in Zoho CRM',
    {
      module: z.string().describe('Module name (Leads, Contacts, Accounts, Deals, etc.)'),
      recordId: z.string().describe('The record ID'),
      limit: z.number().optional().describe('Maximum number of notes to return'),
      offset: z.number().optional().describe('Number of notes to skip'),
    },
    async ({ module, recordId, limit, offset }) => {
      const result = await client.listRecordNotes(module, recordId, { limit, offset });
      return { content: [{ type: 'text' as const, text: JSON.stringify({ notes: result.items.map(formatNote), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }] };
    }
  );
}
