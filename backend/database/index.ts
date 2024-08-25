// Packages
import { createMiddleware } from 'hono/factory';
import * as schema from './schemas';


const createDatabaseMiddleware = (db: any) => createMiddleware(async (c, next) => {
    c.set('database', db);
    await next();
});


export { schema, createDatabaseMiddleware };