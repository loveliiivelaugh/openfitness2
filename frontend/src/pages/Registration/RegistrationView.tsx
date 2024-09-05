import { useQuery } from "@tanstack/react-query";
import { Grid, Typography } from "@mui/material";

import FormContainer from "../Fitness/layout/forms/FormContainer"
import { paths, queries } from "../Fitness/api"
import { openfitnessScripts } from "../../scripts"
import { useFitnessStore, useSupabaseStore } from "../../store"


const RegistrationView = (props?: { handleRefreshQueries: () => void }) => {
    const fitnessStore = useFitnessStore();
    const supabaseStore = useSupabaseStore();
    const schemaQuery = useQuery(queries.query(paths.database + "/schema"))
    console.log("schemaQuery: ", schemaQuery)
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h4">
                    RegistrationView
                </Typography>
            </Grid>
            {schemaQuery.isSuccess && (
                <Grid item xs={12}>
                    <FormContainer 
                        schema={schemaQuery.data.find(({ table }: { table: string }) => (table === "profile"))} 
                        handleRefreshQueries={props?.handleRefreshQueries || schemaQuery.refetch}
                        noDefaults
                        injectChangeLogic={(field: any, form: any) => {

                            if (Object
                                .keys(form.state.values)
                                .filter((key) => !["id", "user_id", "created_at", "tdee", "bmr"].includes(key))
                                .every((key) => form.state.values[key])
                            ) {
                                const weight = parseInt(form.state.values.weight);
                                const bmr = openfitnessScripts.calculate.bmr({ weight });
                                field.form.setFieldValue("bmr", bmr);
                                const tdee = openfitnessScripts.calculate.tdee({ weight });
                                field.form.setFieldValue("tdee", tdee);
                            };
                        }}
                        handleCancelClick={() => {
                            console.log("handleCancel: ");
                            fitnessStore.setRegistrationView(false);
                            supabaseStore.setUserType(null);
                            supabaseStore.setSession(null);
                        }}
                        handleSubmit={() => {
                            fitnessStore.setRegistrationView(false);
                        }}
                    />
                </Grid>
            )}
        </Grid>
    )
}

export default RegistrationView