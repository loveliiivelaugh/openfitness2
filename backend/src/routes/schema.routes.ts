import { Hono } from "hono";
import { Context } from 'hono';

import * as schema from '../../database/schemas';

const schemaRoutes = new Hono();


schemaRoutes
    .get('/', async (c: Context) => {
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


export { schemaRoutes }