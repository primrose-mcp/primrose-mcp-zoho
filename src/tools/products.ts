/**
 * Zoho CRM Product Tools
 * Tools for managing products in Zoho CRM
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { CrmClient } from '../client.js';
import { formatProduct } from '../utils/formatters.js';

export function registerProductTools(server: McpServer, client: CrmClient): void {
  // List Products
  server.tool(
    'zoho_list_products',
    'List products from Zoho CRM with pagination',
    {
      limit: z.number().optional().describe('Maximum number of products to return (default: 20, max: 200)'),
      offset: z.number().optional().describe('Number of products to skip for pagination'),
    },
    async ({ limit, offset }) => {
      const result = await client.listProducts({ limit, offset });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                products: result.items.map(formatProduct),
                pagination: { count: result.count, total: result.total, hasMore: result.hasMore },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Get Product
  server.tool(
    'zoho_get_product',
    'Get a specific product by ID from Zoho CRM',
    { id: z.string().describe('The product ID') },
    async ({ id }) => {
      const product = await client.getProduct(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatProduct(product), null, 2) }] };
    }
  );

  // Create Product
  server.tool(
    'zoho_create_product',
    'Create a new product in Zoho CRM',
    {
      productName: z.string().describe('Product name (required)'),
      productCode: z.string().optional().describe('Product code'),
      productCategory: z.string().optional().describe('Product category'),
      manufacturer: z.string().optional().describe('Manufacturer'),
      productActive: z.boolean().optional().describe('Is product active'),
      unitPrice: z.number().optional().describe('Unit price'),
      usageUnit: z.string().optional().describe('Usage unit'),
      taxable: z.boolean().optional().describe('Is taxable'),
      description: z.string().optional().describe('Description'),
    },
    async (input) => {
      const product = await client.createProduct(input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatProduct(product), null, 2) }] };
    }
  );

  // Update Product
  server.tool(
    'zoho_update_product',
    'Update an existing product in Zoho CRM',
    {
      id: z.string().describe('The product ID'),
      productName: z.string().optional().describe('Product name'),
      productCode: z.string().optional().describe('Product code'),
      productCategory: z.string().optional().describe('Product category'),
      manufacturer: z.string().optional().describe('Manufacturer'),
      productActive: z.boolean().optional().describe('Is product active'),
      unitPrice: z.number().optional().describe('Unit price'),
      usageUnit: z.string().optional().describe('Usage unit'),
      taxable: z.boolean().optional().describe('Is taxable'),
      description: z.string().optional().describe('Description'),
    },
    async ({ id, ...input }) => {
      const product = await client.updateProduct(id, input);
      return { content: [{ type: 'text' as const, text: JSON.stringify(formatProduct(product), null, 2) }] };
    }
  );

  // Delete Product
  server.tool(
    'zoho_delete_product',
    'Delete a product from Zoho CRM',
    { id: z.string().describe('The product ID to delete') },
    async ({ id }) => {
      await client.deleteProduct(id);
      return { content: [{ type: 'text' as const, text: JSON.stringify({ success: true, message: `Product ${id} deleted` }, null, 2) }] };
    }
  );

  // Search Products
  server.tool(
    'zoho_search_products',
    'Search for products in Zoho CRM',
    {
      query: z.string().describe('Search query'),
      limit: z.number().optional().describe('Maximum number of results'),
      offset: z.number().optional().describe('Number of results to skip'),
    },
    async ({ query, limit, offset }) => {
      const result = await client.searchProducts({ query, limit, offset });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ products: result.items.map(formatProduct), pagination: { count: result.count, total: result.total, hasMore: result.hasMore } }, null, 2),
          },
        ],
      };
    }
  );
}
