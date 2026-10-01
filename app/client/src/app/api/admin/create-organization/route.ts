import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { fetchGraphQL } from '@/lib/graphql-client';

const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      tenant {
        id
        name
        schemaName
      }
      initialPassword
    }
  }
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const variables = { input: body };
    const data: any = await fetchGraphQL(CREATE_ORGANIZATION, variables);

    return NextResponse.json(data.createOrganization, { status: 200 });
  } catch (error: any) {
    console.error('GraphQL Proxy error (Create Organization):', error.response?.errors || error.message);
    return NextResponse.json({ error: error.response?.errors?.[0]?.message || 'Failed to create organization' }, { status: 500 });
  }
}
