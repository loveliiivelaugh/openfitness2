import { Hono } from 'hono';
import { Context } from 'hono';
import { validator } from 'hono/validator';

const signinRoutes = new Hono();

signinRoutes
    .post('/', validator('json', (value: any, c: Context) => {
        // Validations on the server side for POST requests

        // const parsed = (validationMap[table as keyof typeof validationMap] as any)
        //     .safeParse(formattedValues);

        // if (!parsed.success) return c.text('Invalid!', 401);

        // return parsed.data;

        return value;

    }),
    async (c: Context) => {
        const { database } = c.var;
        const payload = await c.req.valid("json" as "json");
        const { email, password, employee_id } = payload;

        console.log("/api/signin: ", payload);

        try {

            if (email) {
            const result = await database
                .query
                .staff
                .findMany()
                // .where(eq(schema.staff.id, employee_id))
                // .returning();

            const found = result.find((staff: any) => staff.password === email);

            if (!result) {
                return c.text("Invalid email or password", 401);
            }

            // TODO: Add properties to table; 
            // ... logged_in, last_login, table_count etc. 
            // ... and Update values

            return c.json(found);
            }

            else return c.text("Invalid email or password", 401);

        } catch (error: any) {
            console.error(error);

            return c.json(error);
        }
    })

export { signinRoutes };