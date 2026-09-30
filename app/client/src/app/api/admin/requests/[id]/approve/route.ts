import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { fetchGraphQL } from '@/lib/graphql-client';

const APPROVE_REQUEST = gql`
  mutation ApproveRequest($id: String!) {
    approveRequest(id: $id) {
      id
      name
      schemaName
    }
  }
`;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const variables = { id };
    const data: any = await fetchGraphQL( APPROVE_REQUEST, variables);

    return NextResponse.json(data.approveRequest, { status: 200 });
  } catch (error: any) {
    console.error('GraphQL Proxy error (Approve):', error.response?.errors || error.message);
    return NextResponse.json({ error: error.response?.errors?.[0]?.message || 'Failed to approve' }, { status: 500 });
  }
}
