import "./globals.css";

export const metadata = {
  title: "EL-PRO Evidenca",
  description: "Evidenca zaposlenih, delovnih ur in odsotnosti EL-PRO",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "EL-PRO",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#ff7412",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="sl">
      <body>{children}</body>
    </html>
  );
}
