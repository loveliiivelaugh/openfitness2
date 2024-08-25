// Packages
import { Hono, Next } from 'hono';
import { Context } from 'hono';

// Utilities
import { openfitnessScripts } from '../scripts/openfitness.scripts';

// // Types
// import { OpenFitnessTables } from '../../types/openfitness.types';


const openfitnessRoutes = new Hono();


/**
 * @openapi
 * /api/openfitness/fitness_tables:
 *   get:
 *     description: Gets all tables for OpenFitness and formats and organizes them
 *       for the front end to display in visualizations.
 *     responses:
 */
openfitnessRoutes.get('/fitness_tables', async (c: Context) => {
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
});

/**
 * @openapi
 * /api/openfitness/fitness_tables:
 *   get:
 *     description: Gets all tables for OpenFitness and formats and organizes them
 *       for the front end to display in visualizations.
 *     responses:
 */
openfitnessRoutes.get('/get-exercises', async (c: Context) => {
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
});


/**
 * @openapi
 * /api/openfitness/fitness_tables:
 *   get:
 *     description: Gets all tables for OpenFitness and formats and organizes them
 *       for the front end to display in visualizations.
 *     responses:
 */
openfitnessRoutes.get('/get-foods', async (c: Context) => {
    const food = c.req.query("food");
    const { nutritionixClient } = c.var.clients;

    try {
        const data = (await nutritionixClient.get(`/search/instant/?query=${food}`)).data;

        console.log("/get-foods: ", data)
        return c.json(data);

    } catch (error) {

        return c.json(error || 'Something went wrong');
    }
});


/**
 * @openapi
 * /api/openfitness/fitness_tables:
 *   get:
 *     description: Gets all tables for OpenFitness and formats and organizes them
 *       for the front end to display in visualizations.
 *     responses:
 */
openfitnessRoutes.get('/get-single-food', async (c: Context) => {
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
});


export { openfitnessRoutes };
