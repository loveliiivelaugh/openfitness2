import { Hono } from 'hono';
import { Context } from 'hono';
import { eq } from 'drizzle-orm';

import * as schema from '../../database/schemas';
import { cms } from '../../config/cms';
import { themeConfig } from '../../config/theme.config';


const appConfigRoutes = new Hono();


appConfigRoutes
    .get('/', async (c: Context) => {
        const { database, jwtPayload } = c.var;

        try {
            const result = await database
                .query
                .cross_platform_apps
                .findMany();
            
            // Should be able to filter by cpx id

            console.log("appConfigRoutes: ", result, jwtPayload);
            // Get user role from database --> Should have been saved with initial login
            const rolesData = (await database
                .select()
                .from(schema.user_roles)
                .where(eq(schema.user_roles.user_id, (jwtPayload.data.user as any).id))
            );

            const role: string = JSON.parse(rolesData[0].role)[0];
            console.log("role: ", cms.apps, role);
            return c.json({
                cms: {
                    ...cms,
                    // Only return apps that the user has access to
                    apps: cms.apps
                        .map((app: { roles: string[] }) => app.roles.includes(role) 
                            ? app 
                            : null
                        ).filter(Boolean),
                    dockerApps: cms.dockerApps
                        .map((app: { roles: string[] }) => app.roles.includes(role) 
                            ? app 
                            : null
                        ).filter(Boolean),
                },
                themeConfig,
                crossPlatformStateTable: result
            }, 200);

        } catch (error: any) {

            return c.json(error, 500);
        }
    });

export { appConfigRoutes };
