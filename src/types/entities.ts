/**
 * CRM Entity Types
 *
 * Standard data structures for CRM entities.
 * Map your CRM's specific fields to these types in the client.
 */

// =============================================================================
// Pagination
// =============================================================================

export interface PaginationParams {
  /** Number of items to return */
  limit?: number;
  /** Cursor for pagination (CRM-specific format) */
  cursor?: string;
  /** Offset for offset-based pagination */
  offset?: number;
}

export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  /** Number of items in this response */
  count: number;
  /** Total count (if available) */
  total?: number;
  /** Whether more items are available */
  hasMore: boolean;
  /** Cursor for next page */
  nextCursor?: string;
}

// =============================================================================
// Search
// =============================================================================

export interface SearchParams extends PaginationParams {
  /** Search query string */
  query?: string;
  /** Filters to apply */
  filters?: SearchFilter[];
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilter {
  /** Field to filter on */
  field: string;
  /** Filter operator */
  operator: FilterOperator;
  /** Filter value */
  value: unknown;
}

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'in'
  | 'not_in'
  | 'is_null'
  | 'is_not_null';

// =============================================================================
// Contact
// =============================================================================

export interface Contact {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  title?: string;
  department?: string;
  companyId?: string;
  companyName?: string;
  lifecycleStage?: string;
  source?: string;
  status?: string;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  customFields?: Record<string, unknown>;
}

export interface ContactCreateInput {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  title?: string;
  companyId?: string;
  source?: string;
  customFields?: Record<string, unknown>;
}

export interface ContactUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  title?: string;
  companyId?: string;
  customFields?: Record<string, unknown>;
}

// =============================================================================
// Company
// =============================================================================

export interface Company {
  id: string;
  name: string;
  domain?: string;
  website?: string;
  industry?: string;
  description?: string;
  numberOfEmployees?: number;
  annualRevenue?: number;
  revenueCurrency?: string;
  type?: string;
  lifecycleStage?: string;
  phone?: string;
  address?: Address;
  linkedInUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  customFields?: Record<string, unknown>;
}

export interface CompanyCreateInput {
  name: string;
  domain?: string;
  industry?: string;
  description?: string;
  numberOfEmployees?: number;
  type?: string;
  phone?: string;
  address?: Partial<Address>;
  customFields?: Record<string, unknown>;
}

export interface CompanyUpdateInput {
  name?: string;
  domain?: string;
  industry?: string;
  description?: string;
  numberOfEmployees?: number;
  type?: string;
  phone?: string;
  address?: Partial<Address>;
  customFields?: Record<string, unknown>;
}

// =============================================================================
// Deal / Opportunity
// =============================================================================

export interface Deal {
  id: string;
  name: string;
  amount?: number;
  currency?: string;
  stage?: string;
  stageId?: string;
  pipelineId?: string;
  pipelineName?: string;
  probability?: number;
  closeDate?: string;
  status?: DealStatus;
  type?: string;
  source?: string;
  description?: string;
  companyId?: string;
  companyName?: string;
  contactIds?: string[];
  closeReason?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  customFields?: Record<string, unknown>;
}

export type DealStatus = 'open' | 'won' | 'lost';

export interface DealCreateInput {
  name: string;
  amount?: number;
  currency?: string;
  stageId?: string;
  pipelineId?: string;
  closeDate?: string;
  companyId?: string;
  contactIds?: string[];
  customFields?: Record<string, unknown>;
}

export interface DealUpdateInput {
  name?: string;
  amount?: number;
  currency?: string;
  stageId?: string;
  closeDate?: string;
  status?: DealStatus;
  closeReason?: string;
  customFields?: Record<string, unknown>;
}

// =============================================================================
// Pipeline
// =============================================================================

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  isDefault?: boolean;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability?: number;
  isClosed?: boolean;
  isWon?: boolean;
}

// =============================================================================
// Activity
// =============================================================================

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  body?: string;
  status?: ActivityStatus;
  dueDate?: string;
  completedDate?: string;
  durationMinutes?: number;
  activityDate?: string;
  contactIds?: string[];
  companyId?: string;
  dealId?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  customFields?: Record<string, unknown>;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note' | 'other';
export type ActivityStatus = 'pending' | 'completed' | 'cancelled';

