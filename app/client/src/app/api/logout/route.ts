import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear the tenant token
  cookieStore.delete('tenant_token');

  return NextResponse.json({ success: true }, { status: 200 });
}
