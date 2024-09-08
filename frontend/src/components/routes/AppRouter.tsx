import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { FitnessApp } from "../pages";
import DocsPage from "../pages/Docs/DocsPage";

const appRoutes = [
    {
        path: "/",
        element: (<FitnessApp />),
        // children: landingRoutes
    },
    {
        path: "/docs/:type",
        element: (<DocsPage />),
    },
    {
        path: "/reporting/:type",
        element: (<DocsPage />),
    },
];

const appRouter = createBrowserRouter(appRoutes);

export function AppRouter() {
    return (
        <RouterProvider router={appRouter} />
    )
};
