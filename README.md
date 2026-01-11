# Primrose MCP Zoho CRM

A Model Context Protocol (MCP) server for Zoho CRM, deployed on Cloudflare Workers.

## Features

- **Contacts** - List, get, create, update, delete, and search contacts
- **Companies (Accounts)** - Full CRUD operations for accounts
- **Deals** - Deal management with stage tracking
- **Leads** - Lead capture and conversion
- **Cases** - Customer support case management
- **Campaigns** - Marketing campaign management
- **Products** - Product catalog management
- **Quotes** - Quote creation and management
- **Sales Orders** - Sales order processing
- **Purchase Orders** - Purchase order management
- **Invoices** - Invoice management
- **Vendors** - Vendor management
- **Solutions** - Knowledge base solutions
- **Events** - Calendar event management
- **Activities (Tasks/Calls)** - Activity tracking
- **Notes** - Note management
- **Attachments** - File attachment management
- **Tags** - Tag management
- **Price Books** - Price book management
- **Related Records** - Record relationship management
- **Users** - User management
- **Metadata** - Module and field metadata
- **COQL** - Zoho CRM Query Language support
- **Bulk** - Bulk operations
- **Notifications** - Notification management

## Authentication

This server uses a multi-tenant architecture. Pass your Zoho CRM credentials via request headers:

| Header | Description |
|--------|-------------|
| `X-CRM-Access-Token` | Zoho OAuth access token (required) |
| `X-CRM-Base-URL` | Your Zoho data center URL (e.g., `https://www.zohoapis.com`) |

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp` | POST | Streamable HTTP MCP endpoint |
| `/health` | GET | Health check |

## Installation

```bash
npm install
```

## Development

```bash
# Local development
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

## Deployment

```bash
npm run deploy
```

## Testing

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to test the server:

```bash
npx @modelcontextprotocol/inspector
```

## API Reference

- [Zoho CRM API Documentation](https://www.zoho.com/crm/developer/docs/api/v7/)
- API Version: v7

## License

MIT
