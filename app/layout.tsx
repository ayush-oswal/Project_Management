import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChakraProviders } from "@/Providers/Chakra";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Management",
  description: "A B2B webiste for managing projects/tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundImage: "url('./bg.png')" }} className={inter.className}>
        <div className="p-5 m-auto no-scrollbar flex items-center justify-center h-full w-full">
          <ChakraProviders>
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </ChakraProviders>
        </div>
      </body>
    </html>
  );
}
