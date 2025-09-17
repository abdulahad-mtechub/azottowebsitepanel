import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    base: "/", // 👈 ensure assets resolve correctly
    plugins: [
      react({
        jsxRuntime: "automatic",
      }),
      {
        name: "html-transform",
        transformIndexHtml(html) {
          const csp = isDev
            ? `<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval'; worker-src 'self' blob:;">`
            : `<meta http-equiv="Content-Security-Policy" content="script-src 'self'; worker-src 'self';">`;

          return html.replace("</head>", `  ${csp}\n</head>`);
        },
      },
    ],
    build: {
      target: "esnext",
      outDir: "dist",
      assetsDir: "assets",
    },
  };
});
