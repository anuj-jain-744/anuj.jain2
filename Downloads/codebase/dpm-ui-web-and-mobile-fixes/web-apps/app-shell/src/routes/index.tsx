import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRouter } from "./dynamicRoutes";
import { LoaderOverlay } from "../components/Loader";

const AppRouter: React.FC = () => {
  const [router, setRouter] =
    useState<ReturnType<typeof createBrowserRouter>>();

  useEffect(() => {
    createRouter().then(setRouter);
  }, []);

  if (!router) {
    return <LoaderOverlay />;
  }
  return <RouterProvider router={router} />;
};

export default AppRouter;
