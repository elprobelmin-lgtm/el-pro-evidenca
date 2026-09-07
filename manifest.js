export default function manifest() {
  return {
    name: "EL-PRO Evidenca",
    short_name: "EL-PRO",
    description: "Evidenca delovnega časa in odsotnosti za zaposlene EL-PRO.",
    start_url: "/",
    display: "standalone",
    background_color: "#090909",
    theme_color: "#ff7412",
    orientation: "portrait",
    lang: "sl",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
