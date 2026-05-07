import { lazy, Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DevtoolsPanel = import.meta.env.DEV
  ? lazy(() =>
      Promise.all([
        import("@tanstack/react-devtools"),
        import("@tanstack/react-query-devtools"),
      ]).then(([{ TanStackDevtools }, { ReactQueryDevtoolsPanel }]) => ({
        default: () => (
          <TanStackDevtools
            config={{ hideUntilHover: true }}
            plugins={[
              {
                name: "Tanstack Query",
                render: <ReactQueryDevtoolsPanel />,
                defaultOpen: false,
              },
            ]}
          />
        ),
      }))
    )
  : null;

type Props = {
  children: React.ReactNode;
};

export default function ReactQueryProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {DevtoolsPanel ? (
        <Suspense fallback={null}>
          <DevtoolsPanel />
        </Suspense>
      ) : null}
    </QueryClientProvider>
  );
}
