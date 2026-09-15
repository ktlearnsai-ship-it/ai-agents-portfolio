import Airtable from 'airtable';

export const base = new Airtable({ 
  apiKey: process.env.AIRTABLE_API_KEY 
}).base(process.env.AIRTABLE_BASE_ID as string);

export function safeParseJSON(str: any, fallback: any) {
  try {
    return JSON.parse(str || '[]');
  } catch {
    return fallback;
  }
}