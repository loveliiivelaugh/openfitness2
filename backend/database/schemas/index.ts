import {
    date,
    json,
    integer,
    serial,
    text,
    time,
    timestamp,
    pgTable,
    uuid
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
//   import { createInsertSchema, createSelectSchema } from 'drizzle-zod';


export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}));
export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    authorId: integer('author_id').notNull(),
});
export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));


// // Define the model for the information_schema.tables table
// const Table = defineModel('information_schema.tables', {
//   columns: {
//       table_name: 'string',
//       table_schema: 'string'
//   }
// });

const tables = pgTable('information_schema.tables', {
    table_name: text('table_name'),
    table_schema: text('table_schema')
})

const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    messages: json('messages'),
    session_name: text('session_name').notNull().default("New Chat"),
    user_id: uuid('user_id').notNull(),
    session_id: uuid('session_id').notNull().defaultRandom(),
});

const models = pgTable('models', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    value: text('value').notNull(),
    description: text('description'),
    notes: text('notes'),
});

const inventory = pgTable('inventory', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    inventory_name: text('inventory_name').notNull(),
    description: text('description'),
    photo: text('photo'),
});

const blogs = pgTable('blogs', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    name: text('name').notNull(),
    page_id: text('page_id'),
});


const exercise = pgTable('exercise', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    name: text('name').notNull(),
    reps: integer('reps').notNull(),
    sets: integer('sets').notNull(),
    date: date('date').notNull().defaultNow(),
    time: time('time').notNull().defaultNow(),
    muscle: text('muscle'),
    difficulty: text('difficulty'),
    equipment: text('equipment'),
    instructions: text('instructions'),
    type: text('type'),
    user_id: uuid('user_id').notNull(),
    weight: integer('weight').notNull(),
    calories_burned: integer('calories_burned'),
});


const food = pgTable('food', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    name: text('name').notNull(),
    calories: integer('calories').notNull(),
    date: date('date').notNull().defaultNow(),
    time: time('time').notNull().defaultNow(),
    nutrients: json('nutrients'),
    user_id: uuid('user_id'),
    meal: text('meal', { enum: ['snack', 'breakfast', 'lunch', 'dinner'] }).notNull(),
    num_servings: integer('num_servings').notNull().default(1),
    serving_size: integer('serving_size').notNull().default(1)
});

const sleep = pgTable('sleep', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    "startDate": date('startDate').notNull().defaultNow(),
    "endDate": date('endDate').notNull().defaultNow(),
    value: text('value').notNull(),
    duration: text('duration').notNull(),
});

const steps = pgTable('steps', {
    id: serial('id').primaryKey().notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    value: integer('value').notNull(),
    "startDate": date('startDate').notNull().defaultNow(),
    "endDate": date('endDate').notNull().defaultNow(),
    duration: text('duration').notNull(),
    type: text('type').notNull(),
});

const weight = pgTable('weight', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    weight: integer('weight').notNull(),
    date: date('date').notNull().defaultNow(),
    user_id: uuid('user_id').notNull(),
    time: time('time').notNull().defaultNow(),
});

const profile = pgTable('profile', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    age: integer('age').notNull(),
    height: integer('height').notNull(),
    weight: integer('weight').notNull(),
    goal: text('goal', { enum: ['lose', 'maintain', 'gain'] }).notNull(),
    exercise: text('exercise', { enum: ['sedentary', 'lightly active', 'active', 'very active'] }).notNull(),
    user_id: uuid('user_id').notNull(),
    tdee: integer('tdee').notNull(),
    bmr: integer('bmr').notNull(),
});

const cross_platform_apps = pgTable('cross_platform_apps', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    desitination_url: text('destination_url'),
    desitination_app: text('destination_app'),
    url: text('url'),
    user_id: uuid('user_id').notNull(),
    source: text('source'),
    appId: text('appId', { enum: ['FamilyApps', 'Fitness', 'AI', 'camera'] }),
    data: json('data'),
    token: text('token').notNull(),
});

const user_roles = pgTable('user_roles', {
    id: serial('id').primaryKey(),
    user_id: uuid('user_id').notNull(),
    role: text('role').notNull(),
});


