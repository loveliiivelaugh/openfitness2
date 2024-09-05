import { useState } from 'react';
import { useForm } from '@tanstack/react-form'
import { Box, Button, Grid, TextField, Typography } from '@mui/material'


const fieldDefinitions = [
    {
        name: "email",
        label: "Email",
        type: "email",
        // validators: {
        //     onChange: (value) => (value > 10)
        // }
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        // validators: {
        //     onChange: (value) => (value > 10)
        // }
    }
];

const AuthForm = (props: any) => {
    const [loginType, setLoginType] = useState("signin");

    const onSubmit = async (values: any) => {
        console.log("onSubmit: ", values)

        if (props?.handleSubmit) await props.handleSubmit(values.value, loginType);
    };

    const defaultValues = Object.assign(
        {}, 
        ...fieldDefinitions.map(({ name }) => ({ [name]: '' }))
    );

    const validators = {
        onChange: ({ value }: any) => {
            // console.log("validators.onChange: ", value)
            if (parseInt(value.age) < 21) {
                return 'Must be 21 or older to sign'
            }
            return undefined;
        },
        // onBlur: ({ value }) => {...}
    };

    const form = useForm({ defaultValues, onSubmit, validators });

    return (
        <Box
            sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                minHeight: "100vh",
                width: "100vw" 
            }}
        >
            <Box sx={{ border: "1px solid white", borderRadius: 2, p: 3, display: "block" }}>
                <Grid container
                    component={"form"}
                    onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    {fieldDefinitions.map((field, index) => (
                        <Grid item xs={12} key={index}>
                            <form.Field name={field.name as any}>
                                {(field) => <TextField
                                    {...field}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value)}
                                    onBlur={field.handleBlur}
                                    value={field.state.value}
                                    id={field.name}
                                    type={field.name}
                                    label={field.name}
                                    autoComplete={field.name}
                                    fullWidth
                                    color='primary'
                                /> }
                            </form.Field>
                        </Grid>
                    ))}
                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}>
                        <Button variant="outlined" color="error" onClick={() => props.handleCancel()}>Cancel</Button>
                        <Button variant="outlined" color="inherit" type="submit">Submit</Button>
                    </Grid>
                    <Grid item xs={12} sx={{  pt: 2 }}>
                        {loginType === "signup" ? (
                            <Typography>
                                Have an account? <Button variant="outlined" color="inherit" onClick={() => setLoginType((prev: string) => (prev === "signin") ? "signup" : "signin")}>
                                    Login
                                </Button>
                            </Typography>
                        ) : (
                            <Typography>
                                Don't have an account? <Button variant="outlined" color="inherit" onClick={() => setLoginType((prev: string) => (prev === "signin") ? "signup" : "signin")}>
                                    Register
                                </Button>
                            </Typography>

                        )}
                    </Grid>
                    {/* <Grid item xs={12} sx={{  pt: 2 }}>
                        <Typography>
                            Forgot your password? <Button variant="outlined" color="inherit" onClick={() => props.handleForgotPassword()}>Reset</Button>
                        </Typography>
                    </Grid> */}
                </Grid>
            </Box>
        </Box>
    )
}

export default AuthForm