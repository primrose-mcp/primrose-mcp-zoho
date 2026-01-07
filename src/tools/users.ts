/**
 * Zoho CRM User Tools
 * Tools for managing users and profiles in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatUser, formatProfile, formatRole } from '../utils/formatters.js';

export function registerUserTools(server: McpServer, client: CrmClient): void {
  // List Users
  server.tool(
    'zoho_list_users',
    'List all users in Zoho CRM',
    {
      type: z.enum(['AllUsers', 'ActiveUsers', 'DeactiveUsers', 'ConfirmedUsers', 'NotConfirmedUsers', 'DeletedUsers', 'ActiveConfirmedUsers', 'AdminUsers', 'ActiveConfirmedAdmins', 'CurrentUser']).optional().describe('Filter users by type'),
    },
    async ({ type }) => {
      const users = await client.listUsers(type);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            users: users.map(formatUser),
          }, null, 2)
        }],
      };
    }
  );

  // Get User
  server.tool(
    'zoho_get_user',
    'Get a specific user by ID from Zoho CRM',
    {
      userId: z.string().describe('The user ID'),
    },
    async ({ userId }) => {
      const user = await client.getUser(userId);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(formatUser(user), null, 2)
        }],
      };
    }
  );

  // Get Current User
  server.tool(
    'zoho_get_current_user',
    'Get the currently authenticated user in Zoho CRM',
    {},
    async () => {
      const user = await client.getCurrentUser();
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(formatUser(user), null, 2)
        }],
      };
    }
  );

  // List Profiles
  server.tool(
    'zoho_list_profiles',
    'List all profiles in Zoho CRM',
    {},
    async () => {
      const profiles = await client.listProfiles();
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ profiles: profiles.map(formatProfile) }, null, 2)
        }],
      };
    }
  );

  // Get Profile
  server.tool(
    'zoho_get_profile',
    'Get a specific profile by ID from Zoho CRM',
    {
      profileId: z.string().describe('The profile ID'),
    },
    async ({ profileId }) => {
      const profile = await client.getProfile(profileId);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(formatProfile(profile), null, 2)
        }],
      };
    }
  );

  // List Roles
  server.tool(
    'zoho_list_roles',
    'List all roles in Zoho CRM',
    {},
    async () => {
      const roles = await client.listRoles();
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ roles: roles.map(formatRole) }, null, 2)
        }],
      };
    }
  );

  // Get Role
  server.tool(
    'zoho_get_role',
    'Get a specific role by ID from Zoho CRM',
    {
      roleId: z.string().describe('The role ID'),
    },
    async ({ roleId }) => {
      const role = await client.getRole(roleId);
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(formatRole(role), null, 2)
        }],
      };
    }
  );
}
