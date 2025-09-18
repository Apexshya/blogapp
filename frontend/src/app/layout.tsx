import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header */}
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-3xl">My Blog</h1>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        {/* <footer className="bg-gray-800 text-white text-center py-4">
          <p>&copy; 2025 My Blog App. All rights reserved.</p>
        </footer> */}
      </body>
    </html>
  );
}
