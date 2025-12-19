import { ICredentialType, INodeProperties } from 'n8n-workflow';
/**
 * APIVerve OAuth2 Credentials
 *
 * Authentication using OAuth2 Authorization Code flow.
 *
 * Sign up at: https://apiverve.com
 * Documentation: https://docs.apiverve.com/authentication
 */
export declare class APIVerveOAuth2Api implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    extends: string[];
    properties: INodeProperties[];
}
