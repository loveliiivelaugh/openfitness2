import { Hono } from 'hono';
import { Context } from 'hono';

import { appConfigRoutes } from './appConfig.routes';
import { databaseRoutes } from './database.routes';
import { openfitnessRoutes } from './openfitness.routes';
import { authRoutes } from './auth.routes';
import { githubRoutes } from './github.routes';


const paths = {
    "appConfig": "/api/v1/appConfig",
    "database": "/api/v1/database",
    "openfitness": "/api/v1/openfitness",
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

export { routes };