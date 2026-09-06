import "./globals.css";

export const metadata = {
  title: "EL-PRO Evidenca",
  description: "Evidenca zaposlenih in delovnih ur"
};

export default function RootLayout({ children }) {
  return (
    <html lang="sl">
      <body>{children}</body>
    </html>
  );
}
