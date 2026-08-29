import type { Metadata } from "next";
import "../styles/globals.css";
import { AppProvider } from "@/context/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "InstaStudio - Modern Instagram Creator & Account Management",
  description: "Next-generation management platform for Instagram creators, influencers, and brands. Schedule posts, optimize reels, manage comments, and track audience analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
