import ReactQueryProvider from "@/providers/query-provider";
import ReduxProvider from "@/providers/redux-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
}
