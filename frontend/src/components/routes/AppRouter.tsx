import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { FitnessApp } from "../pages";
import DocsPage from "../pages/Docs/DocsPage";
import PlanningPage from "../pages/Planning/PlanningPage";
import { PageTransitionWrapper } from "../../utilities/theme/ThemeProvider";
import { Navbar } from "../pages/Fitness/layout/Navbar";

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
    {
        path: "/planning/exercise",
        element: (<PlanningPage />),
    }
].map((route) => ({ 
    ...route, 
    id: route.path,
    element: (
        <PageTransitionWrapper>
            <Navbar />
            {route.element}
        </PageTransitionWrapper>
    )
}));

const appRouter = createBrowserRouter(appRoutes);

export function AppRouter() {
    return (
        <RouterProvider router={appRouter} />
    )
};
