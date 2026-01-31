import ReactQueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
