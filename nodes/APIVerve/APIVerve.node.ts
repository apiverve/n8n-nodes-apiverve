import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

/**
 * APIVerve Node
 *
 * Resources:
 * - API: Execute any of 300+ utility APIs
 * - JSON Bin: Read/write JSON storage bins
 * - Analytics: View usage statistics
 *
 * @see https://apiverve.com/apis
 * @see https://docs.apiverve.com
 */
export class APIVerve implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'APIVerve',
		name: 'apiVerve',
		icon: 'file:apiverve.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Access 300+ utility APIs, JSON Bins, and Analytics',
		defaults: {
			name: 'APIVerve',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'apiVerveOAuth2Api',
				required: true,
			},
		],
		properties: [
			// ========== Resource Selector ==========
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'API', value: 'api', description: 'Execute any of 300+ utility APIs' },
					{ name: 'JSON Bin', value: 'jsonbin', description: 'Store and retrieve JSON data' },
					{ name: 'Analytics', value: 'analytics', description: 'View usage statistics (Pro+ plans)' },
				],
				default: 'api',
			},

			// ========== API Resource ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['api'] } },
				options: [
					{ name: 'Execute', value: 'execute', description: 'Execute an API', action: 'Execute an API' },
					{ name: 'List APIs', value: 'list', description: 'List all available APIs', action: 'List all APIs' },
				],
				default: 'execute',
			},
			{
				displayName: 'API',
				name: 'apiId',
				type: 'options',
				noDataExpression: true,
				typeOptions: { loadOptionsMethod: 'getAvailableAPIs' },
				displayOptions: { show: { resource: ['api'], operation: ['execute'] } },
				default: '',
				required: true,
				description: 'Select an API to execute. Browse all APIs at <a href="https://apiverve.com/marketplace" target="_blank">apiverve.com/marketplace</a>.',
			},
			{
				displayName: 'Parameters (JSON)',
				name: 'parameters',
				type: 'json',
				default: '{}',
				description: 'API parameters as JSON. Example: {"email": "test@example.com"}. Leave as {} for APIs with no parameters.',
				displayOptions: { show: { resource: ['api'], operation: ['execute'] } },
			},

			// ========== JSON Bin Resource ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['jsonbin'] } },
				options: [
					{ name: 'List', value: 'list', description: 'List all JSON Bins', action: 'List JSON Bins' },
					{ name: 'Get', value: 'get', description: 'Get a JSON Bin', action: 'Get a JSON Bin' },
					{ name: 'Update', value: 'update', description: 'Update a JSON Bin', action: 'Update a JSON Bin' },
				],
				default: 'list',
			},
			{
				displayName: 'Create and delete Bins in the <a href="https://dashboard.apiverve.com/vervekit/jsonbin" target="_blank">APIVerve Dashboard</a>',
				name: 'binNotice',
				type: 'notice',
				default: '',
				displayOptions: { show: { resource: ['jsonbin'] } },
			},
			{
				displayName: 'Bin ID',
				name: 'binId',
				type: 'string',
				default: '',
				required: true,
				description: 'The JSON Bin ID (from your dashboard)',
				displayOptions: { show: { resource: ['jsonbin'], operation: ['get', 'update'] } },
			},
			{
				displayName: 'Data (JSON)',
				name: 'binData',
				type: 'json',
				default: '{}',
				description: 'JSON data to store in the Bin',
				displayOptions: { show: { resource: ['jsonbin'], operation: ['update'] } },
			},

			// ========== Analytics Resource ==========
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['analytics'] } },
				options: [
					{ name: 'Get Current Usage', value: 'getUsage', description: 'Get current usage statistics', action: 'Get current usage statistics' },
				],
				default: 'getUsage',
			},
		],
	};

	methods = {
		loadOptions: {
			async getAvailableAPIs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'apiVerveOAuth2Api',
						{ method: 'GET', url: 'https://api.apiverve.com/v1/n8n/apis' },
					);
					if (!Array.isArray(response)) return [];
					return response.map((api: { id: string; label: string; description: string }) => ({
						name: api.label,
						value: api.id,
						description: api.description,
					}));
				} catch (error) {
					return [];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let response: unknown;

				// ========== API Resource ==========
				if (resource === 'api') {
					if (operation === 'execute') {
						const apiId = this.getNodeParameter('apiId', i) as string;
						const parametersJson = this.getNodeParameter('parameters', i) as string;
						let params: Record<string, string> = {};
						try {
							const parsed = typeof parametersJson === 'string' ? JSON.parse(parametersJson) : parametersJson;
							for (const [key, value] of Object.entries(parsed)) {
								params[key] = String(value);
							}
						} catch (e) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON in parameters');
						}
						response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'apiVerveOAuth2Api',
							{ method: 'GET', url: `https://api.apiverve.com/v1/${apiId}`, qs: params },
						);
					} else if (operation === 'list') {
						response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'apiVerveOAuth2Api',
							{ method: 'GET', url: 'https://api.apiverve.com/v1/n8n/apis' },
						);
					}
				}

				// ========== JSON Bin Resource ==========
				else if (resource === 'jsonbin') {
					const baseUrl = 'https://api.apiverve.com/v1/n8n/jsonbin';
					if (operation === 'list') {
						response = await this.helpers.httpRequestWithAuthentication.call(
							this, 'apiVerveOAuth2Api', { method: 'GET', url: `${baseUrl}/list` },
						);
					} else if (operation === 'get') {
						const binId = this.getNodeParameter('binId', i) as string;
						response = await this.helpers.httpRequestWithAuthentication.call(
							this, 'apiVerveOAuth2Api', { method: 'GET', url: `${baseUrl}/get/${binId}` },
						);
					} else if (operation === 'update') {
						const binId = this.getNodeParameter('binId', i) as string;
						const body = { data: JSON.parse(this.getNodeParameter('binData', i) as string) };
						response = await this.helpers.httpRequestWithAuthentication.call(
							this, 'apiVerveOAuth2Api', { method: 'PUT', url: `${baseUrl}/update/${binId}`, body },
						);
					}
				}

				// ========== Analytics Resource ==========
				else if (resource === 'analytics') {
					response = await this.helpers.httpRequestWithAuthentication.call(
						this, 'apiVerveOAuth2Api', { method: 'GET', url: 'https://api.apiverve.com/v1/n8n/analytics' },
					);
				}

				returnData.push({ json: response as IDataObject, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { status: 'error', error: (error as Error).message, data: null },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
