import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "hey, my favorite person.",
  description: "a little place made for you.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
