import React, { lazy, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRouter } from "./dynamicRoutes";
import { LoaderOverlay } from "../components/Loader";

// Lazy loaded components
// const PublicLayout = lazy(() => import("../layout/public"));
// const AuthenticatedLayout = lazy(() => import("../layout/authenticated"));

// const Errorpage = lazy(() => import("../components/Errorpage"));
// const PublicLanding = lazy(() => import("../pages/"));
// const IFrameMap = lazy(() => import("../pages/IFrameMap"));
// const TPClaimsRegister = lazy(() => import("../pages/TPClaimsRegister"));
// const NewsRoom = lazy(() => import("../pages/Newsroom"));

// const staticRouter = createBrowserRouter([
//   {
//     element: <PublicLayout />,
//     errorElement: <Errorpage />,
//     children: [
//       {
//         path: "/",
//         element: <PublicLanding />,
//       },
//       {
//         path: '/iframe-map',
//         element: <IFrameMap />
//       },
//       {
//         path: "/news-room",
//         element: <NewsRoom />
//       },
//       {
//         path: "/TPClaimsRegister",
//         element: <TPClaimsRegister />,
//       },
//       {
//         path: "/*",
//         element: <Errorpage />,
//       },
//     ],
//   },
//   {
//     element: <AuthenticatedLayout />,
//     errorElement: <Errorpage />,
//     children: [
//       {
//         path: "/protected",
//         element: <ProtectedTemplate />,
//       },
//     ],
//   },
// ]);

// export default staticRouter;

const AppRouter: React.FC = () => {
  const [router, setRouter] =
    useState<ReturnType<typeof createBrowserRouter>>();

  useEffect(() => {
    createRouter().then(setRouter);
  }, []);

  // useEffect(() => {
  //   console.log(router);
  // }, [router]);

  if (!router) {
    return <LoaderOverlay />;
  }
  return <RouterProvider router={router} />;
};

export default AppRouter;
