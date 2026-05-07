// =============================================
// REACT QUERY CLIENT
// React Query caches data from Firebase so we
// don't re-fetch every time you switch pages.
// This file creates one shared instance used
// across the whole app via QueryClientProvider.
// =============================================

import { QueryClient } from "@tanstack/react-query";

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch when you switch back to the browser tab
      refetchOnWindowFocus: false,
      // Keep data for 5 minutes before considering it stale
      staleTime: 1000 * 60 * 5,
    },
  },
});
