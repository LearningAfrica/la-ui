import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
// import { EmbeddedDevTools } from "react-router-devtools";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export default function ReactQueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <TanStackDevtools
        config={{ hideUntilHover: true }}
        plugins={[
          {
            name: "Tanstack Query",
            render: <ReactQueryDevtoolsPanel />,
            defaultOpen: false,
          },

          // {
          //   name: "React Router",
          //   render: <EmbeddedDevTools />,
          //   defaultOpen: false,
          // // },
        ]}
      />
    </QueryClientProvider>
  );
}
