import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { fetchGraphQL } from '@/lib/graphql-client';

const GET_PENDING_REQUESTS = gql`
  query PendingRequests {
    pendingRequests {
      id
      schoolName
      executiveName
      executiveEmail
      status
      createdAt
    }
  }
`;

export async function GET() {
  try {
    // In a real scenario, you'd extract the session/cookie here and forward it or validate it
    const data: any = await fetchGraphQL( GET_PENDING_REQUESTS);

    return NextResponse.json(data.pendingRequests, { status: 200 });
  } catch (error: any) {
    console.error('GraphQL Proxy error (Get Requests):', error.response?.errors || error.message);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
