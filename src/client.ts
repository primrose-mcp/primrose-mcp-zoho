/**
 * Zoho CRM API Client
 *
 * Implements Zoho CRM API v6.
 * Reference: https://www.zoho.com/crm/developer/docs/api/v6/
 *
 * MULTI-TENANT: This client receives credentials per-request via TenantCredentials,
 * allowing a single server to serve multiple tenants with different OAuth tokens.
 */

import type {
  Activity,
  ActivityCreateInput,
  ActivityStatus,
  Attachment,
  BulkReadJob,
  BulkReadRequest,
  BulkWriteJob,
  BulkWriteRequest,
  Campaign,
  CampaignCreateInput,
  CampaignUpdateInput,
  Case,
  CaseCreateInput,
  CaseUpdateInput,
  Company,
  CompanyCreateInput,
  CompanyUpdateInput,
  Contact,
  ContactCreateInput,
  ContactUpdateInput,
  CoqlResponse,
  CustomView,
  Deal,
  DealCreateInput,
  DealUpdateInput,
  EventCreateInput,
  EventUpdateInput,
  Invoice,
  InvoiceCreateInput,
  InvoiceUpdateInput,
  Layout,
  Lead,
  LeadConvertInput,
  LeadCreateInput,
  LeadUpdateInput,
  Note,
  NoteCreateInput,
  NoteUpdateInput,
  NotificationChannel,
  PaginatedResponse,
  PaginationParams,
  Pipeline,
  PriceBook,
  PriceBookCreateInput,
  PriceBookUpdateInput,
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  Profile,
  PurchaseOrder,
  PurchaseOrderCreateInput,
  PurchaseOrderUpdateInput,
  Quote,
  QuoteCreateInput,
  QuoteUpdateInput,
  RelatedList,
  RelatedRecord,
  Role,
  SalesOrder,
  SalesOrderCreateInput,
  SalesOrderUpdateInput,
  SearchParams,
  Solution,
  SolutionCreateInput,
  SolutionUpdateInput,
  Tag,
  TagCreateInput,
  TagUpdateInput,
  Vendor,
  VendorCreateInput,
  VendorUpdateInput,
  ZohoEvent,
  ZohoField,
  ZohoModule,
  ZohoUser,
} from './types/entities.js';
import type { TenantCredentials } from './types/env.js';
import { AuthenticationError, CrmApiError, RateLimitError } from './utils/errors.js';

// =============================================================================
// Zoho API Response Types
// =============================================================================

interface ZohoListResponse<T> {
  data: T[];
  info: {
    page: number;
    per_page: number;
    count: number;
    more_records: boolean;
  };
}

interface ZohoRecordResponse<T> {
  data: T[];
}

interface ZohoCreateResponse {
  data: Array<{
    code: string;
    details: { id: string };
    message: string;
    status: string;
  }>;
}

interface ZohoDeleteResponse {
  data: Array<{
    code: string;
    details: { id: string };
    message: string;
    status: string;
  }>;
}

interface ZohoPipelineResponse {
  pipeline: Array<{
    id: string;
    display_value: string;
    default: boolean;
    maps: Array<{
      id: string;
      display_value: string;
      sequence_number: number;
      forecast_category?: { name: string; id: string };
    }>;
  }>;
}

interface ZohoUserResponse {
  users: Array<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    status: string;
  }>;
}

