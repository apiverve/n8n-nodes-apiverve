import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
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
export declare class APIVerve implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getAvailableAPIs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
