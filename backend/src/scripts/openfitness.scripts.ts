import * as schema from "../../database/schemas";

export const openfitnessScripts = {

    // Description: group data by date
    groupDataByDate: (data: Array<any>, dateKey: string) => data
        .reduce((acc, curr) => {
            const date = curr[dateKey];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(curr);
            return acc;
        }, {}),

    extractMacrosFromFoodData: (groupedFoodData: Array<any>, foodDataDates: Array<any>) => {
        foodDataDates.map(date => {
            const rowsByDate = groupedFoodData[date]
            const totalFatCalories = rowsByDate.reduce((total: number, row: any) => (row.nutrients?.total_fat * 9) + total, 0)
            const totalProteinCalories = rowsByDate.reduce((total: number, row: any) => (row.nutrients?.protein * 4) + total, 0)
            const totalCarbsCalories = rowsByDate.reduce((total: number, row: any) => (row.nutrients?.total_carbohydrate * 4) + total, 0)
            const totalCalories = rowsByDate.reduce((total: number, row: any) => row.nutrients?.calories + total, 0)
        
            return {
                date,
                rowsByDate,
                totalFatCalories,
                totalProteinCalories,
                totalCarbsCalories,
                totalCalories
            }
        });
    },

    groupExerciseDataByDateAndMuscle: (groupedExerciseData: Array<any>, exerciseDataDates: Array<any>) => {
        exerciseDataDates.map(date => {
            const rowsByDate = groupedExerciseData[date];
            const muscleGroups = [...new Set(rowsByDate.map((row: any) => row.muscle)) as any]
            const groupedByMuscle = muscleGroups.map(muscleGroup => {
                const groupedExercises = rowsByDate.filter(({ muscle }: { muscle: string }) => muscle === muscleGroup)
                const totalCaloriesBurned = rowsByDate.reduce((total: number, exercise: any) => (exercise.calories_burned + total), 0)

                return {
                    muscleGroup,
                    exercises: groupedExercises,
                    totalCaloriesBurned
                }
            })
            const caloriesBurned = rowsByDate.reduce((total: number, row: any) => row.calories_burned + total, 0)

            return {
                date,
                rowsByDate,
                caloriesBurned,
                rowsByDayAndMuscle: groupedByMuscle
            }
        })
    },

    extractMacros: (nutrients: any, macroType: "fat" | "carbs" | "protein") => {

        if (!nutrients[macroType]) return 0
        if (nutrients[macroType] === null) return 0

        switch (macroType) {
            case "fat":
                return (nutrients[macroType || "total_fat"] * 9)
            case "carbs":
                return (nutrients[macroType || "total_carbohydrate"] * 4)
            case "protein":
                return (nutrients[macroType || "protein"] * 4)
            default:
                return 0
        }
    },

    checkIsTodaysDate: (date: Date) => {
        // Create a Date object representing the date you want to check
        const dateToCheck = new Date(date) || date;

        // Get the current date
        const currentDate = new Date();

        // Check if the date to check has the same year, month, and day as the current date
        const isToday = dateToCheck.getDate() === currentDate.getDate() &&
            dateToCheck.getMonth() === currentDate.getMonth() &&
            dateToCheck.getFullYear() === currentDate.getFullYear();

        return isToday;
    },

    getTodaysData: (table: any) => table || table
        .filter(({ date }: { date: Date }) => openfitnessScripts
            .checkIsTodaysDate(date)
        ),
    
    getFoodDataDeduction: (foodTable: any) => ({
        // Calculate the total calories consumed for the day
        todays_calories_consumed: openfitnessScripts.getTodaysData(foodTable)
            .reduce((total: number, food: any) => (total + food.calories), 0),

        total_fat: openfitnessScripts.getTodaysData(foodTable)
            .reduce((totalFat: number, nutrients: any) => (
                openfitnessScripts
                    .extractMacros(nutrients, "fat") + totalFat
                ), 0),
        total_carbs: openfitnessScripts.getTodaysData(foodTable)
            .reduce((totalCarbs: number, nutrients: any) => (
                openfitnessScripts
                    .extractMacros(nutrients, "carbs") + totalCarbs
                ), 0),
        total_protein: openfitnessScripts.getTodaysData(foodTable)
            .reduce((totalProtein: number, nutrients: any) => (
                openfitnessScripts
                    .extractMacros(nutrients, "protein") + totalProtein
                ), 0),
    }),

    getExerciseDataDeduction: (exerciseTable: any, stepsTable: any) => ({

        total_steps: openfitnessScripts.getTodaysData(stepsTable)
            .reduce((total: number, steps: any) => (total + steps.value), 0),

        total_exercise_calories: openfitnessScripts.getTodaysData(exerciseTable)
            .reduce((total: number, exercise: any) => (total + exercise.calories_burned), 0),
    }),

    getChartsData: (props: any) => {
        const {
            profileTable,
            foodTable,
            exerciseTable,
            sleepTable,
            stepsTable,
            weightTable,
            foodDataDeduction
        } = props;

        const today = new Date();
        const xAxis = [{ data: [] }];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            xAxis[0].data.push(date.getDate() as never);
        }

        const chartsData = {
            profile: {
                table: {
                    title: "Health Profile",
                    columns: Object
                        .keys(profileTable[0])
                        .map((key) => ({ 
                            field: key, 
                            headerName: key, 
                            width: 150,
                            ...["goal", "exercise"]
                                .includes(key) && { 
                                    valueGetter: (input: any) => input + ":custom-render"
                                }
                        })),
                    rows: profileTable
                }
            },

            food: {
                pie: {
                    title: "Today's Calories Consumed by Macronutrients",
                    data: ['fat', 'carbs', 'protein']
                        .map((type, index) => ({
                            id: index,
                            value: foodDataDeduction[`total_${type}`],
                            label: type
                        }))
                },
                bar: {
                    title: "Today's Calories Consumed by Macronutrients",
                    filters: ["Today", "Yesterday", "Last Week", "Last 30 Days", "All Time"],
                    series: [
                        {
                            data: [
                                foodDataDeduction.total_fat || (5000 * 0.2),
                                foodDataDeduction.total_carbs || (5000 * 0.45),
                                foodDataDeduction.total_protein || (5000 * 0.35)
                            ]
                        },
                        {
                            data: [
                                foodDataDeduction.total_fat || (5000 * 0.2),
                                foodDataDeduction.total_carbs || (5000 * 0.45),
                                foodDataDeduction.total_protein || (5000 * 0.35)
                            ]
                        },
                        {
                            data: [
                                foodDataDeduction.total_fat || (5000 * 0.2),
                                foodDataDeduction.total_carbs || (5000 * 0.45),
                                foodDataDeduction.total_protein || (5000 * 0.35)
                            ]
                        },
                        {
                            data: [
                                foodDataDeduction.total_fat || (5000 * 0.2),
                                foodDataDeduction.total_carbs || (5000 * 0.45),
                                foodDataDeduction.total_protein || (5000 * 0.35)
                            ]
                        },
                    ],
                    xAxis: [
                        {
                            data: ['Fat', 'Carbs', 'Protein'],
                            scaleType: 'band'
                        }
                    ]
                },
                line: {
                    title: "Daily Calories Consumed by Macronutrients (Last 7 Days)",
                    xAxis: xAxis,
                    series: [
                        {
                            data: [550, 650, 200, 400, 450, 340, 300]
                        },
                        {
                            data: [1200, 1000, 1100, 1200, 1200, 1000, 1200]
                        },
                        {
                            data: [450, 700, 300, 400, 450, 350, 450]
                        },
                    ]
                },
                table: {
                    title: "Total Food Logged",
                    columns: Object
                        .keys(schema.food)
                        .map((key) => ({ 
                            field: key, 
                            headerName: key, 
                            width: 150 
                        })),
                    rows: foodTable
                }
            },

            exercise: {
                pie: {
                    title: "Today's Calories Burned by Muscle Group",
                    data: [
                        "chest",
                        "back",
                        "legs",
                        "shoulders",
                        "biceps",
                        "triceps",
                        "abs"
                    ].map((muscleGroup, index) => ({
                        id: index,
                        value:  30 || openfitnessScripts.getTodaysData(exerciseTable)
                            .filter((exercise: any) => (exercise.muscle_group === muscleGroup))
                            .reduce((total: number, exercise: any) => (total + exercise.calories_burned), 0),
                        label: muscleGroup
                    }))
                },
                bar: {
                    title: "Today's Calories Burned by Muscle Group",
                    series: [
                        {
                            data: [
                                50, 100, 200, 30, 20, 50, 50
                            ]
                        }
                    ],
                    xAxis: [
                        {
                            data: [
                                "chest",
                                "back",
                                "legs",
                                "shoulders",
                                "biceps",
                                "triceps",
                                "abs"
                            ],
                            scaleType: 'band'
                        }
                    ]
                },
                line: {
                    title: "Daily Calories Burned by Muscle Group (Last 7 Days)",
                    xAxis: xAxis,
                    series: [
                        {
                            data: [100, 0, 120, 15, 80, 0, 0]
                        },
                        {
                            data: [20, 230, 10, 0, 100, 0, 0]
                        },
                        {
                            data: [240, 230, 180, 300, 200, 170, 100]
                        },
                        {
                            data: [15, 10, 0, 130, 0, 10, 0]
                        },
                        {
                            data: [20, 100, 10, 100, 10, 0, 0]
                        },
                        {
                            data: [100, 10, 80, 20, 80, 20, 10]
                        },
                        {
                            data: [40, 40, 40, 40, 40, 40, 40]
                        },
                    ]
                },
                table: {
                    title: "Total Exercises Logged",
                    columns: Object
                        .keys(schema.exercise)
                        .map((key) => ({ 
                            field: key, 
                            headerName: key, 
                            width: 150 
                        })),
                    rows: exerciseTable
                }
            },

            steps: {
                pie: {
                    title: "Today's Steps by Time of Day",
                    data: [
                        "morning",
                        "afternoon",
                        "evening",
                    ]
                    .map((timeOfDay, index) => ({
                        id: index,
                        value: 200 || openfitnessScripts.getTodaysData(stepsTable)
                            .filter((step: any) => (step.time === timeOfDay))
                            .reduce((total: number, step: any) => (total + step.value), 0),
                        label: timeOfDay
                    }))
                },
                bar: {
                    title: "Today's Steps by Time of Day",
                    series: [
                        {
                            data: [
                                300, 1400, 500
                            ]
                        }
                    ],
                    xAxis: [
                        {
                            data: ['Morning', 'Afternoon', 'Evening'],
                            scaleType: 'band'
                        }
                    ]
                },
                line: {
                    title: "Daily Steps by Time of Day (Last 7 Days)",
                    xAxis: xAxis,
                    series: [
                        {
                            data: [200, 300, 100, 250, 300, 200, 200]
                        },
                        {
                            data: [500, 400, 300, 200, 300, 400, 300]
                        },
                        {
                            data: [300, 200, 340, 230, 100, 300, 230]
                        },
                    ]
                },
                table: {
                    title: "Total Steps Logged",
                    columns: Object
                        .keys(schema.steps)
                        .map((key) => ({ 
                            field: key, 
                            headerName: key, 
                            width: 150 
                        })),
                    rows: stepsTable
                }
            },

            sleep: {
                pie: {
                    title: "Today's Sleep by Sleep Type",
                    data: [
                        "awake",
                        "light",
                        "deep",
                        "rem",
                    ]
                    .map((timeOfDay, index) => ({
                        id: index,
                        value: 40 || openfitnessScripts.getTodaysData(sleepTable),
                            // .filter((sleep) => ((sleep.startTime) === timeOfDay))
                            // .reduce((total, sleep) => (total + sleep.duration), 0),
                        label: timeOfDay
                    }))
                },
                bar: {
                    title: "Today's Sleep by Sleep Type",
                    series: [
                        {
                            data: [
                                100, 70, 20, 10
                            ]
                        }
                    ],
                    xAxis: [
                        {
                            data: [
                                "Awake",
                                "Light",
                                "Deep",
                                "REM",
                            ],
                            scaleType: 'band'
                        }
                    ]
                },
                line: {
                    title: "Daily Sleep by Sleep Type (Last 7 Days)",
                    xAxis: xAxis,
                    series: [
                        {
                            data: [ 0, 0, 0, 0, 0, 0, 0 ]
                        },
                        {
                            data: [ 6, 4, 3, 4, 3, 2.6, 4 ]
                        },
                        {
                            data: [ 1, 2, 3, 2, 3, 3, 1 ]
                        },
                        {
                            data: [ 0, 1, 0, 1, 0, 0, 2 ]
                        },
                    ]
                },
                table: {
                    title: "Total Sleep Logged",
                    columns: Object
                        .keys(schema.sleep)
                        .map((key) => ({ 
                            field: key, 
                            headerName: key, 
                            width: 150 
                        })),
                    rows: sleepTable
                }
            },

            weight: {
                table: {
                    title: "Total Weight Logged",
                    columns: Object
                        .keys(schema.weight)
                        .map((key) => ({ 
                            field: key, 
                            headerName: key, 
                            width: 150 
                        })),
                    rows: weightTable
                },
                bar: {
                    title: "Today's Weight",
                    series: [
                        {
                            data: [
                                215, 205
                            ]
                        }
                    ],
                    xAxis: [
                        {
                            data: ['Weight', 'Goal Weight'],
                            scaleType: 'band'
                        }
                    ]
                },
                line: {
                    title: "Daily Weight (Last 7 Days)",
                    xAxis: xAxis,
                    series: [
                        {
                            data: [ 215, 212, 216, 215, 212, 208, 210 ]
                        }
                    ]
                },
                pie: {
                    title: "Today's Weight",
                    data: [
                        {
                            id: 0,
                            value: 215 || openfitnessScripts.getTodaysData(weightTable),
                            label: "Weight"
                        }
                    ]
                }
            }

        };

        return chartsData;
    },

    exitGetAllTables: (error: string | any | null) => {
        const tables = {
            error: true,
            profile: null,
            exercise: null,
            food: null,
            sleep: null,
            steps: null,
            weight: null,
            meta: null,
            charts: null,
            macros: null,
            inProgress: {
                foodDataWithMacrosExtracted: null,
                exerciseDataByDateAndMuscle: null,
                groupedSleepData: null,
                groupedStepsData: null,
                groupedWeightData: null
            },
            problem: error
        };

        return tables;
    },

    // Description: get all tables for OpenFitness app and format data ...
    // ... for each table by date and for each chart type available in the app
    getAllTables: async (db: any) => {
        const queryOptions = {
            columns: {
                created_at: false,
                updated_at: false,
                user_id: false,
                // nutrients: false,
            },
        };
    
        const requestTables = [
            'profile',
            'exercise',
            'food',
            'sleep',
            'steps',
            'weight',
        ];
    
        console.log("openfitness.scripts.getAllTables: ", db);
        try {
            const tablesResults = await Promise
                .all(requestTables
                    .map(async (table: string) => await db
                        .query
                        ?.[table]
                        .findMany(queryOptions)
                        // .where(eq(table.date, new Date()))
                    )
                );

            const [
                // Assign tables data to variables
                profileTable,
                exerciseTable,
                foodTable,
                sleepTable,
                stepsTable,
                weightTable,
            ] = tablesResults;

            console.log("openfitness.scripts.getAllTables.results: ", profileTable, exerciseTable, foodTable, sleepTable, stepsTable, weightTable);
            if (!profileTable || !exerciseTable || !foodTable || !sleepTable || !stepsTable || !weightTable) {
                return openfitnessScripts.exitGetAllTables("Missing table data");
            };

            const { groupDataByDate } = openfitnessScripts;
            const groupedExerciseData = groupDataByDate(exerciseTable, 'date');
            const groupedFoodData = groupDataByDate(foodTable, 'date');
            const groupedWeightData = groupDataByDate(weightTable, 'date');
            const groupedSleepData = groupDataByDate(sleepTable, 'startDate');
            const groupedStepsData = groupDataByDate(stepsTable, 'startDate');
    
            // Formatting the food data to be used in different charts
            const foodDataDates = Object.keys(groupedFoodData);
            const foodDataWithMacrosExtracted = openfitnessScripts
                .extractMacrosFromFoodData(groupedFoodData, foodDataDates);

            const exerciseDataDates = Object.keys(groupedExerciseData);
            const exerciseDataByDateAndMuscle = openfitnessScripts
                .groupExerciseDataByDateAndMuscle(groupedExerciseData, exerciseDataDates);
            
            const foodDataDeduction = openfitnessScripts
                .getFoodDataDeduction(foodTable);

            const exerciseDataDeduction = openfitnessScripts
                .getExerciseDataDeduction(exerciseTable, stepsTable);

            const chartsData = openfitnessScripts.getChartsData({
                profileTable,
                foodTable,
                exerciseTable,
                sleepTable,
                stepsTable,
                weightTable,
                foodDataDeduction
            });


            const total_steps_calories = (exerciseDataDeduction.total_steps * 0.04);
            // Total calories from steps + total_exercise_calories
            const total_active_calories = (total_steps_calories + exerciseDataDeduction.total_exercise_calories);

            const dataExtract = {
                ...foodDataDeduction,
                ...exerciseDataDeduction,
                total_calories_remaining: (
                    // Total Daily Energy Expenditure (TDEE) *Minimum Daily Calories Required*
                    profileTable[0].tdee 
                    // Algorithmic Adjustment to TDEE based on weight goal
                    + profileTable[0].goal
                    // Add total active calories to daily calories burned
                    + total_active_calories
                    // Minus the amount of daily calories consumed 
                    - foodDataDeduction.todays_calories_consumed
                ),
            };


            const macrosKpis = [
                {
                    label: "Total Calories Consumed",
                    key: "todays_calories_consumed",
                    value: dataExtract.todays_calories_consumed || 0 // default value
                },
                {
                    label: "Fat",
                    key: "total_fat",
                    value: dataExtract.total_fat || 0
                },
                {
                    label: "Carbs",
                    key: "total_carbs",
                    value: dataExtract.total_carbs || 0
                },
                {
                    label: "Protein",
                    key: "total_protein",
                    value: dataExtract.total_protein || 0
                },
                {
                    label: "Calories Remaining",
                    key: "total_calories_remaining",
                    value: dataExtract.total_calories_remaining || 5200
                },
            ];

            const tables = {
                profile: profileTable,
                exercise: exerciseTable,
                food: foodTable,
                sleep: sleepTable,
                steps: stepsTable,
                weight: weightTable,
                meta: dataExtract,
                charts: chartsData,
                macros: macrosKpis,
                inProgress: {
                    foodDataWithMacrosExtracted,
                    exerciseDataByDateAndMuscle,
                    groupedSleepData,
                    groupedStepsData,
                    groupedWeightData
                }
            };

            return tables;
            
        } catch (error) {
            console.error(error);
            return openfitnessScripts.exitGetAllTables(error);
        }
    },
    
};
