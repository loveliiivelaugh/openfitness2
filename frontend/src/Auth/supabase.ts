
// import { pgTable } from 'drizzle-orm/pg-core';
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';

import { createClient } from '@supabase/supabase-js';

const { 
    // VITE_SUPABASE_CONNECTION_STRING: connectionString,
    VITE_SUPABASE_KEY,
    VITE_SUPABASE_URL
} = import.meta.env;

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

// const schema = {
//     profile: pgTable('profile', {
//         //    ...
//     }),
//     exercises: pgTable('exercises', {
//         //    ...
//     }),
//     //    ...
//     //    ...
//     //    ...
// };

// const client = postgres(connectionString);

// const database = drizzle(client, { schema });

export { 
    supabase, // Supabase client // For auth methods
    // database  // Drizzle client // For database methods
};