import { Hono } from 'hono';
import { Context } from 'hono';

import { appConfigRoutes } from './appConfig.routes';
import { databaseRoutes } from './database.routes';
import { openfitnessRoutes } from './openfitness.routes';


const paths = {
    "appConfig": "/api/v1/appConfig",
    "database": "/api/v1/database",
    "openfitness": "/api/v1/openfitness"
};

const routes = new Hono();


routes.get('/', (c: Context) => {
    return c.text("Openfitness Backend routes")
});  

routes.route(paths.appConfig, appConfigRoutes);
routes.route(paths.database, databaseRoutes);
routes.route(paths.openfitness, openfitnessRoutes);

export { routes };