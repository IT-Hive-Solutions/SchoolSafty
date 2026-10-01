import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { fetchGraphQL } from '@/lib/graphql-client';

const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
    }
  }
`;

export async function GET() {
  try {
    const data: any = await fetchGraphQL(GET_ORGANIZATIONS);
    return NextResponse.json(data.organizations, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch organizations:', error.response?.errors || error.message);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}
