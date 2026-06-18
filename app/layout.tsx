import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/Auth";
import { Toaster } from "sonner";
import { TopBar } from "@/components/layout/TopBar";
import { SideBar } from "@/components/layout/SideBar";
import { Footer } from "@/components/layout/Footer";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Kaya",
  description: "A helper with your Workout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body className="min-h-full">
        <AuthProvider>
          <div className="relative flex min-h-screen">
            <SideBar />
            <div className="flex flex-1 flex-col w-full">
              <TopBar />
              <main className="flex-1 flex flex-col">
                <div className="flex-1 bg-muted/10 p-6 md:p-8">{children}</div>
              </main>
              <Footer />
            </div>
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
