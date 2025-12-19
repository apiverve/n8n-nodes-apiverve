"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIVerveOAuth2Api = void 0;
/**
 * APIVerve OAuth2 Credentials
 *
 * Authentication using OAuth2 Authorization Code flow.
 *
 * Sign up at: https://apiverve.com
 * Documentation: https://docs.apiverve.com/authentication
 */
class APIVerveOAuth2Api {
    constructor() {
        this.name = 'apiVerveOAuth2Api';
        this.displayName = 'APIVerve OAuth2 API';
        this.documentationUrl = 'https://docs.apiverve.com/authentication';
        this.extends = ['oAuth2Api'];
        this.properties = [
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
}
exports.APIVerveOAuth2Api = APIVerveOAuth2Api;
