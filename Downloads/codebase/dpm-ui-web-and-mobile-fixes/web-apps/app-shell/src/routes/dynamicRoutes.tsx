import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Errorpage } from "../components";

const pages = import.meta.glob('../pages/**/*.tsx');

export const generatedRoutes = async () => {
    const routes = await Promise.all(
        Object.keys(pages).map(async (path) => {
            const module: any = await pages[path]();
            const routePath = path
                .replace('./pages', '')
                .replace('index', '')
                .replace('.tsx', '')
                .replace(/\[([^\]]+)\]/g, ':$1');

            return {
                path: routePath.toLowerCase().replace('.', ""),
                element: React.createElement(module.default),
                errorElement: <Errorpage />
            }
        })
    );
    return routes;
}

export const createRouter = async () => {
    const routes = await generatedRoutes();
    routes.push({
        path: "/*",
        element: <Errorpage />,
        errorElement: <Errorpage />,
    })
    return createBrowserRouter(routes);
}