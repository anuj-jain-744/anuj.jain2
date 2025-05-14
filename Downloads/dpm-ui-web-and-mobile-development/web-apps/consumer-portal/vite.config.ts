import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { resolve } from "path";

export default defineConfig({
  plugins: [
    react()
  ],
  resolve:{
    alias:{
      "components": `${path.resolve(__dirname,'./src/components')}`,
      "utils": `${path.resolve(__dirname,'./src/utils')}`,
      "assets": `${path.resolve(__dirname,'./src/assets')}`,
      "styles": `${path.resolve(__dirname,'./src/styles')}`,
      // "constant": `${path.resolve(__dirname,'./src/constant')}`,
      'Motor': `${path.resolve(__dirname,'./src/Motor')}`,
      "@app-shell/*": `${path.resolve(__dirname,'../app-shell/src/*')}`
     }
  },
});
