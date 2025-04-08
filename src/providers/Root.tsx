'use client';

import { ApolloProvider } from '@apollo/client';
import client from '@src/lib/apollo-client';

export default function Root({ children }: { children: React.ReactNode }) {
  // Add any global client-side providers here (e.g., Redux, Context API, etc.)
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
