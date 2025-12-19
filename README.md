# n8n-nodes-apiverve

[![npm version](https://img.shields.io/npm/v/@apiverve/n8n-nodes-apiverve.svg)](https://www.npmjs.com/package/@apiverve/n8n-nodes-apiverve)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![n8n Community](https://img.shields.io/badge/n8n-Community%20Node-ff6d5a)](https://n8n.io)

This is an [n8n](https://n8n.io) community node that lets you use [APIVerve](https://apiverve.com) in your n8n workflows.

[APIVerve](https://apiverve.com) provides 310+ fast, reliable utility APIs for validation, conversion, generation, analysis, and lookup operations. One node, hundreds of APIs.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

---

## Table of Contents

- [Installation](#installation)
  - [n8n Cloud](#n8n-cloud)
  - [n8n Desktop](#n8n-desktop)
  - [Self-hosted n8n (npm)](#self-hosted-n8n-npm)
  - [Self-hosted n8n (Docker)](#self-hosted-n8n-docker)
- [Credentials](#credentials)
- [Operations](#operations)
- [Node Reference](#node-reference)
  - [API Selection](#api-selection)
  - [Parameters](#parameters)
  - [Options](#options)
- [Usage Examples](#usage-examples)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Testing](#testing)
- [Compatibility](#compatibility)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)
- [Version History](#version-history)
- [License](#license)

---

## Installation

### n8n Cloud

1. Log in to your n8n Cloud instance
2. Go to **Settings** → **Community Nodes**
3. Select **Install a community node**
4. Enter: `@apiverve/n8n-nodes-apiverve`
5. Agree to the risks and click **Install**

The node will appear in the nodes panel under **APIVerve**.

### n8n Desktop

1. Open n8n Desktop
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter: `@apiverve/n8n-nodes-apiverve`
5. Click **Install**
6. Restart n8n Desktop

### Self-hosted n8n (npm)

```bash
# Navigate to your n8n installation directory
cd /path/to/n8n

# Install the package
npm install @apiverve/n8n-nodes-apiverve

# Restart n8n
pm2 restart n8n
# or
systemctl restart n8n
```

### Self-hosted n8n (Docker)

Add the package to your `N8N_CUSTOM_EXTENSIONS` environment variable:

```yaml
# docker-compose.yml
services:
  n8n:
    image: n8nio/n8n
    environment:
      - N8N_CUSTOM_EXTENSIONS=@apiverve/n8n-nodes-apiverve
```

Or install in a running container:

```bash
docker exec -it n8n npm install @apiverve/n8n-nodes-apiverve
docker restart n8n
```

---

## Credentials

This node uses OAuth2 authentication to securely connect to your APIVerve account.

### Setting Up OAuth2

1. Sign up at [apiverve.com](https://apiverve.com) (free tier includes 100 requests/day)
2. In n8n, go to **Credentials** → **Add Credential**
3. Search for **APIVerve OAuth2 API**
4. Click **Sign in with APIVerve** to authorize
5. Grant access to your APIVerve account
6. Click **Save**

Your OAuth2 tokens will be automatically managed and refreshed by n8n.

---

## Operations

The APIVerve node provides a single, dynamic operation that can execute any of the 310+ available APIs:

| Operation | Description |
|-----------|-------------|
| **Execute API** | Run any APIVerve API with custom parameters |

APIs are organized into 29 categories including:

- **Validation** — Email, phone, address, credit card, VAT, domain validation
- **Conversion** — Currency, units, timezone, file format conversion
- **Generation** — QR codes, barcodes, passwords, UUIDs, lorem ipsum
- **Analysis** — Sentiment, language detection, readability, SEO analysis
- **Lookup** — IP geolocation, DNS, WHOIS, weather, zip codes

[Browse all 310+ APIs →](https://apiverve.com/marketplace)

---

## Node Reference

### API Selection

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| API | Dropdown | Yes | Select an API from the dynamically-loaded list. APIs are grouped by category. |

The API list is fetched dynamically when you open the dropdown, ensuring you always have access to the latest APIs.

### Parameters

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Parameters (JSON) | JSON | No | API parameters as a JSON object. Leave as `{}` for APIs with no parameters. |

Parameters vary by API. Common parameters include:

- `email` — Email address for validation APIs
- `url` — URL for web-related APIs
- `text` — Text content for analysis APIs
- `value` — Input value for conversion/generation APIs

See the [API documentation](https://docs.apiverve.com) for specific parameter requirements.

---

## Usage Example

### Validate an Email Address

**Configuration:**
- API: `Email Validator`
- Parameters (JSON): `{"email": "user@example.com"}`

**Output:**
```json
{
  "status": "ok",
  "error": null,
  "data": {
    "valid": true,
    "email": "user@example.com",
    "domain": "example.com",
    "disposable": false,
    "mx_found": true
  }
}
```

---

## Response Format

All APIVerve APIs return a consistent response structure:

```json
{
  "status": "ok",
  "error": null,
  "data": {
    // API-specific response data
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"ok"` for success, `"error"` for failure |
| `error` | string\|null | Error message if status is error, otherwise null |
| `data` | object\|null | API response data, null if error |

### Alternative Formats

Use the **Response Format** option to receive data in different formats:

- **JSON** (default) — `application/json`
- **XML** — `application/xml`
- **YAML** — `application/x-yaml`
- **CSV** — `text/csv` (for tabular data)

---

## Error Handling

The node handles errors gracefully and provides detailed error information:

| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid parameters or missing required fields |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | API access not allowed for your plan |
| 404 | Not Found | API endpoint not found |
| 429 | Rate Limited | Too many requests, retry after delay |
| 500 | Server Error | APIVerve server error |

### Error Response Example

```json
{
  "status": "error",
  "error": "Missing required parameter: email",
  "data": null
}
```

### Continue on Fail

Enable **Continue on Fail** in the node settings to prevent workflow execution from stopping on API errors. The error will be captured in the output for handling in subsequent nodes.

---

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) v18.10 or higher
- [pnpm](https://pnpm.io/) (recommended) or npm
- [n8n](https://n8n.io/) installed locally for testing

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/apiverve/n8n-nodes-apiverve.git
   cd n8n-nodes-apiverve
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Link to your local n8n installation:
   ```bash
   # Create the custom nodes directory if it doesn't exist
   mkdir -p ~/.n8n/nodes

   # Create a symlink
   ln -s $(pwd) ~/.n8n/nodes/@apiverve/n8n-nodes-apiverve
   ```

5. Start n8n:
   ```bash
   n8n start
   ```

### Development Mode

Run TypeScript in watch mode during development:

```bash
npm run dev
```

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lintfix
```

### Building

```bash
npm run build
```

This compiles TypeScript and copies icons to the `dist` folder.

---

## Compatibility

| Requirement | Version |
|-------------|---------|
| n8n | 1.0.0+ |
| Node.js | 18.10+ |

This node has been tested with:
- n8n Cloud
- n8n Desktop (Windows, macOS, Linux)
- Self-hosted n8n (npm, Docker)

---

## Troubleshooting

### "No options available" in API dropdown

- Verify your API key is correct in the credentials
- Check that your APIVerve account is active
- Ensure you have network access to api.apiverve.com

### "Unauthorized" error

- Re-check your API key in the n8n credentials
- Verify the API key is active in your [APIVerve Dashboard](https://dashboard.apiverve.com)

### "Rate Limited" error

- You've exceeded your plan's request limit
- Wait for the rate limit to reset or upgrade your plan
- Check rate limit headers in the response for reset time

### Node not appearing after installation

- Restart n8n completely
- Check the n8n logs for installation errors
- Verify the package is in `node_modules`

### Need help?

- [APIVerve Documentation](https://docs.apiverve.com)
- [GitHub Issues](https://github.com/apiverve/n8n-nodes-apiverve/issues)
- [n8n Community Forum](https://community.n8n.io/)

---

## Resources

| Resource | Link |
|----------|------|
| APIVerve Website | [apiverve.com](https://apiverve.com) |
| API Documentation | [docs.apiverve.com](https://docs.apiverve.com) |
| API Dashboard | [dashboard.apiverve.com](https://dashboard.apiverve.com) |
| Browse All APIs | [apiverve.com/marketplace](https://apiverve.com/marketplace) |
| n8n Documentation | [docs.n8n.io](https://docs.n8n.io) |
| n8n Community Nodes | [docs.n8n.io/integrations/community-nodes](https://docs.n8n.io/integrations/community-nodes/) |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-19 | Initial release with 310+ APIs |

---

## License

[MIT](LICENSE)

Copyright (c) 2025 [EvlarSoft LLC and APIVerve](https://apiverve.com)
