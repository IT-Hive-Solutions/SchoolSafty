import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { fetchGraphQL } from '@/lib/graphql-client';

const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      createdAt
    }
  }
`;

export async function GET() {
  try {
    const data: any = await fetchGraphQL(GET_ORGANIZATIONS);
    return NextResponse.json(data.organizations, { status: 200 });
  } catch (error: any) {
    console.error('GraphQL Proxy error (Get Organizations):', error.response?.errors || error.message);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}
