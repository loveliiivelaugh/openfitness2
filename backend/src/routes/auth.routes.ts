import { Hono } from 'hono';
import { Context } from 'hono';
import { validator } from 'hono/validator';
import { supabase } from '../../config/supabase.config';


const authRoutes = new Hono();

authRoutes
    .post(
        '/login/:type',
        validator('json', (value: any, c: Context) => {
            return value;
        }),
        async (c: Context) => {
            const { type } = c.req.param();
            const validatedData = c.req.valid("json" as "json");

            try {
                const { data, error } = (type === "user")
                    ? await supabase.auth.signInWithPassword(validatedData)
                    : await supabase.auth.signInAnonymously();

                return c.json(data);

            } catch (error: any) {
                console.error(error, "SOMETHING WENT WRONG")

                return c.json(error)
            }
        })
    .post(
        '/signup', 
        validator('json', (value: any, c: Context) => {
            return value;
        }),
        async (c: Context) => {
            const validatedData = c.req.valid("json" as "json");
            try {
                const { data, error } = await supabase.auth.signUp(validatedData);

                return c.json(data);

            } catch (error: any) {
                console.error(error, "SOMETHING WENT WRONG")

                return c.json(error)
            }
        })
    .post(
        '/protected', 
        validator('json', (value: any, c: Context) => {
            return value;
        }),
        async (c: Context) => {
            const validatedData: { token: string } = c.req.valid("json" as "json");
            // const jwt = await c.req.header("authorization")
            try {
                // console.log("In PROTECTED.jwt: ", jwt)
                // const { data, error } = await supabase.auth.getUser(validatedData.token);
                

                return c.json(validatedData);

            } catch (error: any) {
                console.error(error, "SOMETHING WENT WRONG")

                return c.json(error)
            }
        })
    .get('/logout', async (c: Context) => {

        try {
            const response = await supabase.auth.signOut();

            return c.json(response);

        } catch (error: any) {
            console.error(error, "SOMETHING WENT WRONG")

            return c.json(error)
        }
    });


export { authRoutes }