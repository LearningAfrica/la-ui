import ReactQueryProvider from "@/providers/query-provider";
import ReduxProvider from "@/providers/redux-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TopLoader } from "@/components/top-loader";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <ThemeProvider>
          <TopLoader />
          <Outlet />
        </ThemeProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
}
