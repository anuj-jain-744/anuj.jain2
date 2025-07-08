import React, { FC, Suspense, lazy, useState, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

const PublicLayout = lazy(() => import("./layout/public"));
const AuthenticatedLayout = lazy(() => import("./layout/authenticated"));
const Template = lazy(() => import("./template"));

const Header = lazy(
  () => import("../../corporate-portal/src/components/Header")
);
const Errorpage = lazy(() => import("./components/Errorpage"));
import staticRouter from "./routes";
import useTemplate from "./service";

interface Page {
  path: string;
}

interface Data {
  type: string;
  pages: Page[];
}

const App: FC = () => {
  const { data } = useTemplate();
  const [router, setRouter] = useState<ReturnType<
    typeof createBrowserRouter
  > | null>(null);

  const dynamicRouter = (): RouteObject[] => {

    if (!Array.isArray(data)) return [];
    return data.map(({ id, pages, template }) => ({
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          {data?.type === "public" ? <PublicLayout /> : <AuthenticatedLayout />}
        </Suspense>
      ),
      errorElement: <Errorpage />,
      children: pages.map(({ path, components }) => ({
        path: path,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Template type={template} component={components} />
          </Suspense>
        ),
      })),
    }));
  };

  const createRouterConfig = (routes: RouteObject[]): void => {
    const routerConfig = createBrowserRouter([
      ...routes,
      {
        element: <PublicLayout />,
        errorElement: <Errorpage />,
        children: [
          {
            path: "/",
            element: <Header />,
          },
          {
            path: "/*",
            element: <Errorpage />,
          },
        ],
      },
    ]);
    setRouter(routerConfig);
  };

  useEffect(() => {
    if (data) {
      const dynamicRoutes = dynamicRouter();
      createRouterConfig(dynamicRoutes);
    } else {
      createRouterConfig([]);
    }
  }, [data]);

  if (!router) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={staticRouter} />
    </Suspense>
  );
};

export default App;