//   // Schema for inserting a user - can be used to validate API requests
//   const insertUserSchema = createInsertSchema(users);
//   // Schema for selecting a user - can be used to validate API responses
//   const selectUserSchema = createSelectSchema(users);

//   // OpenFitness App inferred validations
//   const insertWeightSchema = createInsertSchema(weight, {
//     id: (schema) => schema.id.positive(),
//     weight: (schema) => schema.weight.int().gte(1).lte(500).positive().safe(),
//   });
//   const selectWeightSchema = createSelectSchema(weight);

//   const insertProfileSchema = createInsertSchema(profile, {
//     id: (schema) => schema.id.positive(),
//     height: (schema) => schema.height.int().gte(1).lte(90).positive().safe(),
//     weight: (schema) => schema.weight.int().gte(1).lte(500).positive().safe(),
//     age: (schema) => schema.age.int().gte(1).lte(100).positive().safe(),
//     tdee: (schema) => schema.tdee.int().gte(1).lte(15000).positive().safe(),
//     bmr: (schema) => schema.bmr.int().gte(1).lte(15000).positive().safe(),
//     user_id: (schema) => schema.user_id.uuid(),
//     // exercise: (schema) => schema.exercise.text(),
//   });
//   const selectProfileSchema = createSelectSchema(profile);

//   const insertFoodSchema = createInsertSchema(food, {
//     calories: (schema) => schema.calories.int().gte(1).lte(10000).positive().safe(),
//     num_servings: (schema) => schema.num_servings.int().gte(1).lte(20).positive().safe(),
//     serving_size: (schema) => schema.serving_size.int().gte(1).lte(20).positive().safe(),
//   });
//   const selectFoodSchema = createSelectSchema(food);

//   const insertSleepSchema = createInsertSchema(sleep);
//   const selectSleepSchema = createSelectSchema(sleep);

//   const insertExerciseSchema = createInsertSchema(exercise);
//   const selectExerciseSchema = createSelectSchema(exercise);

//   const insertStepsSchema = createInsertSchema(steps);
//   const selectStepsSchema = createSelectSchema(steps);

//   // AiChat App inferred validations
//   const insertChatsSchema = createInsertSchema(chats);
//   const selectChatsSchema = createSelectSchema(chats);

//   const insertModelsSchema = createInsertSchema(models);
//   const selectModelsSchema = createSelectSchema(models);

//   const insertBlogsSchema = createInsertSchema(blogs);
//   const selectBlogsSchema = createSelectSchema(blogs);

//   // CrossPlatform Apps inferred validations
//   const insertCrossPlatformAppsSchema = createInsertSchema(cross_platform_apps);
//   const selectCrossPlatformAppsSchema = createSelectSchema(cross_platform_apps);

//   const insertInventorySchema = createInsertSchema(inventory);
//   const selectInventorySchema = createSelectSchema(inventory);

//   const validations = {
//     insertWeightSchema,
//     selectWeightSchema,
//     insertProfileSchema,
//     selectProfileSchema,
//     insertFoodSchema,
//     selectFoodSchema,
//     insertSleepSchema,
//     selectSleepSchema,
//     insertExerciseSchema,
//     selectExerciseSchema,
//     insertStepsSchema,
//     selectStepsSchema,
//     insertChatsSchema,
//     selectChatsSchema,
//     insertModelsSchema,
//     selectModelsSchema,
//     insertBlogsSchema,
//     selectBlogsSchema,
//     insertCrossPlatformAppsSchema,
//     selectCrossPlatformAppsSchema,
//     insertInventorySchema,
//     selectInventorySchema
//   };

//   const validationMap = {
//     profile: validations.insertProfileSchema,
//     food: validations.insertFoodSchema,
//     exercise: validations.insertExerciseSchema,
//     weight: validations.insertWeightSchema,
//     sleep: validations.insertSleepSchema,
//     steps: validations.insertStepsSchema
//   };

export {
    // Woodward DB
    tables,
    // Storage App
    inventory,
    // Chat App
    chats,
    models,
    blogs,
    // Fitness App
    profile,
    exercise,
    food,
    sleep,
    steps,
    weight,
    // Cross Platform App
    cross_platform_apps,
    // User Roles
    user_roles,
    // Inferred Valiations
    // validations,
    // validationMap,
};