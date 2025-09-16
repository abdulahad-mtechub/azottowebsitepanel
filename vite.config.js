import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [
      react({
        jsxRuntime: "automatic", // ✅ so you don’t need `import React` everywhere
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
  };
});
