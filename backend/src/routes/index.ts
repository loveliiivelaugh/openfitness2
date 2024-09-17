import { Hono } from 'hono';
import { Context } from 'hono';

import { appConfigRoutes } from './appConfig.routes';
import { databaseRoutes } from './database.routes';
import { openfitnessRoutes } from './openfitness.routes';
import { authRoutes } from './auth.routes';
import { githubRoutes } from './github.routes';

import { notionScripts } from '../scripts/notion.scripts';


const paths = {
    "appConfig": "/api/v1/appConfig",
    "database": "/api/v1/database",
    "openfitness": "/api/v1/openfitness",
    "notion": "/api/v1/notion",
    "github": "/api/v1/github",
    "auth": "/api/v1/auth",
};

const routes = new Hono();


routes.get('/', (c: Context) => {
    return c.text("Openfitness Backend routes")
});  

routes.route(paths.auth, authRoutes);
routes.route(paths.appConfig, appConfigRoutes);
routes.route(paths.database, databaseRoutes);
routes.route(paths.openfitness, openfitnessRoutes);
routes.route(paths.github, githubRoutes);

const notionRoutes = new Hono();

notionRoutes
    /**
     * @openapi
     * /api/openfitness/fitness_tables:
     *   get:
     *     description: Gets all tables for OpenFitness and formats and organizes them
     *       for the front end to display in visualizations.
     *     responses:
     */
    .get('/:type', async (c: Context) => {
        const { type } = await c.req.param();
        const { notionClient } = c.var.clients;

        if (type === "list") return notionScripts.handleListReturn(c);

        const pages = { "Home": "2a822d5e-ac09-4df3-9981-588809928086" };

        try {

            const homepageChildren = await notionClient.blocks.children.list({
                block_id: pages.Home,
                page_size: 50,
            });

            const notionPageContent = await notionClient.blocks.children.list({
                block_id: type,
                page_size: 50,
            });

            const notionPageContentWithChildren = await new Promise((resolve) => {
                notionPageContent.results.forEach(async (block: any, index: number) => {
                    if (block.has_children) {
                        const response = await notionClient.blocks.children.list({
                            block_id: block.id,
                            page_size: 50,
                        });

                        block.children = response.results;
                    }

                    if (index === (notionPageContent.results.length - 1)) {
                        resolve(notionPageContent);
                    }
                });
            });

            const markdown = await notionScripts.buildMarkdown({ notionPageContent });
            const images = await notionScripts.extractImages({ notionPageContent });

            return c.json({ homepageChildren, markdown, images, notionPageContent: notionPageContentWithChildren });

        } catch (error) {
            console.error(error)

            return c.json({ message: "something went wrong", error })
        }
    });


routes.route(paths.notion, notionRoutes);

export { routes };