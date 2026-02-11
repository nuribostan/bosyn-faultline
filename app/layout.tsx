import type { Metadata } from "next";
import { fonts } from "@/public/fonts/font";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "BOSYN | Faultline",
  description: "Enterprise Error Logging System",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fonts.poppins.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <NotificationProvider>
          <MainLayout>{children}</MainLayout>
        </NotificationProvider>
      </body>
    </html>
  );
}
