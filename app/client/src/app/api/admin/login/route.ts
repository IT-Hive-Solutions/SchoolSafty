import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { fetchGraphQL } from '@/lib/graphql-client';
import { cookies } from 'next/headers';

const SUPER_ADMIN_LOGIN = gql`
  mutation SuperAdminLogin($input: LoginInput!) {
    superAdminLogin(input: $input) {
      token
      superAdminId
    }
  }
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables = {
      input: {
        email: body.email,
        password: body.password,
      },
    };

    const data: any = await fetchGraphQL( SUPER_ADMIN_LOGIN, variables);

    const { token } = data.superAdminLogin;

    // Set the JWT as an HTTP-Only cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Login Proxy error:', error.response?.errors || error.message);
    return NextResponse.json({ error: error.response?.errors?.[0]?.message || 'Invalid credentials' }, { status: 401 });
  }
}
