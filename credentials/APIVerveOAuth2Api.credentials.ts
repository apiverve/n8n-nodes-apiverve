import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * APIVerve OAuth2 Credentials
 *
 * Authentication using OAuth2 Authorization Code flow.
 *
 * Sign up at: https://apiverve.com
 * Documentation: https://docs.apiverve.com/authentication
 */
export class APIVerveOAuth2Api implements ICredentialType {
	name = 'apiVerveOAuth2Api';
	displayName = 'APIVerve OAuth2 API';
	documentationUrl = 'https://docs.apiverve.com/authentication';
	extends = ['oAuth2Api'];
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://api.apiverve.com/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api.apiverve.com/token',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'hidden',
			default: 'n8n',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'hidden',
			default: 'avs_n8n_k9m3d7g4l1n8s2f6',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'apiverve:full',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
