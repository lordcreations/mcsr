import type { Metadata } from "next";
import { Fira_Mono, Fira_Code } from "next/font/google";
import "./globals.css";


const firaSans = Fira_Mono({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});
const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MCSR Brazil",
  description: "Ranked Leaderboard for MCSR Brazil",
  icons: {
    icon: "/image.png",
    shortcut: "/image.png",
    apple: "/apple-touch-icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/minecraft-4"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${firaSans.variable} ${firaSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
