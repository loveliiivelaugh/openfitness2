//DBConfig.js|tsx

export const DBConfig = {
    name: "openfitness-private-db",
    version: 1,
    objectStoresMeta: [
        {
            store: "weight",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "created_at", keypath: "created_at", options: { unique: false } },
                { name: "weight", keypath: "weight", options: { unique: false } },
                { name: "date", keypath: "date", options: { unique: false } },
                { name: "user_id", keypath: "user_id", options: { unique: false } },
                { name: "time", keypath: "time", options: { unique: false } },
            ],
        },
        {
            store: "profile",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "created_at", keypath: "created_at", options: { unique: false } },
                { name: "age", keypath: "age", options: { unique: false } },
                { name: "height", keypath: "height", options: { unique: false } },
                { name: "weight", keypath: "weight", options: { unique: false } },
                { name: "goal", keypath: "goal", options: { unique: false } },
                { name: "exercise", keypath: "exercise", options: { unique: false } },
                { name: "user_id", keypath: "user_id", options: { unique: false } },
                { name: "tdee", keypath: "tdee", options: { unique: false } },
                { name: "bmr", keypath: "bmr", options: { unique: false } },
            ],
        },
        {
            store: "food",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "created_at", keypath: "created_at", options: { unique: false } },
                { name: "name", keypath: "name", options: { unique: false } },
                { name: "calories", keypath: "calories", options: { unique: false } },
                { name: "date", keypath: "date", options: { unique: false } },
                { name: "time", keypath: "time", options: { unique: false } },
                { name: "nutrients", keypath: "nutrients", options: { unique: false } }, // For storing JSON data
                { name: "user_id", keypath: "user_id", options: { unique: false } },
                { name: "meal", keypath: "meal", options: { unique: false } },
                { name: "num_servings", keypath: "num_servings", options: { unique: false } },
                { name: "serving_size", keypath: "serving_size", options: { unique: false } },
            ],
        },
        {
            store: "exercise",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "created_at", keypath: "created_at", options: { unique: false } },
                { name: "name", keypath: "name", options: { unique: false } },
                { name: "reps", keypath: "reps", options: { unique: false } },
                { name: "sets", keypath: "sets", options: { unique: false } },
                { name: "date", keypath: "date", options: { unique: false } },
                { name: "time", keypath: "time", options: { unique: false } },
                { name: "muscle", keypath: "muscle", options: { unique: false } },
                { name: "difficulty", keypath: "difficulty", options: { unique: false } },
                { name: "equipment", keypath: "equipment", options: { unique: false } },
                { name: "instructions", keypath: "instructions", options: { unique: false } },
                { name: "type", keypath: "type", options: { unique: false } },
                { name: "user_id", keypath: "user_id", options: { unique: false } },
                { name: "weight", keypath: "weight", options: { unique: false } },
                { name: "calories_burned", keypath: "calories_burned", options: { unique: false } },
            ],
        },
        {
            store: "steps",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "created_at", keypath: "created_at", options: { unique: false } },
                { name: "value", keypath: "value", options: { unique: false } },
                { name: "startDate", keypath: "startDate", options: { unique: false } },
                { name: "endDate", keypath: "endDate", options: { unique: false } },
                { name: "duration", keypath: "duration", options: { unique: false } },
                { name: "type", keypath: "type", options: { unique: false } },
            ],
        },
        {
            store: "sleep",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "created_at", keypath: "created_at", options: { unique: false } },
                { name: "startDate", keypath: "startDate", options: { unique: false } },
                { name: "endDate", keypath: "endDate", options: { unique: false } },
                { name: "value", keypath: "value", options: { unique: false } },
                { name: "duration", keypath: "duration", options: { unique: false } },
            ],
        }
    ],
};