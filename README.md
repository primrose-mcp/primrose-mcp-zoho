# Zoho CRM MCP Server

[![Primrose MCP](https://img.shields.io/badge/Primrose-MCP-blue)](https://primrose.dev/mcp/zoho)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for Zoho CRM, enabling AI assistants to manage leads, contacts, deals, and automate sales processes.

## Features

### Core CRM Modules
- **Activities** - Manage tasks, calls, and events
- **Companies** - Manage company/account records
- **Contacts** - Manage contact records
- **Deals** - Track deals through the sales pipeline

### Extended CRM Modules
- **Leads** - Capture and manage leads
- **Products** - Manage product catalog
- **Quotes** - Create and manage quotes
- **Sales Orders** - Process sales orders
- **Purchase Orders** - Manage purchase orders
- **Invoices** - Generate and track invoices
- **Vendors** - Manage vendor relationships
- **Price Books** - Manage pricing configurations
- **Campaigns** - Run marketing campaigns
- **Cases** - Handle customer support cases
- **Solutions** - Knowledge base solutions
- **Events** - Schedule and manage events
- **Notes** - Add notes to records
- **Attachments** - Manage file attachments

### Advanced APIs
- **COQL** - CRM Object Query Language queries
- **Bulk** - Bulk import/export operations
- **Notifications** - Manage webhooks and notifications
- **Related Records** - Handle record relationships
- **Metadata** - Access CRM metadata and fields
- **Tags** - Organize records with tags
- **Users** - Manage CRM users

## Quick Start

### Recommended: Use Primrose SDK

The easiest way to use this MCP server is with the Primrose SDK:

```bash
npm install primrose-mcp
```

```typescript
import { PrimroseMCP } from 'primrose-mcp';

const primrose = new PrimroseMCP({
  apiKey: process.env.PRIMROSE_API_KEY,
});

const zohoClient = primrose.getClient('zoho', {
  accessToken: process.env.ZOHO_ACCESS_TOKEN,
});
```

## Manual Installation

### Prerequisites

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)
- Zoho CRM account with API access

### Setup

1. Clone and install dependencies:

```bash
git clone <repository-url>
cd primrose-mcp-zoho
npm install
```

2. Deploy to Cloudflare Workers:

```bash
npx wrangler deploy
```

## Configuration

### Required Headers (one of)

| Header | Description |
|--------|-------------|
| `X-CRM-API-Key` | Your CRM API key |
| `X-CRM-Access-Token` | OAuth access token |

### Optional Headers

| Header | Description |
|--------|-------------|
| `X-CRM-Base-URL` | Override the default CRM API base URL |
| `X-CRM-Client-ID` | OAuth client ID |
| `X-CRM-Client-Secret` | OAuth client secret |

### Example Request

```bash
curl -X POST https://your-worker.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -H "X-CRM-Access-Token: your-access-token" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

## Available Tools

### Activity Tools
- `zoho_list_activities` - List activities
- `zoho_get_activity` - Get activity details
- `zoho_create_activity` - Create an activity
- `zoho_update_activity` - Update an activity
- `zoho_delete_activity` - Delete an activity

### Company Tools
- `zoho_list_companies` - List companies/accounts
- `zoho_get_company` - Get company details
- `zoho_create_company` - Create a company
- `zoho_update_company` - Update a company
- `zoho_delete_company` - Delete a company

### Contact Tools
- `zoho_list_contacts` - List contacts
- `zoho_get_contact` - Get contact details
- `zoho_create_contact` - Create a contact
- `zoho_update_contact` - Update a contact
- `zoho_delete_contact` - Delete a contact

### Deal Tools
- `zoho_list_deals` - List deals
- `zoho_get_deal` - Get deal details
- `zoho_create_deal` - Create a deal
- `zoho_update_deal` - Update a deal
- `zoho_delete_deal` - Delete a deal

### Lead Tools
- `zoho_list_leads` - List leads
- `zoho_get_lead` - Get lead details
- `zoho_create_lead` - Create a lead
- `zoho_update_lead` - Update a lead
- `zoho_convert_lead` - Convert lead to contact/deal

### Product Tools
- `zoho_list_products` - List products
- `zoho_get_product` - Get product details
- `zoho_create_product` - Create a product
- `zoho_update_product` - Update a product

### Quote Tools
- `zoho_list_quotes` - List quotes
- `zoho_get_quote` - Get quote details
- `zoho_create_quote` - Create a quote
- `zoho_update_quote` - Update a quote

### Sales Order Tools
- `zoho_list_sales_orders` - List sales orders
- `zoho_get_sales_order` - Get sales order details
- `zoho_create_sales_order` - Create a sales order

### Invoice Tools
- `zoho_list_invoices` - List invoices
- `zoho_get_invoice` - Get invoice details
- `zoho_create_invoice` - Create an invoice

### Campaign Tools
- `zoho_list_campaigns` - List campaigns
- `zoho_get_campaign` - Get campaign details
- `zoho_create_campaign` - Create a campaign

### Case Tools
- `zoho_list_cases` - List support cases
- `zoho_get_case` - Get case details
- `zoho_create_case` - Create a case
- `zoho_update_case` - Update a case

### COQL Tools
- `zoho_coql_query` - Execute COQL query

### Bulk Tools
- `zoho_bulk_read` - Bulk read records
- `zoho_bulk_write` - Bulk write records
- `zoho_get_bulk_job_status` - Check bulk job status

### Notification Tools
- `zoho_list_notifications` - List webhook notifications
- `zoho_create_notification` - Create a notification
- `zoho_delete_notification` - Delete a notification

### Related Record Tools
- `zoho_get_related_records` - Get related records
- `zoho_add_related_record` - Add related record
- `zoho_remove_related_record` - Remove related record

### Metadata Tools
- `zoho_get_modules` - List CRM modules
- `zoho_get_module_fields` - Get module fields
- `zoho_get_layouts` - Get module layouts

### Tag Tools
- `zoho_list_tags` - List tags
- `zoho_add_tags` - Add tags to records
- `zoho_remove_tags` - Remove tags from records

### User Tools
- `zoho_list_users` - List CRM users
- `zoho_get_user` - Get user details
- `zoho_get_current_user` - Get current user

## Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Type check
npm run typecheck

# Deploy
npm run deploy
```

## Related Resources

- [Primrose SDK Documentation](https://primrose.dev/docs)
- [Zoho CRM API Documentation](https://www.zoho.com/crm/developer/docs/api/v2/)
- [Zoho Developer Console](https://api-console.zoho.com)
- [Model Context Protocol](https://modelcontextprotocol.io)
