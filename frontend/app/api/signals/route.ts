import { NextResponse } from 'next/server';
import { base } from '@/lib/airtable';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const records = await base('Signals_Raw')
      .select({
        sort: [{ field: 'date_detected', direction: 'desc' }],
        maxRecords: 50,
        filterByFormula: "{source} != ''"
      })
      .all();
    
    const signals = records.map(r => ({
      id: r.id,
      title: r.fields.title || '',
      summary: r.fields.summary || '',
      source: r.fields.source || '',
      country: r.fields.source_country || '',
      date: r.fields.date_detected || ''
    }));
    
    return NextResponse.json(signals);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}