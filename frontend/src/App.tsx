import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { router } from '@/router';
import { AuthProvider } from '@/features/auth/_contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MantineProvider>
          <Notifications position="top-right" />
          <RouterProvider router={router} />
        </MantineProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
