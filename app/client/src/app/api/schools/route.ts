import { NextResponse } from 'next/server';
import { gql } from 'graphql-request';
import { fetchGraphQL } from '@/lib/graphql-client';

const GET_SCHOOLS = gql`
  query GetSchools {
    schools {
      id
      name
    }
  }
`;

export async function GET() {
  try {
    const data: any = await fetchGraphQL(GET_SCHOOLS);
    return NextResponse.json(data.schools, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch schools:', error.response?.errors || error.message);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}