// Zoho record types
interface ZohoContact {
  id: string;
  First_Name?: string;
  Last_Name?: string;
  Full_Name?: string;
  Email?: string;
  Phone?: string;
  Mobile?: string;
  Title?: string;
  Department?: string;
  Account_Name?: { id: string; name: string };
  Lead_Source?: string;
  Owner?: { id: string; name: string; email: string };
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoAccount {
  id: string;
  Account_Name?: string;
  Website?: string;
  Industry?: string;
  Description?: string;
  Employees?: number;
  Annual_Revenue?: number;
  Account_Type?: string;
  Phone?: string;
  Billing_Street?: string;
  Billing_City?: string;
  Billing_State?: string;
  Billing_Country?: string;
  Owner?: { id: string; name: string; email: string };
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoDeal {
  id: string;
  Deal_Name?: string;
  Amount?: number;
  Stage?: string;
  Closing_Date?: string;
  Account_Name?: { id: string; name: string };
  Contact_Name?: { id: string; name: string };
  Probability?: number;
  Pipeline?: string;
  Owner?: { id: string; name: string; email: string };
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoTask {
  id: string;
  Subject?: string;
  Due_Date?: string;
  Status?: string;
  Priority?: string;
  Who_Id?: { id: string; name: string };
  What_Id?: { id: string; name: string };
  Description?: string;
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoCall {
  id: string;
  Subject?: string;
  Call_Type?: string;
  Call_Duration?: string;
  Call_Start_Time?: string;
  Who_Id?: { id: string; name: string };
  What_Id?: { id: string; name: string };
  Description?: string;
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoEventRecord {
  id: string;
  Event_Title?: string;
  Start_DateTime?: string;
  End_DateTime?: string;
  All_day?: boolean;
  Location?: string;
  Venue?: string;
  Who_Id?: { id: string; name: string };
  What_Id?: { id: string; name: string };
  Participants?: Array<{ participant: string; type: string; status?: string }>;
  Remind_At?: string;
  Recurring_Activity?: { RRULE: string };
  Description?: string;
  Owner?: { id: string; name: string; email: string };
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoLead {
  id: string;
  First_Name?: string;
  Last_Name?: string;
  Email?: string;
  Phone?: string;
  Mobile?: string;
  Company?: string;
  Designation?: string;
  Website?: string;
  Industry?: string;
  Annual_Revenue?: number;
  No_of_Employees?: number;
  Lead_Source?: string;
  Lead_Status?: string;
  Rating?: string;
  Description?: string;
  Street?: string;
  City?: string;
  State?: string;
  Zip_Code?: string;
  Country?: string;
  Owner?: { id: string; name: string; email: string };
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoProduct {
  id: string;
  Product_Name?: string;
  Product_Code?: string;
  Product_Category?: string;
  Manufacturer?: string;
  Vendor_Name?: { id: string; name: string };
  Product_Active?: boolean;
  Unit_Price?: number;
  Sales_Start_Date?: string;
  Sales_End_Date?: string;
  Support_Start_Date?: string;
  Support_Expiry_Date?: string;
  Usage_Unit?: string;
  Qty_in_Stock?: number;
  Qty_in_Demand?: number;
  Reorder_Level?: number;
  Handler?: { id: string; name: string };
  Qty_Ordered?: number;
  Taxable?: boolean;
  Commission_Rate?: number;
  Description?: string;
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoQuote {
  id: string;
  Subject?: string;
  Quote_Number?: string;
  Quote_Stage?: string;
  Deal_Name?: { id: string; name: string };
  Contact_Name?: { id: string; name: string };
  Account_Name?: { id: string; name: string };
  Valid_Till?: string;
  Team?: string;
  Carrier?: string;
  Shipping_Street?: string;
  Shipping_City?: string;
  Shipping_State?: string;
  Shipping_Code?: string;
  Shipping_Country?: string;
  Billing_Street?: string;
  Billing_City?: string;
  Billing_State?: string;
  Billing_Code?: string;
  Billing_Country?: string;
  Sub_Total?: number;
  Discount?: number;
  Tax?: number;
  Adjustment?: number;
  Grand_Total?: number;
  Terms_and_Conditions?: string;
  Description?: string;
  Quoted_Items?: Array<{
    id?: string;
    Product_Name: { id: string; name?: string };
    Quantity: number;
    List_Price?: number;
    Unit_Price?: number;
    Total?: number;
    Discount?: number;
    Net_Total?: number;
    Tax?: number;
  }>;
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoSalesOrder {
  id: string;
  Subject?: string;
  SO_Number?: string;
  Status?: string;
  Deal_Name?: { id: string; name: string };
  Contact_Name?: { id: string; name: string };
  Account_Name?: { id: string; name: string };
  Quote_Name?: { id: string; name: string };
  Due_Date?: string;
  Carrier?: string;
  Pending?: number;
  Excise_Duty?: number;
  Sales_Commission?: number;
  Sub_Total?: number;
  Discount?: number;
  Tax?: number;
  Adjustment?: number;
  Grand_Total?: number;
  Ordered_Items?: Array<{
    Product_Name: { id: string; name?: string };
    Quantity: number;
    List_Price?: number;
    Unit_Price?: number;
    Total?: number;
    Discount?: number;
  }>;
  Terms_and_Conditions?: string;
  Description?: string;
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoPurchaseOrder {
  id: string;
  Subject?: string;
  PO_Number?: string;
  Status?: string;
  Vendor_Name?: { id: string; name: string };
  Contact_Name?: { id: string; name: string };
  Due_Date?: string;
  Carrier?: string;
  Requisition_No?: string;
  Tracking_Number?: string;
  Sales_Commission?: number;
  Excise_Duty?: number;
  Sub_Total?: number;
  Discount?: number;
  Tax?: number;
  Adjustment?: number;
  Grand_Total?: number;
  Ordered_Items?: Array<{
    Product_Name: { id: string; name?: string };
    Quantity: number;
    List_Price?: number;
    Unit_Price?: number;
    Total?: number;
    Discount?: number;
  }>;
  Terms_and_Conditions?: string;
  Description?: string;
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoInvoice {
  id: string;
  Subject?: string;
  Invoice_Number?: string;
  Status?: string;
  Sales_Order?: { id: string; name: string };
  Deal_Name?: { id: string; name: string };
  Contact_Name?: { id: string; name: string };
  Account_Name?: { id: string; name: string };
  Invoice_Date?: string;
  Due_Date?: string;
  Sales_Commission?: number;
  Excise_Duty?: number;
  Sub_Total?: number;
  Discount?: number;
  Tax?: number;
  Adjustment?: number;
  Grand_Total?: number;
  Invoiced_Items?: Array<{
    Product_Name: { id: string; name?: string };
    Quantity: number;
    List_Price?: number;
    Unit_Price?: number;
    Total?: number;
    Discount?: number;
  }>;
  Terms_and_Conditions?: string;
  Description?: string;
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoVendor {
  id: string;
  Vendor_Name?: string;
  Email?: string;
  Phone?: string;
  Website?: string;
  Category?: string;
  GL_Account?: string;
  Street?: string;
  City?: string;
  State?: string;
  Zip_Code?: string;
  Country?: string;
  Description?: string;
  Owner?: { id: string; name: string; email: string };
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoPriceBook {
  id: string;
  Price_Book_Name?: string;
  Pricing_Model?: string;
  Pricing_Details?: Array<{
    id?: string;
    from_range?: number;
    to_range?: number;
    discount?: number;
  }>;
  Active?: boolean;
  Description?: string;
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoCampaign {
  id: string;
  Campaign_Name?: string;
  Type?: string;
  Status?: string;
  Start_Date?: string;
  End_Date?: string;
  Expected_Revenue?: number;
  Budgeted_Cost?: number;
  Actual_Cost?: number;
  Expected_Response?: number;
  Num_sent?: number;
  Parent_Campaign?: { id: string; name: string };
  Description?: string;
  Owner?: { id: string; name: string; email: string };
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoCase {
  id: string;
  Subject?: string;
  Case_Number?: string;
  Status?: string;
  Type?: string;
  Priority?: string;
  Case_Origin?: string;
  Case_Reason?: string;
  Reported_By?: string;
  Account_Name?: { id: string; name: string };
  Contact_Name?: { id: string; name: string };
  Deal_Name?: { id: string; name: string };
  Product_Name?: { id: string; name: string };
  Email?: string;
  Phone?: string;
  Solution?: string;
  Internal_Comments?: string;
  Description?: string;
  Owner?: { id: string; name: string; email: string };
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoSolution {
  id: string;
  Solution_Title?: string;
  Solution_Number?: string;
  Status?: string;
  Product_Name?: { id: string; name: string };
  Question?: string;
  Answer?: string;
  Add_to_Knowledge_Base?: boolean;
  No_of_comments?: number;
  Owner?: { id: string; name: string; email: string };
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoNote {
  id: string;
  Note_Title?: string;
  Note_Content?: string;
  Parent_Id?: { module: string; id: string; name?: string };
  Voice_Note?: boolean;
  Owner?: { id: string; name: string; email: string };
  Created_Time?: string;
  Modified_Time?: string;
}

interface ZohoAttachment {
  id: string;
  File_Name?: string;
  File_Id?: string;
  Size?: number;
  Parent_Id?: { module: string; id: string };
  Attachment_Type?: string;
  Created_Time?: string;
  Modified_Time?: string;
}

// =============================================================================
// CRM Client Interface
// =============================================================================

export interface CrmClient {
  // Connection
  testConnection(): Promise<{ connected: boolean; message: string }>;

  // Contacts
  listContacts(params?: PaginationParams): Promise<PaginatedResponse<Contact>>;
  getContact(id: string): Promise<Contact>;
  createContact(input: ContactCreateInput): Promise<Contact>;
  updateContact(id: string, input: ContactUpdateInput): Promise<Contact>;
  deleteContact(id: string): Promise<void>;
  searchContacts(params: SearchParams): Promise<PaginatedResponse<Contact>>;

  // Companies
  listCompanies(params?: PaginationParams): Promise<PaginatedResponse<Company>>;
  getCompany(id: string): Promise<Company>;
  createCompany(input: CompanyCreateInput): Promise<Company>;
  updateCompany(id: string, input: CompanyUpdateInput): Promise<Company>;

  // Deals
  listDeals(params?: PaginationParams): Promise<PaginatedResponse<Deal>>;
  getDeal(id: string): Promise<Deal>;
  createDeal(input: DealCreateInput): Promise<Deal>;
  updateDeal(id: string, input: DealUpdateInput): Promise<Deal>;
  moveDealStage(id: string, stageId: string): Promise<Deal>;
  listPipelines(): Promise<Pipeline[]>;

  // Activities
  listActivities(
    params?: PaginationParams & { recordId?: string }
  ): Promise<PaginatedResponse<Activity>>;
  createActivity(input: ActivityCreateInput): Promise<Activity>;
  logCall(
    contactId: string,
    subject: string,
    notes?: string,
    durationMinutes?: number
  ): Promise<Activity>;
  logEmail(
    contactId: string,
    subject: string,
    body: string,
    direction: 'sent' | 'received'
  ): Promise<Activity>;

  // Leads
  listLeads(params?: PaginationParams): Promise<PaginatedResponse<Lead>>;
  getLead(id: string): Promise<Lead>;
  createLead(input: LeadCreateInput): Promise<Lead>;
  updateLead(id: string, input: LeadUpdateInput): Promise<Lead>;
  deleteLead(id: string): Promise<void>;
  searchLeads(params: SearchParams): Promise<PaginatedResponse<Lead>>;
  convertLead(id: string, input: LeadConvertInput): Promise<{ contact: string; account: string; deal?: string }>;

  // Products
  listProducts(params?: PaginationParams): Promise<PaginatedResponse<Product>>;
  getProduct(id: string): Promise<Product>;
  createProduct(input: ProductCreateInput): Promise<Product>;
  updateProduct(id: string, input: ProductUpdateInput): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(params: SearchParams): Promise<PaginatedResponse<Product>>;

  // Quotes
  listQuotes(params?: PaginationParams): Promise<PaginatedResponse<Quote>>;
  getQuote(id: string): Promise<Quote>;
  createQuote(input: QuoteCreateInput): Promise<Quote>;
  updateQuote(id: string, input: QuoteUpdateInput): Promise<Quote>;
  deleteQuote(id: string): Promise<void>;
  searchQuotes(params: SearchParams): Promise<PaginatedResponse<Quote>>;

  // Sales Orders
  listSalesOrders(params?: PaginationParams): Promise<PaginatedResponse<SalesOrder>>;
  getSalesOrder(id: string): Promise<SalesOrder>;
  createSalesOrder(input: SalesOrderCreateInput): Promise<SalesOrder>;
  updateSalesOrder(id: string, input: SalesOrderUpdateInput): Promise<SalesOrder>;
  deleteSalesOrder(id: string): Promise<void>;

  // Purchase Orders
  listPurchaseOrders(params?: PaginationParams): Promise<PaginatedResponse<PurchaseOrder>>;
  getPurchaseOrder(id: string): Promise<PurchaseOrder>;
  createPurchaseOrder(input: PurchaseOrderCreateInput): Promise<PurchaseOrder>;
  updatePurchaseOrder(id: string, input: PurchaseOrderUpdateInput): Promise<PurchaseOrder>;
  deletePurchaseOrder(id: string): Promise<void>;

  // Invoices
  listInvoices(params?: PaginationParams): Promise<PaginatedResponse<Invoice>>;
  getInvoice(id: string): Promise<Invoice>;
  createInvoice(input: InvoiceCreateInput): Promise<Invoice>;
  updateInvoice(id: string, input: InvoiceUpdateInput): Promise<Invoice>;
  deleteInvoice(id: string): Promise<void>;
  searchInvoices(params: SearchParams): Promise<PaginatedResponse<Invoice>>;

  // Vendors
  listVendors(params?: PaginationParams): Promise<PaginatedResponse<Vendor>>;
  getVendor(id: string): Promise<Vendor>;
  createVendor(input: VendorCreateInput): Promise<Vendor>;
  updateVendor(id: string, input: VendorUpdateInput): Promise<Vendor>;
  deleteVendor(id: string): Promise<void>;
  searchVendors(params: SearchParams): Promise<PaginatedResponse<Vendor>>;

  // Price Books
  listPriceBooks(params?: PaginationParams): Promise<PaginatedResponse<PriceBook>>;
  getPriceBook(id: string): Promise<PriceBook>;
  createPriceBook(input: PriceBookCreateInput): Promise<PriceBook>;
  updatePriceBook(id: string, input: PriceBookUpdateInput): Promise<PriceBook>;
  deletePriceBook(id: string): Promise<void>;

  // Campaigns
  listCampaigns(params?: PaginationParams): Promise<PaginatedResponse<Campaign>>;
  getCampaign(id: string): Promise<Campaign>;
  createCampaign(input: CampaignCreateInput): Promise<Campaign>;
  updateCampaign(id: string, input: CampaignUpdateInput): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;
  searchCampaigns(params: SearchParams): Promise<PaginatedResponse<Campaign>>;

  // Cases
  listCases(params?: PaginationParams): Promise<PaginatedResponse<Case>>;
  getCase(id: string): Promise<Case>;
  createCase(input: CaseCreateInput): Promise<Case>;
  updateCase(id: string, input: CaseUpdateInput): Promise<Case>;
  deleteCase(id: string): Promise<void>;
  searchCases(params: SearchParams): Promise<PaginatedResponse<Case>>;

  // Solutions
  listSolutions(params?: PaginationParams): Promise<PaginatedResponse<Solution>>;
  getSolution(id: string): Promise<Solution>;
  createSolution(input: SolutionCreateInput): Promise<Solution>;
  updateSolution(id: string, input: SolutionUpdateInput): Promise<Solution>;
  deleteSolution(id: string): Promise<void>;
  searchSolutions(params: SearchParams): Promise<PaginatedResponse<Solution>>;

  // Events
  listEvents(params?: PaginationParams): Promise<PaginatedResponse<ZohoEvent>>;
  getEvent(id: string): Promise<ZohoEvent>;
  createEvent(input: EventCreateInput): Promise<ZohoEvent>;
  updateEvent(id: string, input: EventUpdateInput): Promise<ZohoEvent>;
  deleteEvent(id: string): Promise<void>;
  searchEvents(params: SearchParams): Promise<PaginatedResponse<ZohoEvent>>;

  // Notes
  listNotes(params?: PaginationParams): Promise<PaginatedResponse<Note>>;
  getNote(id: string): Promise<Note>;
  createNote(input: NoteCreateInput): Promise<Note>;
  updateNote(id: string, input: NoteUpdateInput): Promise<Note>;
  deleteNote(id: string): Promise<void>;
  listRecordNotes(module: string, recordId: string, params?: PaginationParams): Promise<PaginatedResponse<Note>>;
  addNoteToRecord(module: string, recordId: string, input: NoteCreateInput): Promise<Note>;

  // Attachments
  listAttachments(module: string, recordId: string, params?: PaginationParams): Promise<PaginatedResponse<Attachment>>;
  deleteAttachment(module: string, recordId: string, attachmentId: string): Promise<void>;

  // COQL
  executeCoql(query: string): Promise<CoqlResponse>;

  // Bulk API
  createBulkReadJob(request: BulkReadRequest): Promise<BulkReadJob>;
  getBulkReadJob(jobId: string): Promise<BulkReadJob>;
  createBulkWriteJob(request: BulkWriteRequest): Promise<BulkWriteJob>;
  getBulkWriteJob(jobId: string): Promise<BulkWriteJob>;

  // Notifications
  enableNotifications(channels: NotificationChannel[]): Promise<NotificationChannel[]>;
  disableNotifications(channelIds: string[]): Promise<void>;
  getNotificationDetails(): Promise<NotificationChannel[]>;

  // Related Records
  listRelatedRecords(module: string, recordId: string, relatedList: string, params?: PaginationParams): Promise<PaginatedResponse<RelatedRecord>>;
  addRelatedRecord(module: string, recordId: string, relatedList: string, relatedRecordId: string): Promise<void>;
  removeRelatedRecord(module: string, recordId: string, relatedList: string, relatedRecordId: string): Promise<void>;

  // Metadata
  listModules(): Promise<ZohoModule[]>;
  getModule(apiName: string): Promise<ZohoModule>;
  listFields(module: string): Promise<ZohoField[]>;
  listLayouts(module: string): Promise<Layout[]>;
  listCustomViews(module: string): Promise<CustomView[]>;
  listRelatedLists(module: string): Promise<RelatedList[]>;

  // Tags
  listTags(module: string): Promise<Tag[]>;
  createTag(module: string, input: TagCreateInput): Promise<Tag>;
  updateTag(module: string, tagId: string, input: TagUpdateInput): Promise<Tag>;
  deleteTag(tagId: string): Promise<void>;
  addTagsToRecords(module: string, recordIds: string[], tagNames: string[]): Promise<void>;
  removeTagsFromRecords(module: string, recordIds: string[], tagNames: string[]): Promise<void>;

  // Users
  listUsers(type?: string): Promise<ZohoUser[]>;
  getUser(id: string): Promise<ZohoUser>;
  getCurrentUser(): Promise<ZohoUser>;
  listProfiles(): Promise<Profile[]>;
  getProfile(id: string): Promise<Profile>;
  listRoles(): Promise<Role[]>;
  getRole(id: string): Promise<Role>;
}

// =============================================================================
// Zoho CRM Client Implementation
// =============================================================================

class ZohoCrmClient implements CrmClient {
  private credentials: TenantCredentials;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry = 0;

  constructor(credentials: TenantCredentials) {
    this.credentials = credentials;
    // API domain comes from X-CRM-Base-URL header
    this.baseUrl = credentials.baseUrl || 'https://www.zohoapis.com';
  }

  // ===========================================================================
  // OAuth Token Management
  // ===========================================================================

  private async getAccessToken(): Promise<string> {
    // If access token was passed directly via header, use it
    if (this.credentials.accessToken) {
      return this.credentials.accessToken;
    }

    // Check if we have a valid cached token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Need to refresh - must have client credentials
    if (!this.credentials.clientId || !this.credentials.clientSecret || !this.credentials.refreshToken) {
      throw new AuthenticationError(
        'Missing OAuth credentials. Provide X-CRM-Access-Token or all of X-CRM-Client-ID, X-CRM-Client-Secret, and X-CRM-Refresh-Token headers.'
      );
    }

    // Determine token URL based on base URL domain
    const tokenUrl = this.getTokenUrl();

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.credentials.clientId,
      client_secret: this.credentials.clientSecret,
      refresh_token: this.credentials.refreshToken,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new AuthenticationError(`Failed to refresh OAuth token: ${errorText}`);
    }

    const data = (await response.json()) as { access_token: string; expires_in: number; error?: string };

    if (data.error) {
      throw new AuthenticationError(`OAuth token refresh failed: ${data.error}`);
    }

    this.accessToken = data.access_token;
    // Set expiry with 1 minute buffer
    this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000;

    return this.accessToken;
  }

  private getTokenUrl(): string {
    // Map API domain to corresponding accounts domain
    const domain = this.baseUrl.toLowerCase();
    if (domain.includes('.eu')) return 'https://accounts.zoho.eu/oauth/v2/token';
    if (domain.includes('.in')) return 'https://accounts.zoho.in/oauth/v2/token';
    if (domain.includes('.com.au')) return 'https://accounts.zoho.com.au/oauth/v2/token';
    if (domain.includes('.com.cn')) return 'https://accounts.zoho.com.cn/oauth/v2/token';
    if (domain.includes('.jp')) return 'https://accounts.zoho.jp/oauth/v2/token';
    return 'https://accounts.zoho.com/oauth/v2/token';
  }

  // ===========================================================================
  // HTTP Request Helper
  // ===========================================================================

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getAccessToken();
    return {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getAuthHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError('Rate limit exceeded', retryAfter ? parseInt(retryAfter, 10) : 60);
    }

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError('Authentication failed. Check your OAuth credentials.');
    }

    // Handle 204 No Content (successful delete)
    if (response.status === 204) {
      return undefined as T;
    }

    // Handle other errors
    if (!response.ok) {
      const errorBody = await response.text();
      let message = `API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorBody);
        message = errorJson.message || errorJson.error || errorJson.code || message;
      } catch {
        // Use default message
      }
      throw new CrmApiError(message, response.status);
    }

    return response.json() as Promise<T>;
  }

  // ===========================================================================
  // Connection
  // ===========================================================================

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const response = await this.request<ZohoUserResponse>('/crm/v6/users?type=CurrentUser');
      if (response.users && response.users.length > 0) {
        const user = response.users[0];
        return {
          connected: true,
          message: `Connected as ${user.full_name || user.email}`,
        };
      }
      return { connected: true, message: 'Connected to Zoho CRM' };
    } catch (error) {
      return {
        connected: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  // ===========================================================================
  // Contacts
  // ===========================================================================

  private mapZohoContact(zoho: ZohoContact): Contact {
    return {
      id: zoho.id,
      firstName: zoho.First_Name || undefined,
      lastName: zoho.Last_Name || undefined,
      fullName: zoho.Full_Name || undefined,
      email: zoho.Email || undefined,
      phone: zoho.Phone || undefined,
      mobilePhone: zoho.Mobile || undefined,
      title: zoho.Title || undefined,
      department: zoho.Department || undefined,
      companyId: zoho.Account_Name?.id || undefined,
      companyName: zoho.Account_Name?.name || undefined,
      source: zoho.Lead_Source || undefined,
      ownerId: zoho.Owner?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listContacts(params?: PaginationParams): Promise<PaginatedResponse<Contact>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;
    const page = Math.floor(offset / limit) + 1;
    const perPage = Math.min(limit, 200);
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(perPage));
    queryParams.set(
      'fields',
      'First_Name,Last_Name,Full_Name,Email,Phone,Mobile,Title,Department,Account_Name,Lead_Source,Owner,Created_Time,Modified_Time'
    );

    const response = await this.request<ZohoListResponse<ZohoContact>>(
      `/crm/v6/Contacts?${queryParams}`
    );

    return {
      items: response.data.map((c) => this.mapZohoContact(c)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getContact(id: string): Promise<Contact> {
    const response = await this.request<ZohoRecordResponse<ZohoContact>>(`/crm/v6/Contacts/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Contact not found: ${id}`, 404);
    }
    return this.mapZohoContact(response.data[0]);
  }

  async createContact(input: ContactCreateInput): Promise<Contact> {
    const zohoData: Record<string, unknown> = {};
    if (input.firstName) zohoData.First_Name = input.firstName;
    if (input.lastName) zohoData.Last_Name = input.lastName;
    if (input.email) zohoData.Email = input.email;
    if (input.phone) zohoData.Phone = input.phone;
    if (input.title) zohoData.Title = input.title;
    if (input.companyId) zohoData.Account_Name = input.companyId;
    if (input.source) zohoData.Lead_Source = input.source;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Contacts', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(
        `Failed to create contact: ${response.data?.[0]?.message || 'Unknown error'}`,
        400
      );
    }

    return this.getContact(response.data[0].details.id);
  }

  async updateContact(id: string, input: ContactUpdateInput): Promise<Contact> {
    const zohoData: Record<string, unknown> = {};
    if (input.firstName !== undefined) zohoData.First_Name = input.firstName;
    if (input.lastName !== undefined) zohoData.Last_Name = input.lastName;
    if (input.email !== undefined) zohoData.Email = input.email;
    if (input.phone !== undefined) zohoData.Phone = input.phone;
    if (input.title !== undefined) zohoData.Title = input.title;
    if (input.companyId !== undefined) zohoData.Account_Name = input.companyId;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(
        `Failed to update contact: ${response.data?.[0]?.message || 'Unknown error'}`,
        400
      );
    }

    return this.getContact(id);
  }

  async deleteContact(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Contacts?ids=${id}`, {
      method: 'DELETE',
    });

    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(
        `Failed to delete contact: ${response.data[0].message || 'Unknown error'}`,
        400
      );
    }
  }

  async searchContacts(params: SearchParams): Promise<PaginatedResponse<Contact>> {
    const queryParams = new URLSearchParams();
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const page = Math.floor(offset / limit) + 1;
    const perPage = Math.min(limit, 200);
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(perPage));

    // Use word search for general queries
    if (params.query) {
      queryParams.set('word', params.query);
    }

    // Use criteria for field-specific searches from filters
    if (params.filters && params.filters.length > 0) {
      const emailFilter = params.filters.find((f) => f.field === 'email');
      const phoneFilter = params.filters.find((f) => f.field === 'phone');
      if (emailFilter) {
        queryParams.set('criteria', `(Email:equals:${emailFilter.value})`);
      } else if (phoneFilter) {
        queryParams.set('criteria', `(Phone:equals:${phoneFilter.value})`);
      }
    }

    const response = await this.request<ZohoListResponse<ZohoContact>>(
      `/crm/v6/Contacts/search?${queryParams}`
    );

    return {
      items: response.data?.map((c) => this.mapZohoContact(c)) || [],
      count: response.data?.length || 0,
      total: response.info?.count || 0,
      hasMore: response.info?.more_records || false,
      nextCursor: response.info?.more_records ? String(page + 1) : undefined,
    };
  }

  // ===========================================================================
  // Companies (Zoho Accounts)
  // ===========================================================================

  private mapZohoAccount(zoho: ZohoAccount): Company {
    return {
      id: zoho.id,
      name: zoho.Account_Name || '',
      website: zoho.Website || undefined,
      industry: zoho.Industry || undefined,
      description: zoho.Description || undefined,
      numberOfEmployees: zoho.Employees || undefined,
      annualRevenue: zoho.Annual_Revenue || undefined,
      type: zoho.Account_Type || undefined,
      phone: zoho.Phone || undefined,
      address: zoho.Billing_Street
        ? {
            street: zoho.Billing_Street,
            city: zoho.Billing_City,
            state: zoho.Billing_State,
            country: zoho.Billing_Country,
          }
        : undefined,
      ownerId: zoho.Owner?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listCompanies(params?: PaginationParams): Promise<PaginatedResponse<Company>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;
    const page = Math.floor(offset / limit) + 1;
    const perPage = Math.min(limit, 200);
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(perPage));
    queryParams.set(
      'fields',
      'Account_Name,Website,Industry,Description,Employees,Annual_Revenue,Account_Type,Phone,Billing_Street,Billing_City,Billing_State,Billing_Country,Owner,Created_Time,Modified_Time'
    );

    const response = await this.request<ZohoListResponse<ZohoAccount>>(
      `/crm/v6/Accounts?${queryParams}`
    );

    return {
      items: response.data.map((a) => this.mapZohoAccount(a)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getCompany(id: string): Promise<Company> {
    const response = await this.request<ZohoRecordResponse<ZohoAccount>>(`/crm/v6/Accounts/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Company not found: ${id}`, 404);
    }
    return this.mapZohoAccount(response.data[0]);
  }

  async createCompany(input: CompanyCreateInput): Promise<Company> {
    const zohoData: Record<string, unknown> = {};
    if (input.name) zohoData.Account_Name = input.name;
    if (input.domain) zohoData.Website = input.domain;
    if (input.industry) zohoData.Industry = input.industry;
    if (input.description) zohoData.Description = input.description;
    if (input.numberOfEmployees) zohoData.Employees = input.numberOfEmployees;
    if (input.type) zohoData.Account_Type = input.type;
    if (input.phone) zohoData.Phone = input.phone;
    if (input.address) {
      if (input.address.street) zohoData.Billing_Street = input.address.street;
      if (input.address.city) zohoData.Billing_City = input.address.city;
      if (input.address.state) zohoData.Billing_State = input.address.state;
      if (input.address.country) zohoData.Billing_Country = input.address.country;
    }

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Accounts', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(
        `Failed to create company: ${response.data?.[0]?.message || 'Unknown error'}`,
        400
      );
    }

    return this.getCompany(response.data[0].details.id);
  }

  async updateCompany(id: string, input: CompanyUpdateInput): Promise<Company> {
    const zohoData: Record<string, unknown> = {};
    if (input.name !== undefined) zohoData.Account_Name = input.name;
    if (input.domain !== undefined) zohoData.Website = input.domain;
    if (input.industry !== undefined) zohoData.Industry = input.industry;
    if (input.description !== undefined) zohoData.Description = input.description;
    if (input.numberOfEmployees !== undefined) zohoData.Employees = input.numberOfEmployees;
    if (input.type !== undefined) zohoData.Account_Type = input.type;
    if (input.phone !== undefined) zohoData.Phone = input.phone;
    if (input.address) {
      if (input.address.street !== undefined) zohoData.Billing_Street = input.address.street;
      if (input.address.city !== undefined) zohoData.Billing_City = input.address.city;
      if (input.address.state !== undefined) zohoData.Billing_State = input.address.state;
      if (input.address.country !== undefined) zohoData.Billing_Country = input.address.country;
    }

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(
        `Failed to update company: ${response.data?.[0]?.message || 'Unknown error'}`,
        400
      );
    }

    return this.getCompany(id);
  }

  // ===========================================================================
  // Deals
  // ===========================================================================

  private mapZohoDeal(zoho: ZohoDeal): Deal {
    return {
      id: zoho.id,
      name: zoho.Deal_Name || '',
      amount: zoho.Amount || undefined,
      stage: zoho.Stage || undefined,
      stageId: zoho.Stage || undefined,
      closeDate: zoho.Closing_Date || undefined,
      companyId: zoho.Account_Name?.id || undefined,
      companyName: zoho.Account_Name?.name || undefined,
      contactIds: zoho.Contact_Name ? [zoho.Contact_Name.id] : undefined,
      probability: zoho.Probability || undefined,
      pipelineId: zoho.Pipeline || undefined,
      ownerId: zoho.Owner?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listDeals(params?: PaginationParams): Promise<PaginatedResponse<Deal>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;
    const page = Math.floor(offset / limit) + 1;
    const perPage = Math.min(limit, 200);
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(perPage));
    queryParams.set(
      'fields',
      'Deal_Name,Amount,Stage,Closing_Date,Account_Name,Contact_Name,Probability,Pipeline,Owner,Created_Time,Modified_Time'
    );

    const response = await this.request<ZohoListResponse<ZohoDeal>>(`/crm/v6/Deals?${queryParams}`);

    return {
      items: response.data.map((d) => this.mapZohoDeal(d)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getDeal(id: string): Promise<Deal> {
    const response = await this.request<ZohoRecordResponse<ZohoDeal>>(`/crm/v6/Deals/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Deal not found: ${id}`, 404);
    }
    return this.mapZohoDeal(response.data[0]);
  }

  async createDeal(input: DealCreateInput): Promise<Deal> {
    const zohoData: Record<string, unknown> = {};
    if (input.name) zohoData.Deal_Name = input.name;
    if (input.amount !== undefined) zohoData.Amount = input.amount;
    if (input.stageId) zohoData.Stage = input.stageId;
    if (input.closeDate) zohoData.Closing_Date = input.closeDate;
    if (input.companyId) zohoData.Account_Name = input.companyId;
    if (input.contactIds && input.contactIds.length > 0) {
      zohoData.Contact_Name = input.contactIds[0];
    }
    if (input.pipelineId) zohoData.Pipeline = input.pipelineId;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Deals', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(
        `Failed to create deal: ${response.data?.[0]?.message || 'Unknown error'}`,
        400
      );
    }

    return this.getDeal(response.data[0].details.id);
  }

  async updateDeal(id: string, input: DealUpdateInput): Promise<Deal> {
    const zohoData: Record<string, unknown> = {};
    if (input.name !== undefined) zohoData.Deal_Name = input.name;
    if (input.amount !== undefined) zohoData.Amount = input.amount;
    if (input.stageId !== undefined) zohoData.Stage = input.stageId;
    if (input.closeDate !== undefined) zohoData.Closing_Date = input.closeDate;
    if (input.status !== undefined) {
      // Map status to Zoho stage if needed
      if (input.status === 'won') zohoData.Stage = 'Closed Won';
      else if (input.status === 'lost') zohoData.Stage = 'Closed Lost';
    }

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(
        `Failed to update deal: ${response.data?.[0]?.message || 'Unknown error'}`,
        400
      );
    }

    return this.getDeal(id);
  }

  async moveDealStage(id: string, stageId: string): Promise<Deal> {
    return this.updateDeal(id, { stageId });
  }

  async listPipelines(): Promise<Pipeline[]> {
    const response = await this.request<ZohoPipelineResponse>(
      '/crm/v6/settings/pipeline?module=Deals'
    );

    return response.pipeline.map((p) => ({
      id: p.id,
      name: p.display_value,
      isDefault: p.default,
      stages: p.maps.map((m) => ({
        id: m.id,
        name: m.display_value,
        order: m.sequence_number,
      })),
    }));
  }

  // ===========================================================================
  // Activities
  // ===========================================================================

  private mapZohoStatusToActivityStatus(status?: string): ActivityStatus | undefined {
    if (!status) return undefined;
    const lower = status.toLowerCase();
    if (lower === 'completed' || lower === 'closed') return 'completed';
    if (lower === 'cancelled' || lower === 'canceled') return 'cancelled';
    return 'pending';
  }

  private mapZohoTask(zoho: ZohoTask): Activity {
    return {
      id: zoho.id,
      type: 'task',
      subject: zoho.Subject || '',
      body: zoho.Description || undefined,
      dueDate: zoho.Due_Date || undefined,
      status: this.mapZohoStatusToActivityStatus(zoho.Status),
      contactIds: zoho.Who_Id ? [zoho.Who_Id.id] : undefined,
      companyId: zoho.What_Id?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  private mapZohoCall(zoho: ZohoCall): Activity {
    return {
      id: zoho.id,
      type: 'call',
      subject: zoho.Subject || '',
      body: zoho.Description || undefined,
      dueDate: zoho.Call_Start_Time || undefined,
      durationMinutes: zoho.Call_Duration ? parseInt(zoho.Call_Duration, 10) : undefined,
      contactIds: zoho.Who_Id ? [zoho.Who_Id.id] : undefined,
      companyId: zoho.What_Id?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  private mapZohoEvent(zoho: ZohoEventRecord): Activity {
    return {
      id: zoho.id,
      type: 'meeting',
      subject: zoho.Event_Title || '',
      body: zoho.Description || undefined,
      activityDate: zoho.Start_DateTime || undefined,
      contactIds: zoho.Who_Id ? [zoho.Who_Id.id] : undefined,
      companyId: zoho.What_Id?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listActivities(
    params?: PaginationParams & { recordId?: string }
  ): Promise<PaginatedResponse<Activity>> {
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;
    const page = Math.floor(offset / limit) + 1;
    const perPage = Math.min(limit, 200);
    const queryParams = new URLSearchParams();
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(perPage));

    // Fetch tasks, calls, and events in parallel
    const [tasksResponse, callsResponse, eventsResponse] = await Promise.all([
      this.request<ZohoListResponse<ZohoTask>>(`/crm/v6/Tasks?${queryParams}`).catch(() => ({
        data: [],
        info: { page: 1, per_page: perPage, count: 0, more_records: false },
      })),
      this.request<ZohoListResponse<ZohoCall>>(`/crm/v6/Calls?${queryParams}`).catch(() => ({
        data: [],
        info: { page: 1, per_page: perPage, count: 0, more_records: false },
      })),
      this.request<ZohoListResponse<ZohoEvent>>(`/crm/v6/Events?${queryParams}`).catch(() => ({
        data: [],
        info: { page: 1, per_page: perPage, count: 0, more_records: false },
      })),
    ]);

    const activities: Activity[] = [
      ...tasksResponse.data.map((t) => this.mapZohoTask(t)),
      ...callsResponse.data.map((c) => this.mapZohoCall(c)),
      ...eventsResponse.data.map((e) => this.mapZohoEvent(e)),
    ];

    // Filter by recordId if provided
    const filtered = params?.recordId
      ? activities.filter(
          (a) =>
            a.contactIds?.includes(params.recordId!) ||
            a.companyId === params.recordId ||
            a.dealId === params.recordId
        )
      : activities;

    // Sort by created date descending
    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const totalCount =
      tasksResponse.info.count + callsResponse.info.count + eventsResponse.info.count;
    const hasMore =
      tasksResponse.info.more_records ||
      callsResponse.info.more_records ||
      eventsResponse.info.more_records;

    return {
      items: filtered,
      count: filtered.length,
      total: totalCount,
      hasMore,
      nextCursor: hasMore ? String(page + 1) : undefined,
    };
  }

  async createActivity(input: ActivityCreateInput): Promise<Activity> {
    if (input.type === 'call') {
      const contactId = input.contactIds?.[0] || '';
      return this.logCall(contactId, input.subject, input.body);
    }

    if (input.type === 'meeting') {
      const zohoData: Record<string, unknown> = {
        Event_Title: input.subject,
        Description: input.body,
      };
      if (input.contactIds && input.contactIds.length > 0) {
        zohoData.Who_Id = input.contactIds[0];
      }
      if (input.companyId) zohoData.What_Id = input.companyId;

      const response = await this.request<ZohoCreateResponse>('/crm/v6/Events', {
        method: 'POST',
        body: JSON.stringify({ data: [zohoData] }),
      });

      if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
        throw new CrmApiError(
          `Failed to create meeting: ${response.data?.[0]?.message || 'Unknown error'}`,
          400
        );
      }

      const eventResponse = await this.request<ZohoRecordResponse<ZohoEvent>>(
        `/crm/v6/Events/${response.data[0].details.id}`
      );
      return this.mapZohoEvent(eventResponse.data[0]);
    }

    // Default to task
    const zohoData: Record<string, unknown> = {
      Subject: input.subject,
      Description: input.body,
      Due_Date: input.dueDate,
      Status: 'Not Started',
    };
    if (input.contactIds && input.contactIds.length > 0) {
      zohoData.Who_Id = input.contactIds[0];
    }
    if (input.companyId) zohoData.What_Id = input.companyId;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Tasks', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(
        `Failed to create task: ${response.data?.[0]?.message || 'Unknown error'}`,
        400
      );
    }

    const taskResponse = await this.request<ZohoRecordResponse<ZohoTask>>(
      `/crm/v6/Tasks/${response.data[0].details.id}`
    );
    return this.mapZohoTask(taskResponse.data[0]);
  }

  async logCall(
    contactId: string,
    subject: string,
    notes?: string,
    durationMinutes?: number
  ): Promise<Activity> {
    const zohoData: Record<string, unknown> = {
      Subject: subject,
      Call_Type: 'Outbound',
      Description: notes,
    };
    if (durationMinutes) zohoData.Call_Duration = String(durationMinutes);
    if (contactId) zohoData.Who_Id = contactId;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Calls', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(
        `Failed to log call: ${response.data?.[0]?.message || 'Unknown error'}`,
        400
      );
    }

    const callResponse = await this.request<ZohoRecordResponse<ZohoCall>>(
      `/crm/v6/Calls/${response.data[0].details.id}`
    );
    return this.mapZohoCall(callResponse.data[0]);
  }

  async logEmail(
    contactId: string,
    subject: string,
    body: string,
    direction: 'sent' | 'received'
  ): Promise<Activity> {
    // Zoho email logging is complex - log as a Task with email details as a workaround
    const zohoData: Record<string, unknown> = {
      Subject: `Email: ${subject}`,
      Description: `Direction: ${direction}\n\n${body}`,
      Status: 'Completed',
    };
    if (contactId) zohoData.Who_Id = contactId;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Tasks', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(
        `Failed to log email: ${response.data?.[0]?.message || 'Unknown error'}`,
        400
      );
    }

    const taskResponse = await this.request<ZohoRecordResponse<ZohoTask>>(
      `/crm/v6/Tasks/${response.data[0].details.id}`
    );
    const activity = this.mapZohoTask(taskResponse.data[0]);
    // Override type to email
    return { ...activity, type: 'email' };
  }

  // ===========================================================================
  // Leads
  // ===========================================================================

  private mapZohoLead(zoho: ZohoLead): Lead {
    return {
      id: zoho.id,
      firstName: zoho.First_Name || undefined,
      lastName: zoho.Last_Name || '',
      email: zoho.Email || undefined,
      phone: zoho.Phone || undefined,
      mobile: zoho.Mobile || undefined,
      company: zoho.Company || undefined,
      title: zoho.Designation || undefined,
      website: zoho.Website || undefined,
      industry: zoho.Industry || undefined,
      annualRevenue: zoho.Annual_Revenue || undefined,
      numberOfEmployees: zoho.No_of_Employees || undefined,
      leadSource: zoho.Lead_Source || undefined,
      leadStatus: zoho.Lead_Status || undefined,
      rating: zoho.Rating || undefined,
      description: zoho.Description || undefined,
      street: zoho.Street || undefined,
      city: zoho.City || undefined,
      state: zoho.State || undefined,
      zipCode: zoho.Zip_Code || undefined,
      country: zoho.Country || undefined,
      ownerId: zoho.Owner?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listLeads(params?: PaginationParams): Promise<PaginatedResponse<Lead>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;
    const page = Math.floor(offset / limit) + 1;
    const perPage = Math.min(limit, 200);
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(perPage));
    queryParams.set('fields', 'First_Name,Last_Name,Email,Phone,Mobile,Company,Designation,Website,Industry,Annual_Revenue,No_of_Employees,Lead_Source,Lead_Status,Rating,Description,Street,City,State,Zip_Code,Country,Owner,Created_Time,Modified_Time');

    const response = await this.request<ZohoListResponse<ZohoLead>>(`/crm/v6/Leads?${queryParams}`);

    return {
      items: response.data.map((l) => this.mapZohoLead(l)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getLead(id: string): Promise<Lead> {
    const response = await this.request<ZohoRecordResponse<ZohoLead>>(`/crm/v6/Leads/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Lead not found: ${id}`, 404);
    }
    return this.mapZohoLead(response.data[0]);
  }

  async createLead(input: LeadCreateInput): Promise<Lead> {
    const zohoData: Record<string, unknown> = { Last_Name: input.lastName };
    if (input.firstName) zohoData.First_Name = input.firstName;
    if (input.email) zohoData.Email = input.email;
    if (input.phone) zohoData.Phone = input.phone;
    if (input.company) zohoData.Company = input.company;
    if (input.title) zohoData.Designation = input.title;
    if (input.website) zohoData.Website = input.website;
    if (input.industry) zohoData.Industry = input.industry;
    if (input.leadSource) zohoData.Lead_Source = input.leadSource;
    if (input.leadStatus) zohoData.Lead_Status = input.leadStatus;
    if (input.description) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Leads', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create lead: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getLead(response.data[0].details.id);
  }

  async updateLead(id: string, input: LeadUpdateInput): Promise<Lead> {
    const zohoData: Record<string, unknown> = {};
    if (input.lastName !== undefined) zohoData.Last_Name = input.lastName;
    if (input.firstName !== undefined) zohoData.First_Name = input.firstName;
    if (input.email !== undefined) zohoData.Email = input.email;
    if (input.phone !== undefined) zohoData.Phone = input.phone;
    if (input.company !== undefined) zohoData.Company = input.company;
    if (input.title !== undefined) zohoData.Designation = input.title;
    if (input.website !== undefined) zohoData.Website = input.website;
    if (input.industry !== undefined) zohoData.Industry = input.industry;
    if (input.leadSource !== undefined) zohoData.Lead_Source = input.leadSource;
    if (input.leadStatus !== undefined) zohoData.Lead_Status = input.leadStatus;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update lead: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getLead(id);
  }

  async deleteLead(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Leads?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete lead: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  async searchLeads(params: SearchParams): Promise<PaginatedResponse<Lead>> {
    const queryParams = new URLSearchParams();
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const page = Math.floor(offset / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));
    if (params.query) queryParams.set('word', params.query);

    const response = await this.request<ZohoListResponse<ZohoLead>>(`/crm/v6/Leads/search?${queryParams}`);

    return {
      items: response.data?.map((l) => this.mapZohoLead(l)) || [],
      count: response.data?.length || 0,
      total: response.info?.count || 0,
      hasMore: response.info?.more_records || false,
      nextCursor: response.info?.more_records ? String(page + 1) : undefined,
    };
  }

  async convertLead(id: string, input: LeadConvertInput): Promise<{ contact: string; account: string; deal?: string }> {
    const zohoData: Record<string, unknown> = {};
    if (input.Deals) zohoData.Deals = input.Deals;
    if (input.Accounts) zohoData.Accounts = input.Accounts;
    if (input.Contacts) zohoData.Contacts = input.Contacts;
    if (input.carryOverTags !== undefined) zohoData.carry_over_tags = input.carryOverTags;
    if (input.notifyLeadOwner !== undefined) zohoData.notify_lead_owner = input.notifyLeadOwner;
    if (input.notifyNewEntityOwner !== undefined) zohoData.notify_new_entity_owner = input.notifyNewEntityOwner;

    const response = await this.request<{ data: Array<{ Contacts: string; Accounts: string; Deals?: string }> }>(
      `/crm/v6/Leads/${id}/actions/convert`,
      { method: 'POST', body: JSON.stringify({ data: [zohoData] }) }
    );

    if (!response.data || response.data.length === 0) {
      throw new CrmApiError('Failed to convert lead', 400);
    }

    return {
      contact: response.data[0].Contacts,
      account: response.data[0].Accounts,
      deal: response.data[0].Deals,
    };
  }

  // ===========================================================================
  // Products
  // ===========================================================================

  private mapZohoProduct(zoho: ZohoProduct): Product {
    return {
      id: zoho.id,
      productName: zoho.Product_Name || '',
      productCode: zoho.Product_Code || undefined,
      productCategory: zoho.Product_Category || undefined,
      manufacturer: zoho.Manufacturer || undefined,
      vendorName: zoho.Vendor_Name?.name || undefined,
      productActive: zoho.Product_Active,
      unitPrice: zoho.Unit_Price || undefined,
      salesStartDate: zoho.Sales_Start_Date || undefined,
      salesEndDate: zoho.Sales_End_Date || undefined,
      supportStartDate: zoho.Support_Start_Date || undefined,
      supportExpiryDate: zoho.Support_Expiry_Date || undefined,
      usageUnit: zoho.Usage_Unit || undefined,
      quantityInStock: zoho.Qty_in_Stock || undefined,
      quantityInDemand: zoho.Qty_in_Demand || undefined,
      reorderLevel: zoho.Reorder_Level || undefined,
      handler: zoho.Handler?.name || undefined,
      quantityOrdered: zoho.Qty_Ordered || undefined,
      taxable: zoho.Taxable,
      commissionRate: zoho.Commission_Rate || undefined,
      description: zoho.Description || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listProducts(params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const offset = params?.offset || 0;
    const page = Math.floor(offset / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoProduct>>(`/crm/v6/Products?${queryParams}`);

    return {
      items: response.data.map((p) => this.mapZohoProduct(p)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.request<ZohoRecordResponse<ZohoProduct>>(`/crm/v6/Products/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Product not found: ${id}`, 404);
    }
    return this.mapZohoProduct(response.data[0]);
  }

  async createProduct(input: ProductCreateInput): Promise<Product> {
    const zohoData: Record<string, unknown> = { Product_Name: input.productName };
    if (input.productCode) zohoData.Product_Code = input.productCode;
    if (input.productCategory) zohoData.Product_Category = input.productCategory;
    if (input.manufacturer) zohoData.Manufacturer = input.manufacturer;
    if (input.productActive !== undefined) zohoData.Product_Active = input.productActive;
    if (input.unitPrice !== undefined) zohoData.Unit_Price = input.unitPrice;
    if (input.usageUnit) zohoData.Usage_Unit = input.usageUnit;
    if (input.taxable !== undefined) zohoData.Taxable = input.taxable;
    if (input.description) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Products', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create product: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getProduct(response.data[0].details.id);
  }

  async updateProduct(id: string, input: ProductUpdateInput): Promise<Product> {
    const zohoData: Record<string, unknown> = {};
    if (input.productName !== undefined) zohoData.Product_Name = input.productName;
    if (input.productCode !== undefined) zohoData.Product_Code = input.productCode;
    if (input.productCategory !== undefined) zohoData.Product_Category = input.productCategory;
    if (input.manufacturer !== undefined) zohoData.Manufacturer = input.manufacturer;
    if (input.productActive !== undefined) zohoData.Product_Active = input.productActive;
    if (input.unitPrice !== undefined) zohoData.Unit_Price = input.unitPrice;
    if (input.usageUnit !== undefined) zohoData.Usage_Unit = input.usageUnit;
    if (input.taxable !== undefined) zohoData.Taxable = input.taxable;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update product: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getProduct(id);
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Products?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete product: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  async searchProducts(params: SearchParams): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    const limit = params.limit || 20;
    const page = Math.floor((params.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));
    if (params.query) queryParams.set('word', params.query);

    const response = await this.request<ZohoListResponse<ZohoProduct>>(`/crm/v6/Products/search?${queryParams}`);

    return {
      items: response.data?.map((p) => this.mapZohoProduct(p)) || [],
      count: response.data?.length || 0,
      total: response.info?.count || 0,
      hasMore: response.info?.more_records || false,
      nextCursor: response.info?.more_records ? String(page + 1) : undefined,
    };
  }

  // ===========================================================================
  // Quotes
  // ===========================================================================

  private mapZohoQuote(zoho: ZohoQuote): Quote {
    return {
      id: zoho.id,
      subject: zoho.Subject || '',
      quoteNumber: zoho.Quote_Number || undefined,
      quoteStage: zoho.Quote_Stage || undefined,
      dealId: zoho.Deal_Name?.id || undefined,
      dealName: zoho.Deal_Name?.name || undefined,
      contactId: zoho.Contact_Name?.id || undefined,
      contactName: zoho.Contact_Name?.name || undefined,
      accountId: zoho.Account_Name?.id || undefined,
      accountName: zoho.Account_Name?.name || undefined,
      validUntil: zoho.Valid_Till || undefined,
      team: zoho.Team || undefined,
      carrier: zoho.Carrier || undefined,
      shippingStreet: zoho.Shipping_Street || undefined,
      shippingCity: zoho.Shipping_City || undefined,
      shippingState: zoho.Shipping_State || undefined,
      shippingCode: zoho.Shipping_Code || undefined,
      shippingCountry: zoho.Shipping_Country || undefined,
      billingStreet: zoho.Billing_Street || undefined,
      billingCity: zoho.Billing_City || undefined,
      billingState: zoho.Billing_State || undefined,
      billingCode: zoho.Billing_Code || undefined,
      billingCountry: zoho.Billing_Country || undefined,
      subTotal: zoho.Sub_Total || undefined,
      discount: zoho.Discount || undefined,
      tax: zoho.Tax || undefined,
      adjustment: zoho.Adjustment || undefined,
      grandTotal: zoho.Grand_Total || undefined,
      termsAndConditions: zoho.Terms_and_Conditions || undefined,
      description: zoho.Description || undefined,
      quotedItems: zoho.Quoted_Items?.map((item) => ({
        id: item.id,
        productId: item.Product_Name.id,
        productName: item.Product_Name.name,
        quantity: item.Quantity,
        listPrice: item.List_Price,
        unitPrice: item.Unit_Price,
        total: item.Total,
        discount: item.Discount,
        netTotal: item.Net_Total,
        tax: item.Tax,
      })),
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listQuotes(params?: PaginationParams): Promise<PaginatedResponse<Quote>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoQuote>>(`/crm/v6/Quotes?${queryParams}`);

    return {
      items: response.data.map((q) => this.mapZohoQuote(q)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getQuote(id: string): Promise<Quote> {
    const response = await this.request<ZohoRecordResponse<ZohoQuote>>(`/crm/v6/Quotes/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Quote not found: ${id}`, 404);
    }
    return this.mapZohoQuote(response.data[0]);
  }

  async createQuote(input: QuoteCreateInput): Promise<Quote> {
    const zohoData: Record<string, unknown> = { Subject: input.subject };
    if (input.dealId) zohoData.Deal_Name = { id: input.dealId };
    if (input.contactId) zohoData.Contact_Name = { id: input.contactId };
    if (input.accountId) zohoData.Account_Name = { id: input.accountId };
    if (input.validUntil) zohoData.Valid_Till = input.validUntil;
    if (input.quoteStage) zohoData.Quote_Stage = input.quoteStage;
    if (input.termsAndConditions) zohoData.Terms_and_Conditions = input.termsAndConditions;
    if (input.description) zohoData.Description = input.description;
    if (input.quotedItems) {
      zohoData.Quoted_Items = input.quotedItems.map((item) => ({
        Product_Name: { id: item.productId },
        Quantity: item.quantity,
        List_Price: item.listPrice,
        Unit_Price: item.unitPrice,
        Discount: item.discount,
      }));
    }

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Quotes', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create quote: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getQuote(response.data[0].details.id);
  }

  async updateQuote(id: string, input: QuoteUpdateInput): Promise<Quote> {
    const zohoData: Record<string, unknown> = {};
    if (input.subject !== undefined) zohoData.Subject = input.subject;
    if (input.dealId !== undefined) zohoData.Deal_Name = { id: input.dealId };
    if (input.contactId !== undefined) zohoData.Contact_Name = { id: input.contactId };
    if (input.accountId !== undefined) zohoData.Account_Name = { id: input.accountId };
    if (input.validUntil !== undefined) zohoData.Valid_Till = input.validUntil;
    if (input.quoteStage !== undefined) zohoData.Quote_Stage = input.quoteStage;
    if (input.termsAndConditions !== undefined) zohoData.Terms_and_Conditions = input.termsAndConditions;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update quote: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getQuote(id);
  }

  async deleteQuote(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Quotes?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete quote: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  async searchQuotes(params: SearchParams): Promise<PaginatedResponse<Quote>> {
    const queryParams = new URLSearchParams();
    const limit = params.limit || 20;
    const page = Math.floor((params.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));
    if (params.query) queryParams.set('word', params.query);

    const response = await this.request<ZohoListResponse<ZohoQuote>>(`/crm/v6/Quotes/search?${queryParams}`);

    return {
      items: response.data?.map((q) => this.mapZohoQuote(q)) || [],
      count: response.data?.length || 0,
      total: response.info?.count || 0,
      hasMore: response.info?.more_records || false,
      nextCursor: response.info?.more_records ? String(page + 1) : undefined,
    };
  }

  // ===========================================================================
  // Sales Orders
  // ===========================================================================

  private mapZohoSalesOrder(zoho: ZohoSalesOrder): SalesOrder {
    return {
      id: zoho.id,
      subject: zoho.Subject || '',
      soNumber: zoho.SO_Number || undefined,
      status: zoho.Status || undefined,
      dealId: zoho.Deal_Name?.id || undefined,
      dealName: zoho.Deal_Name?.name || undefined,
      contactId: zoho.Contact_Name?.id || undefined,
      contactName: zoho.Contact_Name?.name || undefined,
      accountId: zoho.Account_Name?.id || undefined,
      accountName: zoho.Account_Name?.name || undefined,
      quoteId: zoho.Quote_Name?.id || undefined,
      quoteName: zoho.Quote_Name?.name || undefined,
      dueDate: zoho.Due_Date || undefined,
      carrier: zoho.Carrier || undefined,
      pending: zoho.Pending || undefined,
      exciseDuty: zoho.Excise_Duty || undefined,
      salesCommission: zoho.Sales_Commission || undefined,
      subTotal: zoho.Sub_Total || undefined,
      discount: zoho.Discount || undefined,
      tax: zoho.Tax || undefined,
      adjustment: zoho.Adjustment || undefined,
      grandTotal: zoho.Grand_Total || undefined,
      orderedItems: zoho.Ordered_Items?.map((item) => ({
        productId: item.Product_Name.id,
        productName: item.Product_Name.name,
        quantity: item.Quantity,
        listPrice: item.List_Price,
        unitPrice: item.Unit_Price,
        total: item.Total,
        discount: item.Discount,
      })),
      termsAndConditions: zoho.Terms_and_Conditions || undefined,
      description: zoho.Description || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listSalesOrders(params?: PaginationParams): Promise<PaginatedResponse<SalesOrder>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoSalesOrder>>(`/crm/v6/Sales_Orders?${queryParams}`);

    return {
      items: response.data.map((so) => this.mapZohoSalesOrder(so)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getSalesOrder(id: string): Promise<SalesOrder> {
    const response = await this.request<ZohoRecordResponse<ZohoSalesOrder>>(`/crm/v6/Sales_Orders/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Sales order not found: ${id}`, 404);
    }
    return this.mapZohoSalesOrder(response.data[0]);
  }

  async createSalesOrder(input: SalesOrderCreateInput): Promise<SalesOrder> {
    const zohoData: Record<string, unknown> = { Subject: input.subject };
    if (input.dealId) zohoData.Deal_Name = { id: input.dealId };
    if (input.contactId) zohoData.Contact_Name = { id: input.contactId };
    if (input.accountId) zohoData.Account_Name = { id: input.accountId };
    if (input.quoteId) zohoData.Quote_Name = { id: input.quoteId };
    if (input.status) zohoData.Status = input.status;
    if (input.dueDate) zohoData.Due_Date = input.dueDate;
    if (input.description) zohoData.Description = input.description;
    if (input.orderedItems) {
      zohoData.Ordered_Items = input.orderedItems.map((item) => ({
        Product_Name: { id: item.productId },
        Quantity: item.quantity,
        List_Price: item.listPrice,
        Unit_Price: item.unitPrice,
        Discount: item.discount,
      }));
    }

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Sales_Orders', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create sales order: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getSalesOrder(response.data[0].details.id);
  }

  async updateSalesOrder(id: string, input: SalesOrderUpdateInput): Promise<SalesOrder> {
    const zohoData: Record<string, unknown> = {};
    if (input.subject !== undefined) zohoData.Subject = input.subject;
    if (input.status !== undefined) zohoData.Status = input.status;
    if (input.dueDate !== undefined) zohoData.Due_Date = input.dueDate;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Sales_Orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update sales order: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getSalesOrder(id);
  }

  async deleteSalesOrder(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Sales_Orders?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete sales order: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  // ===========================================================================
  // Purchase Orders
  // ===========================================================================

  private mapZohoPurchaseOrder(zoho: ZohoPurchaseOrder): PurchaseOrder {
    return {
      id: zoho.id,
      subject: zoho.Subject || '',
      poNumber: zoho.PO_Number || undefined,
      status: zoho.Status || undefined,
      vendorId: zoho.Vendor_Name?.id || undefined,
      vendorName: zoho.Vendor_Name?.name || undefined,
      contactId: zoho.Contact_Name?.id || undefined,
      contactName: zoho.Contact_Name?.name || undefined,
      dueDate: zoho.Due_Date || undefined,
      carrier: zoho.Carrier || undefined,
      requisitionNo: zoho.Requisition_No || undefined,
      trackingNumber: zoho.Tracking_Number || undefined,
      salesCommission: zoho.Sales_Commission || undefined,
      exciseDuty: zoho.Excise_Duty || undefined,
      subTotal: zoho.Sub_Total || undefined,
      discount: zoho.Discount || undefined,
      tax: zoho.Tax || undefined,
      adjustment: zoho.Adjustment || undefined,
      grandTotal: zoho.Grand_Total || undefined,
      orderedItems: zoho.Ordered_Items?.map((item) => ({
        productId: item.Product_Name.id,
        productName: item.Product_Name.name,
        quantity: item.Quantity,
        listPrice: item.List_Price,
        unitPrice: item.Unit_Price,
        total: item.Total,
        discount: item.Discount,
      })),
      termsAndConditions: zoho.Terms_and_Conditions || undefined,
      description: zoho.Description || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listPurchaseOrders(params?: PaginationParams): Promise<PaginatedResponse<PurchaseOrder>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoPurchaseOrder>>(`/crm/v6/Purchase_Orders?${queryParams}`);

    return {
      items: response.data.map((po) => this.mapZohoPurchaseOrder(po)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getPurchaseOrder(id: string): Promise<PurchaseOrder> {
    const response = await this.request<ZohoRecordResponse<ZohoPurchaseOrder>>(`/crm/v6/Purchase_Orders/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Purchase order not found: ${id}`, 404);
    }
    return this.mapZohoPurchaseOrder(response.data[0]);
  }

  async createPurchaseOrder(input: PurchaseOrderCreateInput): Promise<PurchaseOrder> {
    const zohoData: Record<string, unknown> = {
      Subject: input.subject,
      Vendor_Name: { id: input.vendorId },
    };
    if (input.contactId) zohoData.Contact_Name = { id: input.contactId };
    if (input.status) zohoData.Status = input.status;
    if (input.dueDate) zohoData.Due_Date = input.dueDate;
    if (input.description) zohoData.Description = input.description;
    if (input.orderedItems) {
      zohoData.Ordered_Items = input.orderedItems.map((item) => ({
        Product_Name: { id: item.productId },
        Quantity: item.quantity,
        List_Price: item.listPrice,
        Unit_Price: item.unitPrice,
        Discount: item.discount,
      }));
    }

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Purchase_Orders', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create purchase order: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getPurchaseOrder(response.data[0].details.id);
  }

  async updatePurchaseOrder(id: string, input: PurchaseOrderUpdateInput): Promise<PurchaseOrder> {
    const zohoData: Record<string, unknown> = {};
    if (input.subject !== undefined) zohoData.Subject = input.subject;
    if (input.vendorId !== undefined) zohoData.Vendor_Name = { id: input.vendorId };
    if (input.status !== undefined) zohoData.Status = input.status;
    if (input.dueDate !== undefined) zohoData.Due_Date = input.dueDate;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Purchase_Orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update purchase order: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getPurchaseOrder(id);
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Purchase_Orders?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete purchase order: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  // ===========================================================================
  // Invoices
  // ===========================================================================

  private mapZohoInvoice(zoho: ZohoInvoice): Invoice {
    return {
      id: zoho.id,
      subject: zoho.Subject || '',
      invoiceNumber: zoho.Invoice_Number || undefined,
      status: zoho.Status || undefined,
      salesOrderId: zoho.Sales_Order?.id || undefined,
      salesOrderName: zoho.Sales_Order?.name || undefined,
      dealId: zoho.Deal_Name?.id || undefined,
      dealName: zoho.Deal_Name?.name || undefined,
      contactId: zoho.Contact_Name?.id || undefined,
      contactName: zoho.Contact_Name?.name || undefined,
      accountId: zoho.Account_Name?.id || undefined,
      accountName: zoho.Account_Name?.name || undefined,
      invoiceDate: zoho.Invoice_Date || undefined,
      dueDate: zoho.Due_Date || undefined,
      salesCommission: zoho.Sales_Commission || undefined,
      exciseDuty: zoho.Excise_Duty || undefined,
      subTotal: zoho.Sub_Total || undefined,
      discount: zoho.Discount || undefined,
      tax: zoho.Tax || undefined,
      adjustment: zoho.Adjustment || undefined,
      grandTotal: zoho.Grand_Total || undefined,
      invoicedItems: zoho.Invoiced_Items?.map((item) => ({
        productId: item.Product_Name.id,
        productName: item.Product_Name.name,
        quantity: item.Quantity,
        listPrice: item.List_Price,
        unitPrice: item.Unit_Price,
        total: item.Total,
        discount: item.Discount,
      })),
      termsAndConditions: zoho.Terms_and_Conditions || undefined,
      description: zoho.Description || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listInvoices(params?: PaginationParams): Promise<PaginatedResponse<Invoice>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoInvoice>>(`/crm/v6/Invoices?${queryParams}`);

    return {
      items: response.data.map((inv) => this.mapZohoInvoice(inv)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getInvoice(id: string): Promise<Invoice> {
    const response = await this.request<ZohoRecordResponse<ZohoInvoice>>(`/crm/v6/Invoices/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Invoice not found: ${id}`, 404);
    }
    return this.mapZohoInvoice(response.data[0]);
  }

  async createInvoice(input: InvoiceCreateInput): Promise<Invoice> {
    const zohoData: Record<string, unknown> = { Subject: input.subject };
    if (input.salesOrderId) zohoData.Sales_Order = { id: input.salesOrderId };
    if (input.dealId) zohoData.Deal_Name = { id: input.dealId };
    if (input.contactId) zohoData.Contact_Name = { id: input.contactId };
    if (input.accountId) zohoData.Account_Name = { id: input.accountId };
    if (input.status) zohoData.Status = input.status;
    if (input.invoiceDate) zohoData.Invoice_Date = input.invoiceDate;
    if (input.dueDate) zohoData.Due_Date = input.dueDate;
    if (input.description) zohoData.Description = input.description;
    if (input.invoicedItems) {
      zohoData.Invoiced_Items = input.invoicedItems.map((item) => ({
        Product_Name: { id: item.productId },
        Quantity: item.quantity,
        List_Price: item.listPrice,
        Unit_Price: item.unitPrice,
        Discount: item.discount,
      }));
    }

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Invoices', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create invoice: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getInvoice(response.data[0].details.id);
  }

  async updateInvoice(id: string, input: InvoiceUpdateInput): Promise<Invoice> {
    const zohoData: Record<string, unknown> = {};
    if (input.subject !== undefined) zohoData.Subject = input.subject;
    if (input.status !== undefined) zohoData.Status = input.status;
    if (input.invoiceDate !== undefined) zohoData.Invoice_Date = input.invoiceDate;
    if (input.dueDate !== undefined) zohoData.Due_Date = input.dueDate;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update invoice: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getInvoice(id);
  }

  async deleteInvoice(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Invoices?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete invoice: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  async searchInvoices(params: SearchParams): Promise<PaginatedResponse<Invoice>> {
    const queryParams = new URLSearchParams();
    const limit = params.limit || 20;
    const page = Math.floor((params.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));
    if (params.query) queryParams.set('word', params.query);

    const response = await this.request<ZohoListResponse<ZohoInvoice>>(`/crm/v6/Invoices/search?${queryParams}`);

    return {
      items: response.data?.map((inv) => this.mapZohoInvoice(inv)) || [],
      count: response.data?.length || 0,
      total: response.info?.count || 0,
      hasMore: response.info?.more_records || false,
      nextCursor: response.info?.more_records ? String(page + 1) : undefined,
    };
  }

  // ===========================================================================
  // Vendors
  // ===========================================================================

  private mapZohoVendor(zoho: ZohoVendor): Vendor {
    return {
      id: zoho.id,
      vendorName: zoho.Vendor_Name || '',
      email: zoho.Email || undefined,
      phone: zoho.Phone || undefined,
      website: zoho.Website || undefined,
      category: zoho.Category || undefined,
      glAccount: zoho.GL_Account || undefined,
      street: zoho.Street || undefined,
      city: zoho.City || undefined,
      state: zoho.State || undefined,
      zipCode: zoho.Zip_Code || undefined,
      country: zoho.Country || undefined,
      description: zoho.Description || undefined,
      ownerId: zoho.Owner?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listVendors(params?: PaginationParams): Promise<PaginatedResponse<Vendor>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoVendor>>(`/crm/v6/Vendors?${queryParams}`);

    return {
      items: response.data.map((v) => this.mapZohoVendor(v)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getVendor(id: string): Promise<Vendor> {
    const response = await this.request<ZohoRecordResponse<ZohoVendor>>(`/crm/v6/Vendors/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Vendor not found: ${id}`, 404);
    }
    return this.mapZohoVendor(response.data[0]);
  }

  async createVendor(input: VendorCreateInput): Promise<Vendor> {
    const zohoData: Record<string, unknown> = { Vendor_Name: input.vendorName };
    if (input.email) zohoData.Email = input.email;
    if (input.phone) zohoData.Phone = input.phone;
    if (input.website) zohoData.Website = input.website;
    if (input.category) zohoData.Category = input.category;
    if (input.description) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Vendors', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create vendor: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getVendor(response.data[0].details.id);
  }

  async updateVendor(id: string, input: VendorUpdateInput): Promise<Vendor> {
    const zohoData: Record<string, unknown> = {};
    if (input.vendorName !== undefined) zohoData.Vendor_Name = input.vendorName;
    if (input.email !== undefined) zohoData.Email = input.email;
    if (input.phone !== undefined) zohoData.Phone = input.phone;
    if (input.website !== undefined) zohoData.Website = input.website;
    if (input.category !== undefined) zohoData.Category = input.category;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update vendor: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getVendor(id);
  }

  async deleteVendor(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Vendors?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete vendor: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  async searchVendors(params: SearchParams): Promise<PaginatedResponse<Vendor>> {
    const queryParams = new URLSearchParams();
    const limit = params.limit || 20;
    const page = Math.floor((params.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));
    if (params.query) queryParams.set('word', params.query);

    const response = await this.request<ZohoListResponse<ZohoVendor>>(`/crm/v6/Vendors/search?${queryParams}`);

    return {
      items: response.data?.map((v) => this.mapZohoVendor(v)) || [],
      count: response.data?.length || 0,
      total: response.info?.count || 0,
      hasMore: response.info?.more_records || false,
      nextCursor: response.info?.more_records ? String(page + 1) : undefined,
    };
  }

  // ===========================================================================
  // Price Books
  // ===========================================================================

  private mapZohoPriceBook(zoho: ZohoPriceBook): PriceBook {
    return {
      id: zoho.id,
      priceBookName: zoho.Price_Book_Name || '',
      pricingModel: zoho.Pricing_Model as 'Flat' | 'Differential' | undefined,
      pricingDetails: zoho.Pricing_Details?.map((d) => ({
        id: d.id,
        fromRange: d.from_range,
        toRange: d.to_range,
        discount: d.discount,
      })),
      active: zoho.Active,
      description: zoho.Description || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listPriceBooks(params?: PaginationParams): Promise<PaginatedResponse<PriceBook>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoPriceBook>>(`/crm/v6/Price_Books?${queryParams}`);

    return {
      items: response.data.map((pb) => this.mapZohoPriceBook(pb)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getPriceBook(id: string): Promise<PriceBook> {
    const response = await this.request<ZohoRecordResponse<ZohoPriceBook>>(`/crm/v6/Price_Books/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Price book not found: ${id}`, 404);
    }
    return this.mapZohoPriceBook(response.data[0]);
  }

  async createPriceBook(input: PriceBookCreateInput): Promise<PriceBook> {
    const zohoData: Record<string, unknown> = { Price_Book_Name: input.priceBookName };
    if (input.pricingModel) zohoData.Pricing_Model = input.pricingModel;
    if (input.active !== undefined) zohoData.Active = input.active;
    if (input.description) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Price_Books', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create price book: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getPriceBook(response.data[0].details.id);
  }

  async updatePriceBook(id: string, input: PriceBookUpdateInput): Promise<PriceBook> {
    const zohoData: Record<string, unknown> = {};
    if (input.priceBookName !== undefined) zohoData.Price_Book_Name = input.priceBookName;
    if (input.pricingModel !== undefined) zohoData.Pricing_Model = input.pricingModel;
    if (input.active !== undefined) zohoData.Active = input.active;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Price_Books/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update price book: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getPriceBook(id);
  }

  async deletePriceBook(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Price_Books?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete price book: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  // ===========================================================================
  // Campaigns
  // ===========================================================================

  private mapZohoCampaign(zoho: ZohoCampaign): Campaign {
    return {
      id: zoho.id,
      campaignName: zoho.Campaign_Name || '',
      type: zoho.Type || undefined,
      status: zoho.Status || undefined,
      startDate: zoho.Start_Date || undefined,
      endDate: zoho.End_Date || undefined,
      expectedRevenue: zoho.Expected_Revenue || undefined,
      budgetedCost: zoho.Budgeted_Cost || undefined,
      actualCost: zoho.Actual_Cost || undefined,
      expectedResponse: zoho.Expected_Response || undefined,
      numSent: zoho.Num_sent || undefined,
      parentCampaign: zoho.Parent_Campaign?.name || undefined,
      description: zoho.Description || undefined,
      ownerId: zoho.Owner?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listCampaigns(params?: PaginationParams): Promise<PaginatedResponse<Campaign>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoCampaign>>(`/crm/v6/Campaigns?${queryParams}`);

    return {
      items: response.data.map((c) => this.mapZohoCampaign(c)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getCampaign(id: string): Promise<Campaign> {
    const response = await this.request<ZohoRecordResponse<ZohoCampaign>>(`/crm/v6/Campaigns/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Campaign not found: ${id}`, 404);
    }
    return this.mapZohoCampaign(response.data[0]);
  }

  async createCampaign(input: CampaignCreateInput): Promise<Campaign> {
    const zohoData: Record<string, unknown> = { Campaign_Name: input.campaignName };
    if (input.type) zohoData.Type = input.type;
    if (input.status) zohoData.Status = input.status;
    if (input.startDate) zohoData.Start_Date = input.startDate;
    if (input.endDate) zohoData.End_Date = input.endDate;
    if (input.expectedRevenue !== undefined) zohoData.Expected_Revenue = input.expectedRevenue;
    if (input.budgetedCost !== undefined) zohoData.Budgeted_Cost = input.budgetedCost;
    if (input.description) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Campaigns', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create campaign: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getCampaign(response.data[0].details.id);
  }

  async updateCampaign(id: string, input: CampaignUpdateInput): Promise<Campaign> {
    const zohoData: Record<string, unknown> = {};
    if (input.campaignName !== undefined) zohoData.Campaign_Name = input.campaignName;
    if (input.type !== undefined) zohoData.Type = input.type;
    if (input.status !== undefined) zohoData.Status = input.status;
    if (input.startDate !== undefined) zohoData.Start_Date = input.startDate;
    if (input.endDate !== undefined) zohoData.End_Date = input.endDate;
    if (input.expectedRevenue !== undefined) zohoData.Expected_Revenue = input.expectedRevenue;
    if (input.budgetedCost !== undefined) zohoData.Budgeted_Cost = input.budgetedCost;
    if (input.actualCost !== undefined) zohoData.Actual_Cost = input.actualCost;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update campaign: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getCampaign(id);
  }

  async deleteCampaign(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Campaigns?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete campaign: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  async searchCampaigns(params: SearchParams): Promise<PaginatedResponse<Campaign>> {
    const queryParams = new URLSearchParams();
    const limit = params.limit || 20;
    const page = Math.floor((params.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));
    if (params.query) queryParams.set('word', params.query);

    const response = await this.request<ZohoListResponse<ZohoCampaign>>(`/crm/v6/Campaigns/search?${queryParams}`);

    return {
      items: response.data?.map((c) => this.mapZohoCampaign(c)) || [],
      count: response.data?.length || 0,
      total: response.info?.count || 0,
      hasMore: response.info?.more_records || false,
      nextCursor: response.info?.more_records ? String(page + 1) : undefined,
    };
  }

  // ===========================================================================
  // Cases
  // ===========================================================================

  private mapZohoCase(zoho: ZohoCase): Case {
    return {
      id: zoho.id,
      subject: zoho.Subject || '',
      caseNumber: zoho.Case_Number || undefined,
      status: zoho.Status || undefined,
      type: zoho.Type || undefined,
      priority: zoho.Priority || undefined,
      origin: zoho.Case_Origin || undefined,
      reason: zoho.Case_Reason || undefined,
      reportedBy: zoho.Reported_By || undefined,
      accountId: zoho.Account_Name?.id || undefined,
      accountName: zoho.Account_Name?.name || undefined,
      contactId: zoho.Contact_Name?.id || undefined,
      contactName: zoho.Contact_Name?.name || undefined,
      dealId: zoho.Deal_Name?.id || undefined,
      dealName: zoho.Deal_Name?.name || undefined,
      productId: zoho.Product_Name?.id || undefined,
      productName: zoho.Product_Name?.name || undefined,
      email: zoho.Email || undefined,
      phone: zoho.Phone || undefined,
      solution: zoho.Solution || undefined,
      internalComments: zoho.Internal_Comments || undefined,
      description: zoho.Description || undefined,
      ownerId: zoho.Owner?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listCases(params?: PaginationParams): Promise<PaginatedResponse<Case>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoCase>>(`/crm/v6/Cases?${queryParams}`);

    return {
      items: response.data.map((c) => this.mapZohoCase(c)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getCase(id: string): Promise<Case> {
    const response = await this.request<ZohoRecordResponse<ZohoCase>>(`/crm/v6/Cases/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Case not found: ${id}`, 404);
    }
    return this.mapZohoCase(response.data[0]);
  }

  async createCase(input: CaseCreateInput): Promise<Case> {
    const zohoData: Record<string, unknown> = { Subject: input.subject };
    if (input.status) zohoData.Status = input.status;
    if (input.type) zohoData.Type = input.type;
    if (input.priority) zohoData.Priority = input.priority;
    if (input.origin) zohoData.Case_Origin = input.origin;
    if (input.accountId) zohoData.Account_Name = { id: input.accountId };
    if (input.contactId) zohoData.Contact_Name = { id: input.contactId };
    if (input.description) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Cases', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create case: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getCase(response.data[0].details.id);
  }

  async updateCase(id: string, input: CaseUpdateInput): Promise<Case> {
    const zohoData: Record<string, unknown> = {};
    if (input.subject !== undefined) zohoData.Subject = input.subject;
    if (input.status !== undefined) zohoData.Status = input.status;
    if (input.type !== undefined) zohoData.Type = input.type;
    if (input.priority !== undefined) zohoData.Priority = input.priority;
    if (input.origin !== undefined) zohoData.Case_Origin = input.origin;
    if (input.solution !== undefined) zohoData.Solution = input.solution;
    if (input.internalComments !== undefined) zohoData.Internal_Comments = input.internalComments;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update case: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getCase(id);
  }

  async deleteCase(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Cases?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete case: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  async searchCases(params: SearchParams): Promise<PaginatedResponse<Case>> {
    const queryParams = new URLSearchParams();
    const limit = params.limit || 20;
    const page = Math.floor((params.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));
    if (params.query) queryParams.set('word', params.query);

    const response = await this.request<ZohoListResponse<ZohoCase>>(`/crm/v6/Cases/search?${queryParams}`);

    return {
      items: response.data?.map((c) => this.mapZohoCase(c)) || [],
      count: response.data?.length || 0,
      total: response.info?.count || 0,
      hasMore: response.info?.more_records || false,
      nextCursor: response.info?.more_records ? String(page + 1) : undefined,
    };
  }

  // ===========================================================================
  // Solutions
  // ===========================================================================

  private mapZohoSolution(zoho: ZohoSolution): Solution {
    return {
      id: zoho.id,
      solutionTitle: zoho.Solution_Title || '',
      solutionNumber: zoho.Solution_Number || undefined,
      status: zoho.Status || undefined,
      productId: zoho.Product_Name?.id || undefined,
      productName: zoho.Product_Name?.name || undefined,
      question: zoho.Question || undefined,
      answer: zoho.Answer || undefined,
      addToKnowledgeBase: zoho.Add_to_Knowledge_Base,
      noOfComments: zoho.No_of_comments || undefined,
      ownerId: zoho.Owner?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listSolutions(params?: PaginationParams): Promise<PaginatedResponse<Solution>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoSolution>>(`/crm/v6/Solutions?${queryParams}`);

    return {
      items: response.data.map((s) => this.mapZohoSolution(s)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getSolution(id: string): Promise<Solution> {
    const response = await this.request<ZohoRecordResponse<ZohoSolution>>(`/crm/v6/Solutions/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Solution not found: ${id}`, 404);
    }
    return this.mapZohoSolution(response.data[0]);
  }

  async createSolution(input: SolutionCreateInput): Promise<Solution> {
    const zohoData: Record<string, unknown> = { Solution_Title: input.solutionTitle };
    if (input.status) zohoData.Status = input.status;
    if (input.productId) zohoData.Product_Name = { id: input.productId };
    if (input.question) zohoData.Question = input.question;
    if (input.answer) zohoData.Answer = input.answer;
    if (input.addToKnowledgeBase !== undefined) zohoData.Add_to_Knowledge_Base = input.addToKnowledgeBase;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Solutions', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create solution: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getSolution(response.data[0].details.id);
  }

  async updateSolution(id: string, input: SolutionUpdateInput): Promise<Solution> {
    const zohoData: Record<string, unknown> = {};
    if (input.solutionTitle !== undefined) zohoData.Solution_Title = input.solutionTitle;
    if (input.status !== undefined) zohoData.Status = input.status;
    if (input.question !== undefined) zohoData.Question = input.question;
    if (input.answer !== undefined) zohoData.Answer = input.answer;
    if (input.addToKnowledgeBase !== undefined) zohoData.Add_to_Knowledge_Base = input.addToKnowledgeBase;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Solutions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update solution: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getSolution(id);
  }

  async deleteSolution(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Solutions?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete solution: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  async searchSolutions(params: SearchParams): Promise<PaginatedResponse<Solution>> {
    const queryParams = new URLSearchParams();
    const limit = params.limit || 20;
    const page = Math.floor((params.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));
    if (params.query) queryParams.set('word', params.query);

    const response = await this.request<ZohoListResponse<ZohoSolution>>(`/crm/v6/Solutions/search?${queryParams}`);

    return {
      items: response.data?.map((s) => this.mapZohoSolution(s)) || [],
      count: response.data?.length || 0,
      total: response.info?.count || 0,
      hasMore: response.info?.more_records || false,
      nextCursor: response.info?.more_records ? String(page + 1) : undefined,
    };
  }

  // ===========================================================================
  // Events
  // ===========================================================================

  private mapZohoEventToEntity(zoho: ZohoEventRecord): ZohoEvent {
    return {
      id: zoho.id,
      eventTitle: zoho.Event_Title || '',
      allDay: zoho.All_day,
      startDateTime: zoho.Start_DateTime || '',
      endDateTime: zoho.End_DateTime || '',
      location: zoho.Location || undefined,
      venue: zoho.Venue || undefined,
      whatId: zoho.What_Id?.id || undefined,
      whatName: zoho.What_Id?.name || undefined,
      whoId: zoho.Who_Id?.id || undefined,
      whoName: zoho.Who_Id?.name || undefined,
      participants: zoho.Participants?.map((p) => ({
        participant: p.participant,
        type: p.type as 'user' | 'contact' | 'lead',
        status: p.status,
      })),
      remindAt: zoho.Remind_At || undefined,
      recurringActivity: zoho.Recurring_Activity,
      description: zoho.Description || undefined,
      ownerId: zoho.Owner?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listEvents(params?: PaginationParams): Promise<PaginatedResponse<ZohoEvent>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoEventRecord>>(`/crm/v6/Events?${queryParams}`);

    return {
      items: response.data.map((e) => this.mapZohoEventToEntity(e)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getEvent(id: string): Promise<ZohoEvent> {
    const response = await this.request<ZohoRecordResponse<ZohoEventRecord>>(`/crm/v6/Events/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Event not found: ${id}`, 404);
    }
    return this.mapZohoEventToEntity(response.data[0]);
  }

  async createEvent(input: EventCreateInput): Promise<ZohoEvent> {
    const zohoData: Record<string, unknown> = {
      Event_Title: input.eventTitle,
      Start_DateTime: input.startDateTime,
      End_DateTime: input.endDateTime,
    };
    if (input.allDay !== undefined) zohoData.All_day = input.allDay;
    if (input.location) zohoData.Location = input.location;
    if (input.whatId) zohoData.What_Id = { id: input.whatId };
    if (input.whoId) zohoData.Who_Id = { id: input.whoId };
    if (input.remindAt) zohoData.Remind_At = input.remindAt;
    if (input.description) zohoData.Description = input.description;
    if (input.participants) zohoData.Participants = input.participants;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Events', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create event: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getEvent(response.data[0].details.id);
  }

  async updateEvent(id: string, input: EventUpdateInput): Promise<ZohoEvent> {
    const zohoData: Record<string, unknown> = {};
    if (input.eventTitle !== undefined) zohoData.Event_Title = input.eventTitle;
    if (input.startDateTime !== undefined) zohoData.Start_DateTime = input.startDateTime;
    if (input.endDateTime !== undefined) zohoData.End_DateTime = input.endDateTime;
    if (input.allDay !== undefined) zohoData.All_day = input.allDay;
    if (input.location !== undefined) zohoData.Location = input.location;
    if (input.whatId !== undefined) zohoData.What_Id = { id: input.whatId };
    if (input.whoId !== undefined) zohoData.Who_Id = { id: input.whoId };
    if (input.remindAt !== undefined) zohoData.Remind_At = input.remindAt;
    if (input.description !== undefined) zohoData.Description = input.description;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Events/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update event: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getEvent(id);
  }

  async deleteEvent(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Events?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete event: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  async searchEvents(params: SearchParams): Promise<PaginatedResponse<ZohoEvent>> {
    const queryParams = new URLSearchParams();
    const limit = params.limit || 20;
    const page = Math.floor((params.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));
    if (params.query) queryParams.set('word', params.query);

    const response = await this.request<ZohoListResponse<ZohoEventRecord>>(`/crm/v6/Events/search?${queryParams}`);

    return {
      items: response.data?.map((e) => this.mapZohoEventToEntity(e)) || [],
      count: response.data?.length || 0,
      total: response.info?.count || 0,
      hasMore: response.info?.more_records || false,
      nextCursor: response.info?.more_records ? String(page + 1) : undefined,
    };
  }

  // ===========================================================================
  // Notes
  // ===========================================================================

  private mapZohoNote(zoho: ZohoNote): Note {
    return {
      id: zoho.id,
      noteTitle: zoho.Note_Title || undefined,
      noteContent: zoho.Note_Content || '',
      parentModule: zoho.Parent_Id?.module || undefined,
      parentId: zoho.Parent_Id?.id || undefined,
      voiceNote: zoho.Voice_Note,
      ownerId: zoho.Owner?.id || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listNotes(params?: PaginationParams): Promise<PaginatedResponse<Note>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoNote>>(`/crm/v6/Notes?${queryParams}`);

    return {
      items: response.data.map((n) => this.mapZohoNote(n)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async getNote(id: string): Promise<Note> {
    const response = await this.request<ZohoRecordResponse<ZohoNote>>(`/crm/v6/Notes/${id}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Note not found: ${id}`, 404);
    }
    return this.mapZohoNote(response.data[0]);
  }

  async createNote(input: NoteCreateInput): Promise<Note> {
    const zohoData: Record<string, unknown> = {
      Note_Content: input.noteContent,
      Parent_Id: { module: input.parentModule, id: input.parentId },
    };
    if (input.noteTitle) zohoData.Note_Title = input.noteTitle;

    const response = await this.request<ZohoCreateResponse>('/crm/v6/Notes', {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to create note: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getNote(response.data[0].details.id);
  }

  async updateNote(id: string, input: NoteUpdateInput): Promise<Note> {
    const zohoData: Record<string, unknown> = {};
    if (input.noteTitle !== undefined) zohoData.Note_Title = input.noteTitle;
    if (input.noteContent !== undefined) zohoData.Note_Content = input.noteContent;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/Notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to update note: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getNote(id);
  }

  async deleteNote(id: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/Notes?ids=${id}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete note: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  async listRecordNotes(module: string, recordId: string, params?: PaginationParams): Promise<PaginatedResponse<Note>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoNote>>(`/crm/v6/${module}/${recordId}/Notes?${queryParams}`);

    return {
      items: response.data.map((n) => this.mapZohoNote(n)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async addNoteToRecord(module: string, recordId: string, input: NoteCreateInput): Promise<Note> {
    const zohoData: Record<string, unknown> = { Note_Content: input.noteContent };
    if (input.noteTitle) zohoData.Note_Title = input.noteTitle;

    const response = await this.request<ZohoCreateResponse>(`/crm/v6/${module}/${recordId}/Notes`, {
      method: 'POST',
      body: JSON.stringify({ data: [zohoData] }),
    });

    if (!response.data || response.data.length === 0 || response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to add note to record: ${response.data?.[0]?.message || 'Unknown error'}`, 400);
    }

    return this.getNote(response.data[0].details.id);
  }

  // ===========================================================================
  // Attachments
  // ===========================================================================

  private mapZohoAttachment(zoho: ZohoAttachment): Attachment {
    return {
      id: zoho.id,
      fileName: zoho.File_Name || '',
      fileId: zoho.File_Id || undefined,
      size: zoho.Size || undefined,
      parentModule: zoho.Parent_Id?.module || undefined,
      parentId: zoho.Parent_Id?.id || undefined,
      attachmentType: zoho.Attachment_Type || undefined,
      createdAt: zoho.Created_Time || undefined,
      updatedAt: zoho.Modified_Time || undefined,
    };
  }

  async listAttachments(module: string, recordId: string, params?: PaginationParams): Promise<PaginatedResponse<Attachment>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<ZohoAttachment>>(`/crm/v6/${module}/${recordId}/Attachments?${queryParams}`);

    return {
      items: response.data.map((a) => this.mapZohoAttachment(a)),
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async deleteAttachment(module: string, recordId: string, attachmentId: string): Promise<void> {
    const response = await this.request<ZohoDeleteResponse>(`/crm/v6/${module}/${recordId}/Attachments/${attachmentId}`, { method: 'DELETE' });
    if (response && response.data && response.data.length > 0 && response.data[0].code !== 'SUCCESS') {
      throw new CrmApiError(`Failed to delete attachment: ${response.data[0].message || 'Unknown error'}`, 400);
    }
  }

  // ===========================================================================
  // COQL
  // ===========================================================================

  async executeCoql(query: string): Promise<CoqlResponse> {
    const response = await this.request<{ data: Record<string, unknown>[]; info: { count: number; more_records: boolean; page: number } }>(
      '/crm/v6/coql',
      { method: 'POST', body: JSON.stringify({ select_query: query }) }
    );

    return {
      data: response.data || [],
      info: {
        count: response.info?.count || 0,
        moreRecords: response.info?.more_records || false,
        page: response.info?.page || 1,
      },
    };
  }

  // ===========================================================================
  // Bulk API
  // ===========================================================================

  async createBulkReadJob(request: BulkReadRequest): Promise<BulkReadJob> {
    const response = await this.request<{ data: Array<{ details: BulkReadJob }> }>('/crm/bulk/v6/read', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (!response.data || response.data.length === 0) {
      throw new CrmApiError('Failed to create bulk read job', 400);
    }

    return response.data[0].details;
  }

  async getBulkReadJob(jobId: string): Promise<BulkReadJob> {
    const response = await this.request<{ data: BulkReadJob[] }>(`/crm/bulk/v6/read/${jobId}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Bulk read job not found: ${jobId}`, 404);
    }
    return response.data[0];
  }

  async createBulkWriteJob(request: BulkWriteRequest): Promise<BulkWriteJob> {
    const response = await this.request<{ data: Array<{ details: BulkWriteJob }> }>('/crm/bulk/v6/write', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (!response.data || response.data.length === 0) {
      throw new CrmApiError('Failed to create bulk write job', 400);
    }

    return response.data[0].details;
  }

  async getBulkWriteJob(jobId: string): Promise<BulkWriteJob> {
    const response = await this.request<{ data: BulkWriteJob[] }>(`/crm/bulk/v6/write/${jobId}`);
    if (!response.data || response.data.length === 0) {
      throw new CrmApiError(`Bulk write job not found: ${jobId}`, 404);
    }
    return response.data[0];
  }

  // ===========================================================================
  // Notifications
  // ===========================================================================

  async enableNotifications(channels: NotificationChannel[]): Promise<NotificationChannel[]> {
    const watchData = channels.map((ch) => ({
      channel_id: ch.channelId,
      events: ch.events,
      channel_expiry: ch.channelExpiry,
      token: ch.token,
      notify_url: ch.notifyUrl,
    }));

    const response = await this.request<{ watch: NotificationChannel[] }>('/crm/v6/actions/watch', {
      method: 'POST',
      body: JSON.stringify({ watch: watchData }),
    });

    return response.watch || [];
  }

  async disableNotifications(channelIds: string[]): Promise<void> {
    await this.request('/crm/v6/actions/watch', {
      method: 'PATCH',
      body: JSON.stringify({ watch: channelIds.map((id) => ({ channel_id: id, _delete_events: true })) }),
    });
  }

  async getNotificationDetails(): Promise<NotificationChannel[]> {
    const response = await this.request<{ watch: NotificationChannel[] }>('/crm/v6/actions/watch');
    return response.watch || [];
  }

  // ===========================================================================
  // Related Records
  // ===========================================================================

  async listRelatedRecords(module: string, recordId: string, relatedList: string, params?: PaginationParams): Promise<PaginatedResponse<RelatedRecord>> {
    const queryParams = new URLSearchParams();
    const limit = params?.limit || 20;
    const page = Math.floor((params?.offset || 0) / limit) + 1;
    queryParams.set('page', String(page));
    queryParams.set('per_page', String(Math.min(limit, 200)));

    const response = await this.request<ZohoListResponse<RelatedRecord>>(`/crm/v6/${module}/${recordId}/${relatedList}?${queryParams}`);

    return {
      items: response.data,
      count: response.data.length,
      total: response.info.count,
      hasMore: response.info.more_records,
      nextCursor: response.info.more_records ? String(page + 1) : undefined,
    };
  }

  async addRelatedRecord(module: string, recordId: string, relatedList: string, relatedRecordId: string): Promise<void> {
    await this.request(`/crm/v6/${module}/${recordId}/${relatedList}/${relatedRecordId}`, { method: 'PUT' });
  }

  async removeRelatedRecord(module: string, recordId: string, relatedList: string, relatedRecordId: string): Promise<void> {
    await this.request(`/crm/v6/${module}/${recordId}/${relatedList}/${relatedRecordId}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Metadata
  // ===========================================================================

  async listModules(): Promise<ZohoModule[]> {
    const response = await this.request<{ modules: Array<{ id: string; api_name: string; module_name: string; singular_label: string; plural_label: string; creatable: boolean; viewable: boolean; editable: boolean; deletable: boolean; convertable: boolean }> }>(
      '/crm/v6/settings/modules'
    );

    return response.modules.map((m) => ({
      id: m.id,
      apiName: m.api_name,
      moduleName: m.module_name,
      singularLabel: m.singular_label,
      pluralLabel: m.plural_label,
      creatable: m.creatable,
      viewable: m.viewable,
      editable: m.editable,
      deletable: m.deletable,
      convertable: m.convertable,
    }));
  }

  async getModule(apiName: string): Promise<ZohoModule> {
    const response = await this.request<{ modules: Array<{ id: string; api_name: string; module_name: string; singular_label: string; plural_label: string; creatable: boolean; viewable: boolean; editable: boolean; deletable: boolean; convertable: boolean }> }>(
      `/crm/v6/settings/modules/${apiName}`
    );

    if (!response.modules || response.modules.length === 0) {
      throw new CrmApiError(`Module not found: ${apiName}`, 404);
    }

    const m = response.modules[0];
    return {
      id: m.id,
      apiName: m.api_name,
      moduleName: m.module_name,
      singularLabel: m.singular_label,
      pluralLabel: m.plural_label,
      creatable: m.creatable,
      viewable: m.viewable,
      editable: m.editable,
      deletable: m.deletable,
      convertable: m.convertable,
    };
  }

  async listFields(module: string): Promise<ZohoField[]> {
    const response = await this.request<{ fields: Array<{ id: string; api_name: string; field_label: string; data_type: string; length: number; required: boolean; visible: boolean; read_only: boolean; custom_field: boolean; pick_list_values?: Array<{ display_value: string; actual_value: string }> }> }>(
      `/crm/v6/settings/fields?module=${module}`
    );

    return response.fields.map((f) => ({
      id: f.id,
      apiName: f.api_name,
      fieldLabel: f.field_label,
      dataType: f.data_type,
      length: f.length,
      required: f.required,
      visible: f.visible,
      readOnly: f.read_only,
      customField: f.custom_field,
      pickListValues: f.pick_list_values?.map((v) => ({
        displayValue: v.display_value,
        actualValue: v.actual_value,
      })),
    }));
  }

  async listLayouts(module: string): Promise<Layout[]> {
    const response = await this.request<{ layouts: Array<{ id: string; name: string; status: string; sections?: Array<{ display_label: string; sequence_number: number; columns: number; fields: Array<{ id: string; api_name: string; field_label: string; data_type: string }> }> }> }>(
      `/crm/v6/settings/layouts?module=${module}`
    );

    return response.layouts.map((l) => ({
      id: l.id,
      name: l.name,
      status: l.status,
      sections: l.sections?.map((s) => ({
        displayLabel: s.display_label,
        sequenceNumber: s.sequence_number,
        columns: s.columns,
        fields: s.fields.map((f) => ({
          id: f.id,
          apiName: f.api_name,
          fieldLabel: f.field_label,
          dataType: f.data_type,
        })),
      })),
    }));
  }

  async listCustomViews(module: string): Promise<CustomView[]> {
    const response = await this.request<{ custom_views: Array<{ id: string; name: string; display_value: string; system_defined: boolean; default: boolean; criteria?: object }> }>(
      `/crm/v6/settings/custom_views?module=${module}`
    );

    return response.custom_views.map((cv) => ({
      id: cv.id,
      name: cv.name,
      displayValue: cv.display_value,
      systemDefined: cv.system_defined,
      default: cv.default,
      criteria: cv.criteria,
    }));
  }

  async listRelatedLists(module: string): Promise<RelatedList[]> {
    const response = await this.request<{ related_lists: Array<{ id: string; api_name: string; display_label: string; module: string; type: string }> }>(
      `/crm/v6/settings/related_lists?module=${module}`
    );

    return response.related_lists.map((rl) => ({
      id: rl.id,
      apiName: rl.api_name,
      displayLabel: rl.display_label,
      module: rl.module,
      type: rl.type,
    }));
  }

  // ===========================================================================
  // Tags
  // ===========================================================================

  async listTags(module: string): Promise<Tag[]> {
    const response = await this.request<{ tags: Array<{ id: string; name: string; color_code: string; created_time: string }> }>(
      `/crm/v6/settings/tags?module=${module}`
    );

    return response.tags.map((t) => ({
      id: t.id,
      name: t.name,
      colorCode: t.color_code,
      createdAt: t.created_time,
    }));
  }

  async createTag(module: string, input: TagCreateInput): Promise<Tag> {
    const response = await this.request<{ tags: Array<{ code: string; details: { id: string; name: string; color_code?: string; created_time?: string } }> }>(
      `/crm/v6/settings/tags?module=${module}`,
      { method: 'POST', body: JSON.stringify({ tags: [{ name: input.name, color_code: input.colorCode }] }) }
    );

    if (!response.tags || response.tags.length === 0 || response.tags[0].code !== 'SUCCESS') {
      throw new CrmApiError('Failed to create tag', 400);
    }

    return {
      id: response.tags[0].details.id,
      name: response.tags[0].details.name,
      colorCode: response.tags[0].details.color_code,
      createdAt: response.tags[0].details.created_time,
    };
  }

  async updateTag(module: string, tagId: string, input: TagUpdateInput): Promise<Tag> {
    const zohoData: Record<string, unknown> = { id: tagId };
    if (input.name !== undefined) zohoData.name = input.name;
    if (input.colorCode !== undefined) zohoData.color_code = input.colorCode;

    const response = await this.request<{ tags: Array<{ code: string; details: { id: string; name: string; color_code?: string; created_time?: string } }> }>(
      `/crm/v6/settings/tags/${tagId}?module=${module}`,
      { method: 'PUT', body: JSON.stringify({ tags: [zohoData] }) }
    );

    if (!response.tags || response.tags.length === 0 || response.tags[0].code !== 'SUCCESS') {
      throw new CrmApiError('Failed to update tag', 400);
    }

    return {
      id: response.tags[0].details.id,
      name: response.tags[0].details.name,
      colorCode: response.tags[0].details.color_code,
      createdAt: response.tags[0].details.created_time,
    };
  }

  async deleteTag(tagId: string): Promise<void> {
    await this.request(`/crm/v6/settings/tags/${tagId}`, { method: 'DELETE' });
  }

  async addTagsToRecords(module: string, recordIds: string[], tagNames: string[]): Promise<void> {
    await this.request(`/crm/v6/${module}/actions/add_tags`, {
      method: 'POST',
      body: JSON.stringify({ ids: recordIds, tag_names: tagNames }),
    });
  }

  async removeTagsFromRecords(module: string, recordIds: string[], tagNames: string[]): Promise<void> {
    await this.request(`/crm/v6/${module}/actions/remove_tags`, {
      method: 'POST',
      body: JSON.stringify({ ids: recordIds, tag_names: tagNames }),
    });
  }

  // ===========================================================================
  // Users
  // ===========================================================================

  async listUsers(type?: string): Promise<ZohoUser[]> {
    const queryParams = new URLSearchParams();
    if (type) queryParams.set('type', type);

    const response = await this.request<{ users: Array<{ id: string; full_name: string; email: string; role: { id: string; name: string }; profile: { id: string; name: string }; status: string; first_name: string; last_name: string; mobile: string; phone: string; street: string; city: string; state: string; country: string; time_zone: string; language: string; created_time: string; modified_time: string }> }>(
      `/crm/v6/users${type ? `?${queryParams}` : ''}`
    );

    return response.users.map((u) => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      role: u.role,
      profile: u.profile,
      status: u.status,
      firstName: u.first_name,
      lastName: u.last_name,
      mobile: u.mobile,
      phone: u.phone,
      street: u.street,
      city: u.city,
      state: u.state,
      country: u.country,
      timeZone: u.time_zone,
      language: u.language,
      createdAt: u.created_time,
      updatedAt: u.modified_time,
    }));
  }

  async getUser(id: string): Promise<ZohoUser> {
    const response = await this.request<{ users: Array<{ id: string; full_name: string; email: string; role: { id: string; name: string }; profile: { id: string; name: string }; status: string; first_name: string; last_name: string; mobile: string; phone: string; street: string; city: string; state: string; country: string; time_zone: string; language: string; created_time: string; modified_time: string }> }>(
      `/crm/v6/users/${id}`
    );

    if (!response.users || response.users.length === 0) {
      throw new CrmApiError(`User not found: ${id}`, 404);
    }

    const u = response.users[0];
    return {
      id: u.id,
      name: u.full_name,
      email: u.email,
      role: u.role,
      profile: u.profile,
      status: u.status,
      firstName: u.first_name,
      lastName: u.last_name,
      mobile: u.mobile,
      phone: u.phone,
      street: u.street,
      city: u.city,
      state: u.state,
      country: u.country,
      timeZone: u.time_zone,
      language: u.language,
      createdAt: u.created_time,
      updatedAt: u.modified_time,
    };
  }

  async getCurrentUser(): Promise<ZohoUser> {
    const users = await this.listUsers('CurrentUser');
    if (users.length === 0) {
      throw new CrmApiError('Current user not found', 404);
    }
    return users[0];
  }

  async listProfiles(): Promise<Profile[]> {
    const response = await this.request<{ profiles: Array<{ id: string; name: string; default: boolean; description: string; created_time: string }> }>(
      '/crm/v6/settings/profiles'
    );

    return response.profiles.map((p) => ({
      id: p.id,
      name: p.name,
      default: p.default,
      description: p.description,
      createdAt: p.created_time,
    }));
  }

  async getProfile(id: string): Promise<Profile> {
    const response = await this.request<{ profiles: Array<{ id: string; name: string; default: boolean; description: string; created_time: string }> }>(
      `/crm/v6/settings/profiles/${id}`
    );

    if (!response.profiles || response.profiles.length === 0) {
      throw new CrmApiError(`Profile not found: ${id}`, 404);
    }

    const p = response.profiles[0];
    return {
      id: p.id,
      name: p.name,
      default: p.default,
      description: p.description,
      createdAt: p.created_time,
    };
  }

  async listRoles(): Promise<Role[]> {
    const response = await this.request<{ roles: Array<{ id: string; name: string; reporting_to: { id: string; name: string }; description: string }> }>(
      '/crm/v6/settings/roles'
    );

    return response.roles.map((r) => ({
      id: r.id,
      name: r.name,
      reportingTo: r.reporting_to,
      description: r.description,
    }));
  }

  async getRole(id: string): Promise<Role> {
    const response = await this.request<{ roles: Array<{ id: string; name: string; reporting_to: { id: string; name: string }; description: string }> }>(
      `/crm/v6/settings/roles/${id}`
    );

    if (!response.roles || response.roles.length === 0) {
      throw new CrmApiError(`Role not found: ${id}`, 404);
    }

    const r = response.roles[0];
    return {
      id: r.id,
      name: r.name,
      reportingTo: r.reporting_to,
      description: r.description,
    };
  }
}

// =============================================================================
// Factory Function
// =============================================================================

/**
 * Create a Zoho CRM client instance with tenant-specific credentials.
 *
 * MULTI-TENANT: Each request provides its own credentials via headers,
 * allowing a single server deployment to serve multiple tenants.
 *
 * @param credentials - Tenant credentials parsed from request headers
 */
export function createCrmClient(credentials: TenantCredentials): CrmClient {
  return new ZohoCrmClient(credentials);
}
