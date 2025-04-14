import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths'
 
import path from "path";
 
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  resolve:{
    alias:{
      "@components/*": `${path.resolve(__dirname,'./src/components/*')}`,
      "@src/*": `${path.resolve(__dirname,'./src/*')}`,
      "@utils": `${path.resolve(__dirname,'./src/utils')}`,
      "@consumer-portal/*": `${path.resolve(__dirname,'./consumer-portal/src/*')}`,
      "@corporate-portal/*": `${path.resolve(__dirname,'../corporate-portal/src/*')}`
    },
  },
});