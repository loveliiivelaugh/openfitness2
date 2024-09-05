import { Hono } from 'hono'
// Middleware
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers'
import { showRoutes } from 'hono/dev'
// Utilities
import { createDatabaseMiddleware } from '../database';
import { initDatabase } from '../config/supabase.config';
import { corsConfig, initApiClients } from '../config/clients.config';
import { routes } from './routes';


// Server
const port = Bun.env.PORT || 5001;

const app = new Hono();

// Middleware
app.use(logger());
app.use(poweredBy());
app.use(cors(corsConfig));
app.use(prettyJSON({ space: 4 }));
app.use(secureHeaders());

// Database (For Production: Supabase *for now*)
app.use(createDatabaseMiddleware(initDatabase()));

// Set up + authenticate External API Clients
app.use(initApiClients());

// Routes
app.route('/', routes);

showRoutes(app, {
  verbose: true
});

export default { 
  port, 
  fetch: app.fetch
};
