import { Hono } from 'hono';
import { Context } from 'hono';

import { themeConfig } from '../../config/theme.config';


const appConfigRoutes = new Hono();


appConfigRoutes
    .get('/', async (c: Context) => {
        const { database } = c.var;

        try {
            return c.json({
                themeConfig
            });

        } catch (error: any) {

            return c.json(error);
        }
    });

export { appConfigRoutes };
