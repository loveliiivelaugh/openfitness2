import React from 'react';
import {
    Alert,
    Box, Button, Grid, TextField, Typography,
    MenuItem, Select,
    InputLabel
} from '@mui/material';
import { FormControl } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';

import { BasicDatePicker, BasicTimePicker } from './BasicDatePicker';
import { useFitnessStore, useSupabaseStore } from '../../../../store';
import { fitnessQueries } from '../../api';


const mapDefaultValue = (column, store) => {
    const profile = store.fitnessTables?.profile[0];
    // console.log("mapDefaultValue: ", column, profile);

    switch (column.name) {
        // Profile Default Values
        case "age":
            return profile?.age;
        case "height":
            return profile?.height;
        case "weight":
            return parseInt(profile?.weight) || 0;
        case "goal":
            return (profile?.goal === 0 ? "maintain" : "lose");
        case "exercise":
            return (profile?.exercise === 1.55 ? "very active" : "sedentary");
        case "tdee":
            return profile?.tdee || 0;
        case "bmr":
            return profile?.bmr || 0;

        // Exercise Search Default Values
        case "reps":
            return 10;
        case "sets":
            return 3;
        case "muscle":
            return (store.selectedSearchItem?.muscle || "");
        case "difficulty":
            return (store.selectedSearchItem?.difficulty || "");
        case "equipment":
            return (store.selectedSearchItem?.equipment || "");
        case "instructions":
            return (store.selectedSearchItem?.instructions || "");
        case "type":
            return (store.selectedSearchItem?.type || "");
        case "calories_burned":
            return 0; // TODO:  Coming Soon!! --> Functionality to automate figuring out calories burned

        // Food Search Default Values
        case "name":
            return (store.selectedSearchItem?.food_name || store.selectedSearchItem?.name || "");
        case "date":
            return moment().format("ddd, MMMM DD, YYYY");
        case "time":
            return moment().format("h:mm a");
        case "calories":
            return (
                store.selectedSearchItem?.nf_calories 
                || store.selectedSearchItem?.calories
                || 0
            );
        case "serving_size":
            return 1;
        case "num_servings":
            return 1;
        case "user_id":
            return store.session?.user?.id; // Server assigns user_id
        case "meal":
            let meal = "snack";
            // Check time of day and assign meal accordingly
            const currentHour = new Date().getHours();
            if (currentHour >= 6 && currentHour < 12) {
                meal = "breakfast";
            }
            if (currentHour >= 12 && currentHour < 18) {
                meal = "lunch";
            }
            if (currentHour >= 18 && currentHour < 22) {
                meal = "dinner";
            }
            return meal;
        case "nutrients":
            return store.selectedSearchItem || {};

        // Sleep + Steps
        case "startDate":
            return moment().format("ddd, MMMM DD, YYYY");
        case "endDate":
            return moment().format("ddd, MMMM DD, YYYY");

        // Default
        default:
            return "";
    };
};


const Attachment = () => (
    <Box sx={{}}>
        <Typography id="demo-simple-select-label" variant="body1">
            Progress Photo
        </Typography>
        <IconButton p={1}>
            <AttachmentIcon />
            <attachment />
        </IconButton>
    </Box>
);

