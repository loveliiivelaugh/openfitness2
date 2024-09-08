// Packages
import { Hono } from 'hono';
import { Context } from 'hono';

// Utilities
import { openfitnessScripts } from '../scripts/openfitness.scripts';
import { notionScripts } from '../scripts/notion.scripts';



const openfitnessRoutes = new Hono();


openfitnessRoutes
/**
 * @openapi
 * /api/openfitness/fitness_tables:
 *   get:
 *     description: Gets all tables for OpenFitness and formats and organizes them
 *       for the front end to display in visualizations.
 *     responses:
 */
    .get('/fitness_tables', async (c: Context) => {
        const { database } = c.var; // Get database from context

        if (!database) return c.text('Database not found.');

        // console.log('/fitness_tables: ', c.req)

        try {

            const data: any = await openfitnessScripts.getAllTables(database);

            // const data: any = [];
            return c.json(data);

        } catch (error) {

            return c.json({ error_message: "Something went wrong!", error });
        }
    })

/**
 * @openapi
 * /api/openfitness/fitness_tables:
 *   get:
 *     description: Gets all tables for OpenFitness and formats and organizes them
 *       for the front end to display in visualizations.
 *     responses:
 */
    .get('/get-exercises', async (c: Context) => {
        const name = c.req.query("name");
        const { exerciseClient } = c.var.clients;

        // console.log("/api/openfitness/get-exercises GET: ", name)

        try {
            const data = (await exerciseClient.get(`/exercises?muscle=${name}`)).data;

            console.log("/get-exercises: ", data)
            return c.json(data);

        } catch (error) {

            return c.json(error || 'Something went wrong');
        }
    })


/**
 * @openapi
 * /api/openfitness/fitness_tables:
 *   get:
 *     description: 
 *     responses:
 */
    .get('/get-foods', async (c: Context) => {
        const food = c.req.query("food");
        const { nutritionixClient } = c.var.clients;

        try {
            const data = (await nutritionixClient.get(`/search/instant/?query=${food}`)).data;

            console.log("/get-foods: ", data)
            return c.json(data);

        } catch (error) {

            return c.json(error || 'Something went wrong');
        }
    })


/**
 * @openapi
 * /api/openfitness/fitness_tables:
 *   get:
 *     description: Gets all tables for OpenFitness and formats and organizes them
 *       for the front end to display in visualizations.
 *     responses:
 */
    .get('/get-single-food', async (c: Context) => {
        const id = c.req.query("id");
        const { nutritionixClient } = c.var.clients;

        console.log("/get-single-foods: ", typeof(id), id);

        try {
            const data = (await nutritionixClient.get(`/search/item/?nix_item_id=${id}`)).data;

            console.log("/get-single-foods.data: ", data)
            return c.json(data);

        } catch (error) {

            return c.json(error || 'Something went wrong');
        }
    })

/**
 * @openapi
 * /api/openfitness/fitness_tables:
 *   get:
 *     description: Gets all tables for OpenFitness and formats and organizes them
 *       for the front end to display in visualizations.
 *     responses:
 */
    .get('/notion/:type', async (c: Context) => {
        const { type } = await c.req.param();
        const { notionClient } = c.var.clients;
        const {
            NOTION_DOCUMENTATION_PAGE_ID: documentation,
            NOTION_ROADMAP_PAGE_ID: roadmap
        } = Bun.env;

        // Openfitness2 Docs Notion Page ID
        // Documentation or Roadmap
        const pageId = ({ documentation, roadmap }[type]);
    
        try {
            const notionPageContent = await notionClient.blocks.children.list({
                block_id: pageId,
                page_size: 50,
            });
            
            const markdown = await notionScripts.buildMarkdown({ notionPageContent });
            const images = await notionScripts.extractImages({ notionPageContent });

            return c.json({ markdown, images });

        } catch (error) {
            console.error(error)

            return c.json({ message: "something went wrong", error })
        }
    });

export { openfitnessRoutes };
