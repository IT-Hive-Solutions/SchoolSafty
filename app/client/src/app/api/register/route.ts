import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { fetchGraphQL } from '@/lib/graphql-client';

const REGISTER_SCHOOL_MUTATION = gql`
  mutation RegisterSchool($input: RegisterSchoolInput!) {
    registerSchool(input: $input) {
      id
      schoolName
      status
    }
  }
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const variables = {
      input: {
        schoolName: body.schoolName,
        executiveName: body.executiveName || 'Unknown',
        executiveEmail: body.email,
      },
    };

    const data = await fetchGraphQL( REGISTER_SCHOOL_MUTATION, variables);

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('GraphQL Proxy error:', error.response?.errors || error.message);
    return NextResponse.json({ error: error.response?.errors?.[0]?.message || 'Registration failed' }, { status: 500 });
  }
}