export interface ActivityCreateInput {
  type: ActivityType;
  subject: string;
  body?: string;
  dueDate?: string;
  contactIds?: string[];
  companyId?: string;
  dealId?: string;
  customFields?: Record<string, unknown>;
}

// =============================================================================
// Lead
// =============================================================================

export interface Lead {
  id: string;
  firstName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company?: string;
  title?: string;
  website?: string;
  industry?: string;
  annualRevenue?: number;
  numberOfEmployees?: number;
  leadSource?: string;
  leadStatus?: string;
  rating?: string;
  description?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  ownerId?: string;
  convertedDetail?: {
    contact: string;
    account: string;
    deal?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadCreateInput {
  lastName: string;
  firstName?: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  website?: string;
  industry?: string;
  leadSource?: string;
  leadStatus?: string;
  description?: string;
  ownerId?: string;
}

export interface LeadUpdateInput {
  lastName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  website?: string;
  industry?: string;
  leadSource?: string;
  leadStatus?: string;
  description?: string;
  ownerId?: string;
}

export interface LeadConvertInput {
  Deals?: {
    Deal_Name: string;
    Closing_Date: string;
    Stage: string;
    Amount?: number;
  };
  Accounts?: {
    Account_Name?: string;
  };
  Contacts?: {
    Last_Name?: string;
    First_Name?: string;
  };
  carryOverTags?: boolean;
  notifyLeadOwner?: boolean;
  notifyNewEntityOwner?: boolean;
}

// =============================================================================
// Product
// =============================================================================

export interface Product {
  id: string;
  productName: string;
  productCode?: string;
  productCategory?: string;
  manufacturer?: string;
  vendorName?: string;
  productActive?: boolean;
  unitPrice?: number;
  salesStartDate?: string;
  salesEndDate?: string;
  supportStartDate?: string;
  supportExpiryDate?: string;
  usageUnit?: string;
  quantityInStock?: number;
  quantityInDemand?: number;
  reorderLevel?: number;
  handler?: string;
  quantityOrdered?: number;
  taxable?: boolean;
  commissionRate?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCreateInput {
  productName: string;
  productCode?: string;
  productCategory?: string;
  manufacturer?: string;
  vendorName?: string;
  productActive?: boolean;
  unitPrice?: number;
  usageUnit?: string;
  taxable?: boolean;
  description?: string;
}

export interface ProductUpdateInput {
  productName?: string;
  productCode?: string;
  productCategory?: string;
  manufacturer?: string;
  vendorName?: string;
  productActive?: boolean;
  unitPrice?: number;
  usageUnit?: string;
  taxable?: boolean;
  description?: string;
}

// =============================================================================
// Quote
// =============================================================================

export interface QuotedItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  listPrice?: number;
  unitPrice?: number;
  total?: number;
  discount?: number;
  netTotal?: number;
  tax?: number;
}

export interface Quote {
  id: string;
  subject: string;
  quoteNumber?: string;
  quoteStage?: string;
  dealId?: string;
  dealName?: string;
  contactId?: string;
  contactName?: string;
  accountId?: string;
  accountName?: string;
  validUntil?: string;
  team?: string;
  carrier?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCode?: string;
  shippingCountry?: string;
  billingStreet?: string;
  billingCity?: string;
  billingState?: string;
  billingCode?: string;
  billingCountry?: string;
  subTotal?: number;
  discount?: number;
  tax?: number;
  adjustment?: number;
  grandTotal?: number;
  termsAndConditions?: string;
  description?: string;
  quotedItems?: QuotedItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteCreateInput {
  subject: string;
  dealId?: string;
  contactId?: string;
  accountId?: string;
  validUntil?: string;
  quoteStage?: string;
  quotedItems?: QuotedItem[];
  termsAndConditions?: string;
  description?: string;
}

export interface QuoteUpdateInput {
  subject?: string;
  dealId?: string;
  contactId?: string;
  accountId?: string;
  validUntil?: string;
  quoteStage?: string;
  quotedItems?: QuotedItem[];
  termsAndConditions?: string;
  description?: string;
}

// =============================================================================
// Sales Order
// =============================================================================

export interface OrderedItem {
  productId: string;
  productName?: string;
  quantity: number;
  listPrice?: number;
  unitPrice?: number;
  total?: number;
  discount?: number;
}

export interface SalesOrder {
  id: string;
  subject: string;
  soNumber?: string;
  status?: string;
  dealId?: string;
  dealName?: string;
  contactId?: string;
  contactName?: string;
  accountId?: string;
  accountName?: string;
  quoteId?: string;
  quoteName?: string;
  dueDate?: string;
  carrier?: string;
  pending?: number;
  exciseDuty?: number;
  salesCommission?: number;
  subTotal?: number;
  discount?: number;
  tax?: number;
  adjustment?: number;
  grandTotal?: number;
  orderedItems?: OrderedItem[];
  termsAndConditions?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesOrderCreateInput {
  subject: string;
  dealId?: string;
  contactId?: string;
  accountId?: string;
  quoteId?: string;
  status?: string;
  dueDate?: string;
  orderedItems?: OrderedItem[];
  description?: string;
}

export interface SalesOrderUpdateInput {
  subject?: string;
  dealId?: string;
  contactId?: string;
  accountId?: string;
  quoteId?: string;
  status?: string;
  dueDate?: string;
  orderedItems?: OrderedItem[];
  description?: string;
}

// =============================================================================
// Purchase Order
// =============================================================================

export interface PurchaseOrder {
  id: string;
  subject: string;
  poNumber?: string;
  status?: string;
  vendorId?: string;
  vendorName?: string;
  contactId?: string;
  contactName?: string;
  dueDate?: string;
  carrier?: string;
  requisitionNo?: string;
  trackingNumber?: string;
  salesCommission?: number;
  exciseDuty?: number;
  subTotal?: number;
  discount?: number;
  tax?: number;
  adjustment?: number;
  grandTotal?: number;
  orderedItems?: OrderedItem[];
  termsAndConditions?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseOrderCreateInput {
  subject: string;
  vendorId: string;
  contactId?: string;
  status?: string;
  dueDate?: string;
  orderedItems?: OrderedItem[];
  description?: string;
}

export interface PurchaseOrderUpdateInput {
  subject?: string;
  vendorId?: string;
  contactId?: string;
  status?: string;
  dueDate?: string;
  orderedItems?: OrderedItem[];
  description?: string;
}

// =============================================================================
// Invoice
// =============================================================================

export interface InvoicedItem {
  productId: string;
  productName?: string;
  quantity: number;
  listPrice?: number;
  unitPrice?: number;
  total?: number;
  discount?: number;
}

export interface Invoice {
  id: string;
  subject: string;
  invoiceNumber?: string;
  status?: string;
  salesOrderId?: string;
  salesOrderName?: string;
  dealId?: string;
  dealName?: string;
  contactId?: string;
  contactName?: string;
  accountId?: string;
  accountName?: string;
  invoiceDate?: string;
  dueDate?: string;
  salesCommission?: number;
  exciseDuty?: number;
  subTotal?: number;
  discount?: number;
  tax?: number;
  adjustment?: number;
  grandTotal?: number;
  invoicedItems?: InvoicedItem[];
  termsAndConditions?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceCreateInput {
  subject: string;
  salesOrderId?: string;
  dealId?: string;
  contactId?: string;
  accountId?: string;
  status?: string;
  invoiceDate?: string;
  dueDate?: string;
  invoicedItems?: InvoicedItem[];
  description?: string;
}

export interface InvoiceUpdateInput {
  subject?: string;
  salesOrderId?: string;
  dealId?: string;
  contactId?: string;
  accountId?: string;
  status?: string;
  invoiceDate?: string;
  dueDate?: string;
  invoicedItems?: InvoicedItem[];
  description?: string;
}

// =============================================================================
// Vendor
// =============================================================================

export interface Vendor {
  id: string;
  vendorName: string;
  email?: string;
  phone?: string;
  website?: string;
  category?: string;
  glAccount?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  description?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorCreateInput {
  vendorName: string;
  email?: string;
  phone?: string;
  website?: string;
  category?: string;
  description?: string;
  ownerId?: string;
}

export interface VendorUpdateInput {
  vendorName?: string;
  email?: string;
  phone?: string;
  website?: string;
  category?: string;
  description?: string;
  ownerId?: string;
}

// =============================================================================
// Price Book
// =============================================================================

export interface PricingDetail {
  id?: string;
  fromRange?: number;
  toRange?: number;
  discount?: number;
}

export interface PriceBook {
  id: string;
  priceBookName: string;
  pricingModel?: 'Flat' | 'Differential';
  pricingDetails?: PricingDetail[];
  active?: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceBookCreateInput {
  priceBookName: string;
  pricingModel?: 'Flat' | 'Differential';
  active?: boolean;
  description?: string;
}

export interface PriceBookUpdateInput {
  priceBookName?: string;
  pricingModel?: 'Flat' | 'Differential';
  active?: boolean;
  description?: string;
}

// =============================================================================
// Campaign
// =============================================================================

export interface Campaign {
  id: string;
  campaignName: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  expectedRevenue?: number;
  budgetedCost?: number;
  actualCost?: number;
  expectedResponse?: number;
  numSent?: number;
  parentCampaign?: string;
  description?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignCreateInput {
  campaignName: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  expectedRevenue?: number;
  budgetedCost?: number;
  description?: string;
  ownerId?: string;
}

export interface CampaignUpdateInput {
  campaignName?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  expectedRevenue?: number;
  budgetedCost?: number;
  actualCost?: number;
  description?: string;
  ownerId?: string;
}

// =============================================================================
// Case
// =============================================================================

export interface Case {
  id: string;
  subject: string;
  caseNumber?: string;
  status?: string;
  type?: string;
  priority?: string;
  origin?: string;
  reason?: string;
  reportedBy?: string;
  accountId?: string;
  accountName?: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealName?: string;
  productId?: string;
  productName?: string;
  email?: string;
  phone?: string;
  solution?: string;
  internalComments?: string;
  description?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CaseCreateInput {
  subject: string;
  status?: string;
  type?: string;
  priority?: string;
  origin?: string;
  accountId?: string;
  contactId?: string;
  description?: string;
  ownerId?: string;
}

export interface CaseUpdateInput {
  subject?: string;
  status?: string;
  type?: string;
  priority?: string;
  origin?: string;
  accountId?: string;
  contactId?: string;
  solution?: string;
  internalComments?: string;
  description?: string;
  ownerId?: string;
}

// =============================================================================
// Solution
// =============================================================================

export interface Solution {
  id: string;
  solutionTitle: string;
  solutionNumber?: string;
  status?: string;
  productId?: string;
  productName?: string;
  question?: string;
  answer?: string;
  addToKnowledgeBase?: boolean;
  noOfComments?: number;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SolutionCreateInput {
  solutionTitle: string;
  status?: string;
  productId?: string;
  question?: string;
  answer?: string;
  addToKnowledgeBase?: boolean;
  ownerId?: string;
}

export interface SolutionUpdateInput {
  solutionTitle?: string;
  status?: string;
  productId?: string;
  question?: string;
  answer?: string;
  addToKnowledgeBase?: boolean;
  ownerId?: string;
}

// =============================================================================
// Event (Meeting)
// =============================================================================

export interface EventParticipant {
  participant: string;
  type: 'user' | 'contact' | 'lead';
  status?: string;
}

export interface RecurringInfo {
  RRULE: string;
}

export interface ZohoEvent {
  id: string;
  eventTitle: string;
  allDay?: boolean;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  venue?: string;
  whatId?: string;
  whatName?: string;
  whoId?: string;
  whoName?: string;
  participants?: EventParticipant[];
  remindAt?: string;
  recurringActivity?: RecurringInfo;
  description?: string;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventCreateInput {
  eventTitle: string;
  startDateTime: string;
  endDateTime: string;
  allDay?: boolean;
  location?: string;
  whatId?: string;
  whoId?: string;
  participants?: EventParticipant[];
  remindAt?: string;
  description?: string;
  ownerId?: string;
}

export interface EventUpdateInput {
  eventTitle?: string;
  startDateTime?: string;
  endDateTime?: string;
  allDay?: boolean;
  location?: string;
  whatId?: string;
  whoId?: string;
  participants?: EventParticipant[];
  remindAt?: string;
  description?: string;
  ownerId?: string;
}

// =============================================================================
// Note
// =============================================================================

export interface Note {
  id: string;
  noteTitle?: string;
  noteContent: string;
  parentModule?: string;
  parentId?: string;
  voiceNote?: boolean;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteCreateInput {
  noteTitle?: string;
  noteContent: string;
  parentModule: string;
  parentId: string;
}

export interface NoteUpdateInput {
  noteTitle?: string;
  noteContent?: string;
}

// =============================================================================
// Attachment
// =============================================================================

export interface Attachment {
  id: string;
  fileName: string;
  fileId?: string;
  size?: number;
  parentModule?: string;
  parentId?: string;
  attachmentType?: string;
  createdAt?: string;
  updatedAt?: string;
}

// =============================================================================
// COQL
// =============================================================================

export interface CoqlResponse {
  data: Record<string, unknown>[];
  info: {
    count: number;
    moreRecords: boolean;
    page: number;
  };
}

// =============================================================================
// Bulk API
// =============================================================================

export type BulkJobState = 'ADDED' | 'QUEUED' | 'IN PROGRESS' | 'COMPLETED' | 'FAILED';

export interface BulkReadJob {
  id: string;
  operation: 'read';
  createdBy?: { id: string; name: string };
  createdTime?: string;
  state: BulkJobState;
  result?: { downloadUrl?: string };
  query?: {
    module: { api_name: string };
    criteria?: object;
    page?: number;
  };
}

export interface BulkWriteJob {
  id: string;
  operation: 'insert' | 'update' | 'upsert';
  createdBy?: { id: string };
  createdTime?: string;
  state: BulkJobState;
  result?: { downloadUrl?: string };
  resource?: Array<{
    status: string;
    type: string;
    module: { api_name: string };
    fileId: string;
  }>;
}

export interface BulkReadRequest {
  callback?: { url: string; method: string };
  query: {
    module: { api_name: string };
    criteria?: {
      group_operator?: 'and' | 'or';
      group?: Array<{
        field: { api_name: string };
        comparator: string;
        value: string | number | boolean;
      }>;
    };
    fields?: string[];
    page?: number;
  };
}

export interface BulkWriteRequest {
  operation: 'insert' | 'update' | 'upsert';
  callback?: { url: string; method: string };
  resource: Array<{
    type: 'data';
    module: { api_name: string };
    fileId: string;
    findBy?: string;
  }>;
}

// =============================================================================
// Notification
// =============================================================================

export interface NotificationChannel {
  channelId: string;
  channelExpiry?: string;
  events: string[];
  token?: string;
  notifyUrl: string;
  resourceUri?: string;
  resourceId?: string;
  resourceName?: string;
}

// =============================================================================
// Related Records
// =============================================================================

export interface RelatedRecord {
  id: string;
  [key: string]: unknown;
}

// =============================================================================
// Metadata
// =============================================================================

export interface ZohoModule {
  id: string;
  apiName: string;
  moduleName: string;
  singularLabel: string;
  pluralLabel: string;
  creatable?: boolean;
  viewable?: boolean;
  editable?: boolean;
  deletable?: boolean;
  convertable?: boolean;
}

export interface ZohoField {
  id: string;
  apiName: string;
  fieldLabel: string;
  dataType: string;
  length?: number;
  required?: boolean;
  visible?: boolean;
  readOnly?: boolean;
  customField?: boolean;
  pickListValues?: Array<{ displayValue: string; actualValue: string }>;
}

export interface LayoutSection {
  displayLabel: string;
  sequenceNumber: number;
  columns: number;
  fields: ZohoField[];
}

export interface Layout {
  id: string;
  name: string;
  status?: string;
  sections?: LayoutSection[];
}

export interface CustomView {
  id: string;
  name: string;
  displayValue: string;
  systemDefined?: boolean;
  default?: boolean;
  criteria?: object;
}

export interface RelatedList {
  id: string;
  apiName: string;
  displayLabel: string;
  module: string;
  type: string;
}

// =============================================================================
// Tag
// =============================================================================

export interface Tag {
  id: string;
  name: string;
  colorCode?: string;
  createdAt?: string;
}

export interface TagCreateInput {
  name: string;
  colorCode?: string;
}

export interface TagUpdateInput {
  name?: string;
  colorCode?: string;
}

// =============================================================================
// User
// =============================================================================

export interface ZohoUser {
  id: string;
  name: string;
  email: string;
  role?: { id: string; name: string };
  profile?: { id: string; name: string };
  status?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  timeZone?: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Profile {
  id: string;
  name: string;
  default?: boolean;
  description?: string;
  createdAt?: string;
}

export interface Role {
  id: string;
  name: string;
  reportingTo?: { id: string; name: string };
  description?: string;
}

// =============================================================================
// Common
// =============================================================================

export interface Address {
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// =============================================================================
// Response Format
// =============================================================================

export type ResponseFormat = 'json' | 'markdown';
