import { QueryClient } from '@tanstack/react-query'

// Data comes from the local IndexedDB, not from a network.
// - networkMode 'always': by default queries pause while offline; a local DB must work offline.
// - retry false: a failed local read/write will not succeed on retry.
// - staleTime Infinity: only this app writes the data, so cache is fresh until a mutation
//   invalidates it. Revisit these defaults when the repository moves to a server (D-3).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'always',
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
    mutations: {
      networkMode: 'always',
      retry: false,
    },
  },
})
