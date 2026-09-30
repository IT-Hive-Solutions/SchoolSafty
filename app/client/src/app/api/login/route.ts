import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { fetchGraphQL } from '@/lib/graphql-client';
import { cookies } from 'next/headers';

const TENANT_LOGIN = gql`
  mutation TenantLogin($input: TenantLoginInput!) {
    tenantLogin(input: $input) {
      token
      userId
    }
  }
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables = {
      input: {
        tenantId: body.tenantId,
        email: body.email,
        password: body.password,
      },
    };

    const data: any = await fetchGraphQL(TENANT_LOGIN, variables);

    const { token } = data.tenantLogin;

    // Set the JWT as an HTTP-Only cookie
    const cookieStore = await cookies();
    cookieStore.set('tenant_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Tenant Login error:', error.response?.errors || error.message);
    return NextResponse.json({ error: error.response?.errors?.[0]?.message || 'Invalid credentials' }, { status: 401 });
  }
}
