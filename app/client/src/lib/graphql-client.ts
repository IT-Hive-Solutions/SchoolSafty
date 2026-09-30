import { request } from 'graphql-request';

export const getBackendEndpoint = () => {
  return `${process.env.BACKEND_URL || 'http://localhost:3001'}/graphql`;
};

export const fetchGraphQL = async (query: string, variables?: any) => {
  const endpoint = getBackendEndpoint();
  return request(endpoint, query, variables);
};
