import Appshell from "@/components/layouts/appshell";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Appshell>
          <Component {...pageProps} />
        </Appshell>
      </ThemeProvider>
    </SessionProvider>
  );
}
