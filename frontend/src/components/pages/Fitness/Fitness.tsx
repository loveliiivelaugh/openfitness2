// Packages
import React from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueries } from '@tanstack/react-query'
import { 
    InputAdornment, IconButton,
    Box, Drawer, Grid, List, ListItemText, 
    Stack, TextField, Typography,
    Chip, Tabs, Tab,
} from '@mui/material'
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

// Components
import NewProfileSection from './layout/NewProfileSection';
import ChartsContainer from './layout/charts/ChartsWrapper';
import FormContainer from './layout/forms/FormContainer';
import ListContent from './layout/ListContent';
import Alerts from './layout/Alert';

// Services
import { useFitnessStore, useUtilityStore  } from '../../../utilities/store';
import useInitialQuery from './api/useInitialQuery';
import { fitnessQueries, paths, queries } from './api';
import RegistrationView from '../Registration/RegistrationView';
import { PageTransitionWrapper } from '../../../utilities/theme/ThemeProvider';
import Loader from '../../Loader/Loader';


const queryPaths = [
    (paths.database + "/schema"),
    (paths.openfitness + "/fitness_tables"),
    (paths.database + "/food"),
    (paths.database + "/exercise")
];

// Destructure values to use more easily
const topics: any[] = ["Weight", "Food", "Exercise", "Profile", "Sleep", "Steps"];

