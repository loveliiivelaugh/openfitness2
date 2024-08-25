import { Hono } from 'hono';
import { Context } from 'hono';

import { appConfigRoutes } from './appConfig.routes';
import { signinRoutes } from './auth.routes';
import { databaseRoutes } from './database.routes';
import { openfitnessRoutes } from './openfitness.routes';


const paths = {
    "auth": "/api/v1/auth",
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
routes.route(paths.auth, signinRoutes);
routes.route(paths.openfitness, openfitnessRoutes);

export { routes };