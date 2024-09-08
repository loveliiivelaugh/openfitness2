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

const tables = pgTable('information_schema.tables', {
    table_name: text('table_name'),
    table_schema: text('table_schema')
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

export {
    // Fitness App
    tables,
    profile,
    exercise,
    food,
    sleep,
    steps,
    weight
};