const Fitness = () => {
    const utilityStore = useUtilityStore();
    const fitnessStore = useFitnessStore();
    const initialQueries = useQueries({ queries: queryPaths.map((queryPath: string) => queries.query(queryPath)) });
    const initialQuery = useInitialQuery();

    // Exercises and Foods Search Queries -- Search for Exercises and Foods for logging
    const exercisesQuery = useMutation(fitnessQueries.exercisesQuery());
    const foodsQuery = useMutation(fitnessQueries.foodsQuery());
    
    React.useEffect(() => {
        utilityStore.createAlert("success", "Congratulations! You Made it! ❤️");
    }, []);

    const [
        __, // Get Schema's to dynamically build fields for each of the forms
        _, // Get Data for the charts / visualizations
        recentFoodsQuery,
        recentExercisesQuery,
    ] = initialQueries;

    const form = useForm({
        defaultValues: { searchInput: "" },
        onSubmit: ({ value }) => {

            if (fitnessStore.activeDrawer === "food") 
                foodsQuery.mutate({ query: value.searchInput });

            if (fitnessStore.activeDrawer === "exercise") 
                exercisesQuery.mutate({ query: value.searchInput });

            fitnessStore.setActiveSearchTab('search');
        },
    });

    async function handleRefreshQueries() {
        return await Promise.all([
            recentFoodsQuery.refetch(),
            recentExercisesQuery.refetch(),
            initialQuery.reload()
        ]);
    };

    const handleBottomNavClick = async (item: string) => {
        fitnessStore.setActiveDrawer(item.toLowerCase());
        fitnessStore.toggleDrawer(
            ['Food', 'Exercise'].includes(item) 
                ? { open: true, anchor: "bottom" } 
                : { open: true, anchor: "right" }
        );
    };


    return ({
        "pending": <Loader />,
        "loading": <Loader />,
        "error": <Loader error />,
        "success": (!initialQuery.data?.profile?.length || fitnessStore.registrationView) 
            ? (
                <PageTransitionWrapper>
                    <RegistrationView handleRefreshQueries={handleRefreshQueries} /> 
                </PageTransitionWrapper>
            ) : (
                <PageTransitionWrapper>
                <Grid container my={14} p={4} sx={{ maxWidth: "100vw" }}>
                    
                    <NewProfileSection
                        data={initialQuery.data?.profile?.[0]}
                        filterList={(key: string)=> !["id", "user_id", "created_at"].includes(key)}
                    />

                    {/* Macro KPI's */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h4">Macronutrient's</Typography>
                        <Stack m={1} p={1}>
                            {initialQuery.data?.macros 
                                ? initialQuery.data.macros
                                    .map((kpi: { label: string, value: string }, index: number) => (
                                        <ListItemText key={index} primary={kpi.label} secondary={!kpi.value ? `No data logged yet for ${kpi.label}` : kpi.value} />
                                    ))
                                : ["Protein", "Carbs", "Fat", "Total Calories"].map((label: string) => <ListItemText primary={`${label}`} secondary={`No data logged yet for ${label}`} /> )
                            }
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        {initialQuery.data?.charts?.food 
                            ? (
                                <ChartsContainer charts={initialQuery?.data?.charts?.food} defaultChart='bar' />
                            ) : <Alerts message="Missing food data" />
                        }
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {initialQuery.data?.charts?.sleep 
                            ? (
                                <ChartsContainer charts={initialQuery?.data?.charts?.sleep} defaultChart='line'/>
                            ) : <Alerts message="Missing sleep data" />
                        }
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {initialQuery.data?.charts?.steps 
                            ? (
                                <ChartsContainer charts={initialQuery?.data?.charts?.steps} defaultChart='line'/>
                            ) : <Alerts message="Missing steps data" />
                        }
                    </Grid>
                    <Grid item sm={12}>
                        {initialQuery.data?.charts?.exercise 
                            ? (
                                <ChartsContainer charts={initialQuery?.data?.charts?.exercise} defaultChart='bar'/>
                            ) : <Alerts message="Missing exercise data" />
                        }
                    </Grid>
                    <Grid item sm={12}>
                        {initialQuery.data?.charts?.weight 
                            ? (
                                <ChartsContainer charts={initialQuery?.data?.charts?.weight} defaultChart='bar'/>
                            ) : <Alerts message="Missing weight data" />
                        }
                    </Grid>

                    <Drawer 
                        open={fitnessStore.isDrawerOpen} 
                        onClose={() => {
                            fitnessStore.setActiveDrawer("weight");
                            fitnessStore.toggleDrawer();
                        }} 
                        hideBackdrop 
                        anchor={fitnessStore.drawerAnchor}
                    >
                        <Box sx={{ 
                                width: (fitnessStore.drawerAnchor === "bottom") ? "100vw" : "80vw", 
                                height: (fitnessStore.drawerAnchor === "bottom") ? "auto" : "100vh", 
                                justifyContent: "center" 
                            }}
                        >
                            {(!initialQuery.isLoading && (fitnessStore.drawerAnchor !== "bottom")) 
                                && Object.assign(
                                    {}, 
                                    ...topics.map((topic: string, index: number) => ({ 
                                        [topic.toLowerCase()]: (
                                            <FormContainer 
                                                key={index} 
                                                schema={initialQuery?.data?.schemas
                                                    .find(({ table }: { table: string }) => (table === topic.toLowerCase()))
                                                }
                                                handleRefreshQueries={handleRefreshQueries}
                                            />
                                        ) 
                                    }))
                                )[fitnessStore.activeDrawer]
                            }

                            {fitnessStore.drawerAnchor === "bottom" && (
                                <Grid item sm={12}>

                                    {/* Bottom Drawer Header */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                                        <Typography variant="h5">
                                            Search {fitnessStore.activeDrawer === "exercise" ? "Exercises" : "Foods"}
                                        </Typography>
                                        <IconButton color="error" onClick={() => {
                                            fitnessStore.setActiveDrawer('weight');
                                            fitnessStore.toggleDrawer();
                                        }}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>

                                    <Tabs 
                                        value={fitnessStore.activeSearchTab} 
                                        onChange={(
                                            event: React.SyntheticEvent, 
                                            newValue: ('recent' | 'favorites' | 'search')
                                        ) => event && fitnessStore.setActiveSearchTab(newValue)}
                                    >
                                        <Tab id="recent-tab" value="recent" label={<Chip label="Recent" />} />
                                        <Tab id="favorites-tab" value="favorites" label={<Chip label="Favorites" />} />
                                        <Tab id="search-tab" value="search" label={<Chip label="Search" />} />
                                    </Tabs>
                                    {{
                                        'recent': (
                                            <List sx={{ maxHeight: "40vh", height: "auto", overflow: "auto" }}>
                                                {
                                                    ((fitnessStore.activeDrawer === "exercise") && recentExercisesQuery.isSuccess)
                                                        ? <ListContent data={recentExercisesQuery.data} />
                                                        : ((fitnessStore.activeDrawer === "food") && recentFoodsQuery.isSuccess)
                                                            ? <ListContent data={recentFoodsQuery.data} />
                                                            : <></>
                                                }
                                                {/* Search for a ... */}
                                            </List>
                                        ),
                                        'favorites': (
                                            <List sx={{ maxHeight: "40vh", height: "auto", overflow: "auto" }}>
                                                {
                                                    ((fitnessStore.activeDrawer === "exercise") && recentExercisesQuery.isSuccess)
                                                        ? <ListContent data={recentExercisesQuery.data} />
                                                        : ((fitnessStore.activeDrawer === "food") && recentFoodsQuery.isSuccess)
                                                            ? <ListContent data={recentFoodsQuery.data} />
                                                            : <></>
                                                }
                                                {/* Search for a ... */}
                                            </List>
                                        ),

                                        // Foods or Exercises Search Results List 
                                        'search': (
                                            <List sx={{ maxHeight: "40vh", height: "auto", overflow: "auto" }}>
                                                {
                                                    ((fitnessStore.activeDrawer === "exercise") && exercisesQuery.isSuccess)
                                                        ? <ListContent data={exercisesQuery.data} />
                                                        : ((fitnessStore.activeDrawer === "food") && foodsQuery.isSuccess)
                                                            ? <ListContent data={foodsQuery.data} />
                                                            : <></>
                                                }
                                                {/* Search for a ... */}
                                            </List>
                                        )

                                    }[fitnessStore.activeSearchTab]}
                                    

                                    {/* Bottom Drawer Search Textfield */}
                                    <Box component={(form as any).Form} onSubmit={form.handleSubmit} sx={{ mb: 4 }}>
                                        <form.Field name="searchInput">
                                            {(field) => (

                                                <TextField
                                                    type="text"
                                                    value={field.state.value}
                                                    onChange={(event) => field.handleChange(event.target.value)}
                                                    placeholder="Search"
                                                    fullWidth
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <IconButton type="submit" sx={{ color: "#fff" }} onClick={form.handleSubmit}>
                                                                    <SearchIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton 
                                                                    id="qr-scan-button" 
                                                                    onClick={() => {}}
                                                                    sx={{ color: "#fff" }}
                                                                >
                                                                    <QrCodeScannerIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                        sx:{
                                                            borderRadius: 8,
                                                            // borderColor: "#fff"
                                                            backgroundColor: "rgba(33,33,33,0.8)"
                                                        }
                                                    }}
                                                />

                                            )}
                                        </form.Field>
                                    </Box>

                                </Grid> 
                            )}

                        </Box>
                    </Drawer>

                    <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: "100vw", overflow: "auto" }}>
                        <BottomNavigation
                            component={Tabs}
                            showLabels
                            variant="scrollable"
                            scrollButtons="auto"
                            // value={0}
                            sx={{ zIndex: 1000, pt: 2 }}
                        >
                            {topics.map((item: string, index: number) => (
                                <BottomNavigationAction
                                    key={index} 
                                    label={item} 
                                    icon={(topics as any)[item]}
                                    onClick={() => handleBottomNavClick(item)}
                                />
                            ))}
                        </BottomNavigation>
                    </Box>

                </Grid>
                </PageTransitionWrapper>
            )
        }[initialQuery.status]);
}

export default Fitness;
