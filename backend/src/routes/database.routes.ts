// Packages
import { Hono } from 'hono';
import { Context } from 'hono';
import { validator } from 'hono/validator';
import { Parser } from '@json2csv/plainjs';

import { schema } from '../../database';
// import { validationMap } from '../../database/schemas';


const databaseRoutes = new Hono();


/**
 * @openapi
 * /database/read_schema:
 *   get:
 *     description: Gets all tables and columns for the database
 *     responses:
 */
databaseRoutes
    .get('/schema', async (c: Context) => {
        try {
            const tables = Object.keys(schema);
            const tablesWithColumns = tables
                .map((table: string | any) => {

                    if (["usersRelations", "validations"].includes(table)) return null;

                    const columns = Object
                        .keys((schema as any)[table])
                        .map((column: string) => ({
                            ...(schema as any)[table][column].config,
                            default: ((schema as any)[table][column]?.default || null)
                        }));
                    
                    const data = ({
                        table,
                        columns
                    });

                    return data;
                })
                .filter((value: any) => value);

            return c.json(tablesWithColumns);

        } catch (error: any) {

            return c.json(error);
        }
    })

/**
 * @swagger
 * /database/read_database:
 *   get:
 *     summary: Returns stuff
 *     responses:
 */
    .get('/:table', async (c: Context) => {
        // const table = c.req.query('table') || 'table_name';
        const table = c.req.param('table') || 'table_name';
        const { database } = c.var;

        const options = {};
        
        try {
            const data = await database
                .query
                ?.[table]
                .findMany(options);

            return c.json(data, 201);

        } catch (error: any) {
            console.error(error);
            
            return c.json(error, 500);
        }
    })

/**
 * @swagger
 * /database/write_db:
 *   get:
 *     summary: Add stuff
 *     responses:
 */
    .post('/:table', validator('json', (value: any, c: Context) => {
        // // Validations on the server side for POST requests
        // const table = c.req.query('table');
        // const decodedJwt = c.get('jwtPayload');

        // if (value?.created_at) delete value.created_at; // Supabase will autopopulate this field

        // const formattedValues = {
        //     ...value,
        //     id: parseInt(value.id),
        //     weight: parseInt(value.weight),
        //     user_id: (decodedJwt.data.user as any).id // using User that is logged in
        // };

        // const parsed = (validationMap[table as keyof typeof validationMap] as any)
        //     .safeParse(formattedValues);

        // if (!parsed.success) return c.text('Invalid!', 401);

        // return parsed.data;

        return value;

    }),
    // Route definition
    async (c: Context) => {
        const { database } = c.var;
        // const table = c.req.query('table');
        const table = c.req.param('table');
        const tableSchema = schema[table as keyof typeof schema];
        const validatedData = c.req.valid("json" as "json");

        try {
            const data = await database
                .insert(tableSchema)
                .values(validatedData)
                .returning();

            return c.json(data, 201);
            
        } catch (error: any) {
            console.error(error, "Error while writing to table: ", table);
            
            return c.json(error, 500);
        }
    })

/**
 * @swagger
 * /database/write_db:
 *   get:
 *     summary: Add stuff
 *     responses:
 */
    .put('/:table', validator('json', (value: any, c: Context) => {
        // // Validations on the server side for POST requests
        // const table = c.req.query('table');

        // if (value?.created_at) delete value.created_at; // Supabase will autopopulate this field

        // const formattedValues = {
        //     ...value,
        //     id: parseInt(value.id),
        //     weight: parseInt(value.weight)
        // };

        // const parsed = (validationMap[table as keyof typeof validationMap] as any).safeParse(formattedValues);
        
        // if (!parsed.success) return c.text('Invalid!', 401);

        // return parsed.data;

        return value;

    }),
    // Route definition
    async (c: Context) => {
        const { database } = c.var;
        // const table = c.req.query('table');
        const table = c.req.param('table');
        const tableSchema = schema[table as keyof typeof schema];
        const validatedData = c.req.valid("json" as "json");

        try {
            const data = await database
                .update(tableSchema)
                .set(validatedData)
                .returning();

            return c.json(data, 201);
            
        } catch (error: any) {
            console.error(error, "Error while writing to table: ", table);
            
            return c.json(error, 500);
        }
    })
/**
 * @swagger
 * /database/write_db:
 *   get:
 *     summary: Add stuff
 *     responses:
 */
    .get(
        '/export/data',
        // Route definition
        async (c: Context) => {
            const { database } = c.var;

            try {
                const data = await Promise.all(
                    [
                        "profile",
                        "food",
                        "exercise",
                        "weight",
                        "sleep",
                        "steps"
                    ].map(async (table: string) => await database
                        .query
                        ?.[table]
                        .findMany({})
                    )
                );

                console.log("data: ", data);
                const parser = new Parser();
                const csv = data.map((table: any) => parser.parse(table));

                console.log("csv: ", csv);
                return c.json({ data, csv });
                
            } catch (error: any) {
                console.error(error, "Error while writing to table: ");
                
                return c.json(error);
            }
        });

export { databaseRoutes };