const SelectWrapper = (props) => {
    let options = (props?.enumValues || []);
    return (
        <FormControl fullWidth>
            <InputLabel id={props?.label}>
                {props?.label}
            </InputLabel>
            <Select {...props}>
                {options.map((option, index) => (
                    <MenuItem key={index} value={(option?.value || option)}>
                        {(option?.label || (option.slice(0, 1).toUpperCase() + option.slice(1)))}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};


const buildFields = (fieldsArray, formState) => fieldsArray
    .map((field) => {

        // Define common properties for all fields
        const commonProperties = {
            key: field.name,
            id: field.name,
            ...field,
            fullWidth: true
        };

        // console.log("buildFields: ", field, formState);
        // Define properties specific to the field type
        const FieldsProps = {
            TextField: { ...commonProperties },
            Select: {
                ...commonProperties,
                options: (field?.enumValues || []),
                SelectProps: {
                    native: true,
                },
                // value: formState.state.values[field.name],
                defaultValue: formState.state.values[field.name],
            },
            Date: {
                ...commonProperties,
                // value: moment(new Date()).format("YYYY-MM-DD"),
                // placeholder: new Date().toLocaleDateString(),
            },
            Time: {
                ...commonProperties,
                // value: new Date(field.value).toLocaleTimeString(),
                // placeholder: new Date().toLocaleTimeString(),
            },
            Json: {
                ...commonProperties,
                value: JSON.stringify(field.value),
                type: "text",
                multiline: true,
                minRows: 4,
            },
        };

        let type = field?.enumValues ? "select" : field?.type;

        if (field?.columnType.includes("PgDateString")) type = "date";
        if (field?.columnType.includes("PgTime")) type = "time";

        return ({
            text: <TextField {...FieldsProps.TextField} />,
            string: <TextField {...FieldsProps.TextField} />,
            number: <TextField {...FieldsProps.TextField} />,
            date: <BasicDatePicker {...FieldsProps.Date} />,
            time: <BasicTimePicker {...FieldsProps.Time} />,
            select: <SelectWrapper {...FieldsProps.Select} />,
            json: <TextField {...FieldsProps.Json} />,
            attachment: <Attachment />, 
        }[type])
    });

const excludedColumns = [
    "id",
    "created_at",
    "updated_at",
    "user_id",
    "nutrients"
];

const FormContainer = ({ schema, handleRefreshQueries }) => {
    const supabaseStore = useSupabaseStore(); // auth states
    const fitnessStore = useFitnessStore(); // app states
    const fieldsQuery = useQuery(fitnessQueries.readTableQuery(schema));
    const mutateDbQuery = useMutation(fitnessQueries.writeTableQuery());
    const updateDbQuery = useMutation(fitnessQueries.updateTableQuery());

    // console.log({ fitnessStore });

    const fieldsArray = schema.columns
        .filter(column => !excludedColumns.includes(column.name))
        .map(column => ({
            name: column.name,
            label: column.name,
            // type: "text",
            type: column?.dataType,
            required: column?.notNull,
            value: "",
            ...column
        }));

    const onSubmit = async (values) => {
        // console.log("values: ", values)

        const findHighestId = () => {
            let highestId = 0;

            fitnessStore.fitnessTables[schema.table]
                .forEach((row) => {
                    if (row.id > highestId) {
                        highestId = row.id;
                    }
                });

            return highestId;
        };

        delete values.value.created_at;

        let payload = {
            table: schema.table,
            data: {
                ...values.value,
                id: (parseInt(findHighestId()) + 1), // Supabase should auto-increment
                // user_id: supabaseStore.session?.user?.id // Supbase should auto-assign based on active session
            }
        };

        // Ideally Profile would be created when user registers -- then user can only update profile record
        if (schema.table === "profile") await updateDbQuery.mutate(payload);
        else await mutateDbQuery.mutate(payload);

        // Refresh data in app *not working*
        await handleRefreshQueries();
    };

    const defaultValues = Object.assign(
        {},
        ...schema.columns
            .map((column) => ({
                [column.name]: mapDefaultValue(column, {
                    ...fitnessStore, 
                    ...supabaseStore
                })
            }))
    );

    const validators = {
        onChange: ({ value }) => {
            // console.log("validators.onChange: ", value)
            if (parseInt(value.age) < 21) {
                return 'Must be 21 or older to sign'
            }
            return undefined;
        },
        // onBlur: ({ value }) => {...}
    };

    const form = useForm({ defaultValues, onSubmit, validators });
    // console.log({ form });

    const handleCancelClick = () => {
        form.reset();
        fitnessStore.setActiveSearchTab('recent'); // reset active search tab to recent
        fitnessStore.toggleDrawer();
    };

    const handleSubmit = () => {
        form.handleSubmit();
        fitnessStore.setActiveSearchTab('recent'); // reset active search tab to recent
        fitnessStore.toggleDrawer({ open: false, anchor: "right" });
    };

    return (
        <Grid container component={form.Form} p={2} rowSpacing={2}>

            <Grid item sm={12}>
                <Typography variant="h5">
                    Log {schema.table}
                </Typography>
            </Grid>

            {["sleep", "steps"].includes(schema.table) && (
                <Grid item sm={12}>
                    <Alert severity="info">
                        <Typography variant="h6">
                            Heads Up! 😎
                        </Typography>
                        <Typography variant="body1">
                            {schema.table} data is automatically added to the {schema.table} table
                            via smart watch. User can manually input data here.
                        </Typography>
                        <Typography variant="subtitle1" component="a" target='_blank' href="#">
                            Read more details
                        </Typography>
                    </Alert>
                </Grid>
            )}

            {buildFields(fieldsArray, form)
                .map(Field => (
                    <Grid key={Field.props.name} item sm={12}>
                        <form.Field 
                            name={Field.props.name} 
                            validators={{
                                onChange: (value) => (value > 10)
                            }}
                        >
                            {(field) => (
                                <>
                                    {/* <InputLabel>{Field.props.label.slice(0, 1).toUpperCase() + Field.props.label.slice(1)}</InputLabel> */}
                                    {React.cloneElement(Field, {
                                        ...field,
                                        defaultValue: field.state.value,
                                        onChange: (event) => field.handleChange(event.target.value),
                                        onBlur: field.handleBlur,
                                        value: field.state.value
                                    })}
                                    {field.state.meta.errors ? (
                                        <em role="alert">{field.state.meta.errors.join(', ')}</em>
                                    ) : null}
                                </>
                            )}
                        </form.Field>
                    </Grid>
                ))
            }

            <Grid item sm={12}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Button variant="outlined" color="error" onClick={handleCancelClick} fullWidth>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Grid>

        </Grid>
    )
};

export default FormContainer
