import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    base: "/", // 👈 adjust if deploying in subfolder
    plugins: [
      react({
        jsxRuntime: "automatic",
      }),
      {
        name: "html-transform",
        transformIndexHtml(html) {
          // CSP adjusted: production now allows inline scripts + workers
          // (needed for React + Vite chunk loading)
          const csp = isDev
            ? `<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval' 'unsafe-inline'; worker-src 'self' blob:;">`
            : `<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline'; worker-src 'self' blob:;">`;

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
