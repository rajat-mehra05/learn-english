import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
    server: {
      proxy: {
        "/api/anthropic": {
          target: "https://api.anthropic.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/anthropic/, ""),
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("proxy error", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log(
                "Sending Request to the Target:",
                req.method,
                req.url
              );
              // Add the API key to the proxy request headers from the server-side environment
              const apiKey = env.VITE_CLAUDE_API_KEY;
              console.log(
                "API Key found:",
                !!apiKey,
                "Length:",
                apiKey?.length
              );
              if (apiKey) {
                proxyReq.setHeader("x-api-key", apiKey);
                console.log("Added API key to proxy request");
              } else {
                console.warn(
                  "VITE_CLAUDE_API_KEY not found in environment variables"
                );
              }
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                "Received Response from the Target:",
                proxyRes.statusCode,
                req.url
              );
            });
          },
        },
      },
    },
  };
});
