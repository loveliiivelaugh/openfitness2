import postgres from 'postgres'
// import { createClient } from '@supabase/supabase-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schemas'


// const {
//     SUPABASE_URL: supabaseUrl,
//     SUPABASE_PUBLIC_KEY: supabaseAnonKey,
// } = Bun.env;

// const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);


const connectionString = (Bun.env.SUPABASE_CONNECTION_STRING as string);

function initDatabase() {
    try {
        console.info("Connecting to Supabase...")

        const client = postgres(connectionString)
        const db = drizzle(client, { schema });

        console.info("Connected to Supabase!")
        
        return db;

    } catch (error) {
        
        console.error(error, "Error connecting to Supabase");
        return error;
    }
};


export { initDatabase } //, supabase };