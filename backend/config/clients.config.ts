import axios from 'axios';
import { createMiddleware } from 'hono/factory';


interface BasicAuthConfig {
    username: string;
    password: string;
}

const basicAuthConfig = <BasicAuthConfig>{
    username: Bun.env.BASIC_AUTH_USERNAME,
    password: Bun.env.BASIC_AUTH_PASSWORD,
};

const trustedSources: string[] = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
];

const allowedHeaders: string[] = [
    'authorization', 
    'auth-token',
    'Content-Type'
];

const corsConfig = {
    origin: trustedSources, 
    allowHeaders: allowedHeaders,
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true
};

const secrets = {
    nutritionix_app_id: Bun.env.NUTRITIONIX_APP_ID,
    nutritionix_key: Bun.env.NUTRITIONIX_KEY,
    api_ninjas_key: Bun.env.API_NINJAS_KEY
};

// Initialize external API clients with secrets
const initApiClients = () => createMiddleware(async (c, next) => {
    // upgradeWebSocket experimental to handle websocket traffic

    const nutritionixClient = axios.create({
        baseURL: `https://trackapi.nutritionix.com/v2`,
        headers: {
            'Content-Type': 'application/json',
            'x-app-id': secrets.nutritionix_app_id,
            'x-app-key': secrets.nutritionix_key
        }
    });

    const exerciseClient = axios.create({
        baseURL: `https://api.api-ninjas.com/v1`,
        headers: {
            'x-api-key': secrets.api_ninjas_key
        }
    });

    const clients = {
        nutritionixClient,
        exerciseClient
    };

    c.set('clients', clients);

    await next();
});

export { 
    initApiClients, 
    basicAuthConfig,
    corsConfig,
    trustedSources
};