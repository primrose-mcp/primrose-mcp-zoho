/**
 * Zoho CRM Notification Tools
 * Tools for managing webhook notifications in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';

export function registerNotificationTools(server: McpServer, client: CrmClient): void {
  // Enable Notifications
  server.tool(
    'zoho_enable_notifications',
    'Enable notifications (webhook) for specific events in Zoho CRM',
    {
      channelId: z.string().describe('Unique channel identifier'),
      notifyUrl: z.string().describe('Webhook URL to receive notifications'),
      events: z.array(z.string()).describe('Events to subscribe to (e.g., ["Contacts.create", "Contacts.edit", "Deals.delete"])'),
      token: z.string().optional().describe('Token to include in notification payload for verification'),
      channelExpiry: z.string().optional().describe('Channel expiry time in ISO format'),
    },
    async ({ channelId, notifyUrl, events, token, channelExpiry }) => {
      const result = await client.enableNotifications([{
        channelId,
        notifyUrl,
        events,
        token,
        channelExpiry,
      }]);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            channels: result,
            message: 'Notification channel enabled successfully.',
          }, null, 2)
        }],
      };
    }
  );

  // Disable Notifications
  server.tool(
    'zoho_disable_notifications',
    'Disable a notification channel in Zoho CRM',
    {
      channelIds: z.array(z.string()).describe('List of channel IDs to disable'),
    },
    async ({ channelIds }) => {
      await client.disableNotifications(channelIds);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            success: true,
            message: `Notification channels disabled: ${channelIds.join(', ')}`,
          }, null, 2)
        }],
      };
    }
  );
}
