/**
 * Zoho CRM Event Tools
 * Tools for managing events (meetings) in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatEvent } from '../utils/formatters.js';

export function registerEventTools(server: McpServer, client: CrmClient): void {
  // List Events
  server.tool(
    'zoho_list_events',
    'List events (meetings) from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of events to return'),
      offset: z.number().optional().describe('Number of events to skip'),
    },
    async ({ limit, offset }) => {
      const result = await client.listEvents({ limit, offset });
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ events: result.items.map(formatEvent), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }],
      };
    }
  );

  // Get Event
  server.tool(
    'zoho_get_event',
    'Get a specific event by ID from Zoho CRM',
    { id: z.string().describe('The event ID') },
    async ({ id }) => {
      const event = await client.getEvent(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatEvent(event), null, 2) }] };
    }
  );

  // Create Event
  server.tool(
    'zoho_create_event',
    'Create a new event (meeting) in Zoho CRM',
    {
      eventTitle: z.string().describe('Event title (required)'),
      startDateTime: z.string().describe('Start date/time in ISO format (required)'),
      endDateTime: z.string().describe('End date/time in ISO format (required)'),
      allDay: z.boolean().optional().describe('Is all day event'),
      location: z.string().optional().describe('Location'),
      whatId: z.string().optional().describe('Related to (Account/Deal) ID'),
      whoId: z.string().optional().describe('Related to (Contact/Lead) ID'),
      remindAt: z.string().optional().describe('Reminder time'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const event = await client.createEvent(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatEvent(event), null, 2) }] };
    }
  );

  // Update Event
  server.tool(
    'zoho_update_event',
    'Update an existing event in Zoho CRM',
    {
      id: z.string().describe('The event ID'),
      eventTitle: z.string().optional().describe('Event title'),
      startDateTime: z.string().optional().describe('Start date/time'),
      endDateTime: z.string().optional().describe('End date/time'),
      allDay: z.boolean().optional().describe('Is all day event'),
      location: z.string().optional().describe('Location'),
      whatId: z.string().optional().describe('Related to (Account/Deal) ID'),
      whoId: z.string().optional().describe('Related to (Contact/Lead) ID'),
      remindAt: z.string().optional().describe('Reminder time'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const event = await client.updateEvent(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatEvent(event), null, 2) }] };
    }
  );

  // Delete Event
  server.tool(
    'zoho_delete_event',
    'Delete an event from Zoho CRM',
    { id: z.string().describe('The event ID to delete') },
    async ({ id }) => {
      await client.deleteEvent(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Event ${id} deleted` }, null, 2) }] };
    }
  );

  // Search Events
  server.tool(
    'zoho_search_events',
    'Search for events in Zoho CRM',
    {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results'),
      offset: z.number().optional().describe('Number of results to skip'),
    },
    async ({ query, limit, offset }) => {
      const result = await client.searchEvents({ query, limit, offset });
      return { content: [{ type: 'text' as const, text: JSON.stringify({ events: result.items.map(formatEvent), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2) }] };
    }
  );
}
