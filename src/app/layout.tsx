import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Workspace - Modern Creators Platform",
  description: "The all-in-one generative workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is mandatory when using next-themes
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* The ThemeProvider wraps the entire application natively */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}