import "./globals.css";

export const metadata = {
  title: "Shoe Shop",
  description: "Premium shoe store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50">{children}</body>
    </html>
  );
}
