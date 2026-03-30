// vite.config.ts
import { defineConfig } from "file:///D:/choDING/Odoo-Final-Hackakton/Fronted/node_modules/vite/dist/node/index.js";
import react from "file:///D:/choDING/Odoo-Final-Hackakton/Fronted/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/choDING/Odoo-Final-Hackakton/Fronted/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\choDING\\Odoo-Final-Hackakton\\Fronted";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};