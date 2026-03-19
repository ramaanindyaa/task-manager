import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ToastContainer } from "@/components/ToastContainer";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Task Manager",
    template: "%s | Task Manager",
  },
  description:
    "Ocean-themed task management SaaS for planning, prioritizing, and shipping work faster.",
  applicationName: "Task Manager",
  keywords: ["task management", "kanban", "productivity", "team collaboration"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
