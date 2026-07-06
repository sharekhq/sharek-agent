import { SharekConfig } from './api';
import { loadCredentials } from './commands/auth';

export function getConfig(): SharekConfig {
  // Check for stored OAuth credentials first
  const creds = loadCredentials();
  if (creds) {
    return {
      apiKey: creds.accessToken,
      apiUrl: creds.apiUrl,
    };
  }

  // Fall back to environment variable
  const apiKey = process.env.SHAREK_API_KEY;
  const apiUrl = process.env.SHAREK_API_URL;

  if (!apiKey) {
    console.error('❌ Error: No authentication found.');
    console.error('Options:');
    console.error('  1. OAuth2: sharek auth:login');
    console.error('  2. API Key: export SHAREK_API_KEY=your_api_key  (get one at https://dash.sharek.app/settings → Developers)');
    process.exit(1);
  }

  return {
    apiKey,
    apiUrl,
  };
}
