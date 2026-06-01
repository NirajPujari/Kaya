import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IronLog — Strength Training Tracker",
  description:
    "Track your strength progression, log workouts, and crush PRs with IronLog — the serious lifter's workout tracker.",
  keywords: ["workout tracker", "strength training", "gym", "fitness", "powerlifting"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
