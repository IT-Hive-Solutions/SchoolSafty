import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { fetchGraphQL } from '@/lib/graphql-client';

const REJECT_REQUEST = gql`
  mutation RejectRequest($id: String!) {
    rejectRequest(id: $id) {
      id
      status
    }
  }
`;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const variables = { id };
    const data: any = await fetchGraphQL( REJECT_REQUEST, variables);

    return NextResponse.json(data.rejectRequest, { status: 200 });
  } catch (error: any) {
    console.error('GraphQL Proxy error (Reject):', error.response?.errors || error.message);
    return NextResponse.json({ error: error.response?.errors?.[0]?.message || 'Failed to reject' }, { status: 500 });
  }
}
