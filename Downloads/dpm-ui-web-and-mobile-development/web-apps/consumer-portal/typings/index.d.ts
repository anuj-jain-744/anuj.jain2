declare module "vite";
declare module "react";
declare module "react-router-dom";
declare module "react-dom/client";
declare module "@dpm/shared-module";
declare module "*.png";
declare module "*.jpg";
declare module "*.svg" {
  const content: string;
  export default content;
}
declare module "components/*" {
  const content: any;
  export default content;
}
declare module "utils/*" {
  const content: any;
  export default content;
}
