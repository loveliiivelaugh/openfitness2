// OpenFitness Scripts
export const openfitnessScripts = {
    calculate: {
        // Basal Metabolic Rate
        bmr: (params: any) => {
            const kg = ((params?.weight || 0) * 0.4535924);
            const bmr = (20 * kg);
            return bmr
        },
        // Thermic Effect of Eating
        tef: (params: any) => {
            return ((params?.bmr || 0) * 0.1);
        },
        // Exercise Energy Expenditure
        eee: (params: { activity: string }) => {
            return ({
                'sedentary': 0,
                'lightly': 250,
                'moderate': 325,
                'vigorous': 425,
                'extreme': 500
            }[params.activity] || 250);
        },
        // Non-Exercise Activity Thermogenesis
        neat: (params: { activity: string }) => {
            return ({
                'sedentary': 0,
                'lightly': 250,
                'moderate': 325,
                'vigorous': 425,
                'extreme': 500
            }[params.activity] || 250);
        },
        // Total Daily Energy Expenditure
        tdee: (params: any) => {
            const bmr = openfitnessScripts.calculate.bmr({ weight: params.weight });
            const tef = openfitnessScripts.calculate.tef({ bmr });
            const eee = openfitnessScripts.calculate.eee(params) as number;
            const neat = openfitnessScripts.calculate.neat(params) as number;
            return (bmr + tef + eee + neat);
        }
    },

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

    extractMacros: (nutrients: any, macroType: string) => {
        // const response = await client.get("/openfitness/getItem/" + nutrients.nutrients.nix_item_id)
        // console.log("extractMacros: ", nutrients, macroType)
        if (!nutrients[macroType]) return 0
        if (nutrients[macroType] === null) return 0

        return nutrients[macroType];
        // switch (macroType) {
        //     case "fat":
        //         return (nutrients[macroType || "total_fat"] * 9)
        //     case "carbs":
        //         return (nutrients[macroType || "total_carbohydrate"] * 4)
        //     case "protein":
        //         return (nutrients[macroType || "protein"] * 4)
        //     default:
        //         return 0
        // }
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
            .reduce((total: number, { nutrients }: any) => (total + nutrients.nf_calories), 0),

        total_fat: openfitnessScripts.getTodaysData(foodTable)
            .reduce((totalFat: number, { nutrients }: any) => (
                (openfitnessScripts
                    .extractMacros(nutrients, "nf_total_fat") * 9) + totalFat
                ), 0),
        total_carbs: openfitnessScripts.getTodaysData(foodTable)
            .reduce((totalCarbs: number, { nutrients }: any) => (
                (openfitnessScripts
                    .extractMacros(nutrients, "nf_total_carbohydrate") * 4) + totalCarbs
                ), 0),
        total_protein: openfitnessScripts.getTodaysData(foodTable)
            .reduce((totalProtein: number, { nutrients }: any) => (
                (openfitnessScripts
                    .extractMacros(nutrients, "nf_protein") * 4) + totalProtein
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
            foodDataDeduction,
            schema
        } = props;

        const today = new Date();
        const xAxis = [{ data: [] }];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            xAxis[0].data.push(date.getDate() as never);
        }

        // console.log("getChartsData.foodDataDeduction: ", profileTable, foodDataDeduction);
        const chartsData = {
            profile: {
                table: {
                    title: "Health Profile",
                    columns: schema.find(({ table }: { table: string }) => (table === "profile"))?.columns
                        .map(({ name, notNull }: { name: string, notNull: boolean }) => ({ 
                            field: name, 
                            headerName: name, 
                            width: 150,
                            required: notNull
                            // ...["goal", "exercise"]
                            //     .includes(key) && { 
                            //         valueGetter: (input: any) => input + ":custom-render"
                            //     }
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
                            value: foodDataDeduction?.[`total_${type}`] || 0,
                            label: type
                        }))
                },
                bar: {
                    title: "Today's Calories Consumed by Macronutrients",
                    filters: ["Today", "Yesterday", "Last Week", "Last 30 Days", "All Time"],
                    series: [
                        {
                            data: [
                                foodDataDeduction?.total_fat || 0, // || (5000 * 0.2),
                                foodDataDeduction?.total_carbs || 0, // || (5000 * 0.45),
                                foodDataDeduction?.total_protein || 0, // || (5000 * 0.35)
                            ]
                        },
                        {
                            data: [
                                foodDataDeduction?.total_fat || 0, // || (5000 * 0.2),
                                foodDataDeduction?.total_carbs || 0, // || (5000 * 0.45),
                                foodDataDeduction?.total_protein || 0, // || (5000 * 0.35)
                            ]
                        },
                        {
                            data: [
                                foodDataDeduction?.total_fat || 0, // || (5000 * 0.2),
                                foodDataDeduction?.total_carbs || 0, // || (5000 * 0.45),
                                foodDataDeduction?.total_protein || 0, // || (5000 * 0.35)
                            ]
                        },
                        {
                            data: [
                                foodDataDeduction?.total_fat || 0, // || (5000 * 0.2),
                                foodDataDeduction?.total_carbs || 0, // || (5000 * 0.45),
                                foodDataDeduction?.total_protein || 0, // || (5000 * 0.35)
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
                            data: [] || [550, 650, 200, 400, 450, 340, 300]
                        },
                        {
                            data: [] || [1200, 1000, 1100, 1200, 1200, 1000, 1200]
                        },
                        {
                            data: [] || [450, 700, 300, 400, 450, 350, 450]
                        },
                    ]
                },
                table: {
                    title: "Total Food Logged",
                    columns: schema.find(({ table }: { table: string }) => (table === "food"))?.columns
                        .map(({ name, notNull }: { name: string, notNull: boolean }) => ({ 
                            field: name, 
                            headerName: name, 
                            width: 150,
                            required: notNull
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
                        value:  openfitnessScripts.getTodaysData(exerciseTable)
                            .filter((exercise: { muscle: string }) => (exercise.muscle === muscleGroup))
                            .reduce((total: number, exercise: any) => (total + (exercise?.calories_burned || 50)), 0),
                        label: muscleGroup
                    }))
                },
                bar: {
                    title: "Today's Calories Burned by Muscle Group",
                    series: [
                        {
                            data: [] || [
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
                            data: [] || [100, 0, 120, 15, 80, 0, 0]
                        },
                        {
                            data: [] || [20, 230, 10, 0, 100, 0, 0]
                        },
                        {
                            data: [] || [240, 230, 180, 300, 200, 170, 100]
                        },
                        {
                            data: [] || [15, 10, 0, 130, 0, 10, 0]
                        },
                        {
                            data: [] || [20, 100, 10, 100, 10, 0, 0]
                        },
                        {
                            data: [] || [100, 10, 80, 20, 80, 20, 10]
                        },
                        {
                            data: [] || [40, 40, 40, 40, 40, 40, 40]
                        },
                    ]
                },
                table: {
                    title: "Total Exercises Logged",
                    columns: schema.find(({ table }: { table: string }) => (table === "exercise"))?.columns
                        .map(({ name, notNull }: { name: string, notNull: boolean }) => ({ 
                            field: name, 
                            headerName: name, 
                            width: 150,
                            required: notNull
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
                            data: [] || [
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
                            data: [] || [200, 300, 100, 250, 300, 200, 200]
                        },
                        {
                            data: [] || [500, 400, 300, 200, 300, 400, 300]
                        },
                        {
                            data: [] || [300, 200, 340, 230, 100, 300, 230]
                        },
                    ]
                },
                table: {
                    title: "Total Steps Logged",
                    columns: schema.find(({ table }: { table: string }) => (table === "steps"))?.columns
                        .map(({ name, notNull }: { name: string, notNull: boolean }) => ({ 
                            field: name, 
                            headerName: name, 
                            width: 150,
                            required: notNull
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
                            data: [] || [
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
                            data: [] || [ 0, 0, 0, 0, 0, 0, 0 ]
                        },
                        {
                            data: [] || [ 6, 4, 3, 4, 3, 2.6, 4 ]
                        },
                        {
                            data: [] || [ 1, 2, 3, 2, 3, 3, 1 ]
                        },
                        {
                            data: [] || [ 0, 1, 0, 1, 0, 0, 2 ]
                        },
                    ]
                },
                table: {
                    title: "Total Sleep Logged",
                    columns: schema.find(({ table }: { table: string }) => (table === "sleep"))?.columns
                        .map(({ name, notNull }: { name: string, notNull: boolean }) => ({ 
                            field: name, 
                            headerName: name, 
                            width: 150,
                            required: notNull
                        })),
                    rows: sleepTable
                }
            },

            weight: {
                table: {
                    title: "Total Weight Logged",
                    columns: schema.find(({ table }: { table: string }) => (table === "weight"))?.columns
                        .map(({ name, notNull }: { name: string, notNull: boolean }) => ({ 
                            field: name, 
                            headerName: name, 
                            width: 150,
                            required: notNull
                        })),
                    rows: weightTable
                },
                bar: {
                    title: "Today's Weight",
                    series: [
                        {
                            data: profileTable?.[0]?.weight ? [
                                profileTable[0].weight, {
                                    "lose": (profileTable[0].weight - 10),
                                    "gain": (profileTable[0].weight + 10),
                                    "maintain": profileTable[0].weight
                                }[profileTable[0].goal as "lose" | "gain" | "maintain"]
                            ] : []
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
                    series: [] || [
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
                            value: profileTable?.[0]?.weight || openfitnessScripts.getTodaysData(weightTable),
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
    getAllTables: async (props: any) => {
    
        console.log("openfitness.scripts.getAllTables: ", props);
        try {
            // const topics: any[] = ["Weight", "Food", "Exercise", "Profile", "Sleep", "Steps"];
            const [
                // Assign tables data to variables
                weightTable,
                foodTable,
                exerciseTable,
                profileTable,
                sleepTable,
                stepsTable,
            ] = props.tablesResults;

            console.log("openfitness.scripts.getAllTables.results: ", props);

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
                foodDataDeduction,
                schema: props.schemas

            });


            const total_steps_calories = (exerciseDataDeduction.total_steps * 0.04);
            // Total calories from steps + total_exercise_calories
            const total_active_calories = (total_steps_calories + exerciseDataDeduction.total_exercise_calories);

            // console.log(
            //     "data extract for total cals: ",
            //     profileTable,
            //     total_active_calories,
            //     foodDataDeduction
            // )
            const dataExtract = {
                ...foodDataDeduction,
                ...exerciseDataDeduction,
                total_calories_remaining: (
                    // Total Daily Energy Expenditure (TDEE) *Minimum Daily Calories Required*
                    profileTable?.[0]?.tdee 
                    // Algorithmic Adjustment to TDEE based on weight goal
                    + ({
                        lose: (-500),
                        gain: 500,
                        maintain: 0
                    }[profileTable?.[0]?.goal as "lose" | "gain" | "maintain"] || 0)
                    // Add total active calories to daily calories burned
                    + total_active_calories
                    // Minus the amount of daily calories consumed 
                    - foodDataDeduction.todays_calories_consumed
                ),
            };

            // console.log("openfitness.scripts.getAllTables.dataExtract: ", dataExtract);

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
                    value: dataExtract.total_calories_remaining || 0
                },
            ];

            const tables = {
                schemas: props.schemas,
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
