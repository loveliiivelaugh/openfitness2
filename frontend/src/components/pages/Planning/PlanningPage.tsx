import { 
    Autocomplete, Box, Button, Card, Chip, 
    FormControl, Grid, 
    List, MenuItem, Select, TextField, Typography 
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers";
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useEffect, useState } from "react";
import moment from "moment";
import { QueryWrapper } from "../Fitness/api"
import { paths } from "../Fitness/api"
import { useUtilityStore } from "../../../utilities/store";
import { useConfirm } from "../../Confirm/ConfirmProvider";


const DroppableContainer = ({ children, id }: { children: React.ReactNode, id: string }) => {
    const { isOver, setNodeRef } = useDroppable({ id });
    const style = { color: isOver ? 'green' : undefined };

    return (
        <Box ref={setNodeRef} sx={style}>
            {children}
        </Box>
    )
};

const DraggableContainer = ({ children, ...props }: { children: React.ReactNode, id: string }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: props.id });
    const style = transform 
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } 
        : undefined;

    return (
        <Box ref={setNodeRef} sx={style} {...listeners} {...attributes}>
            {children}
        </Box>
    );
};

interface DayType {
    id: string
    day: string
    exercises: string[]
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const initialDaysState = new Array(7).fill({
    id: 1, // number
    day: "Monday", // string
    exercises: [], // string[]
}).map((dayObject: DayType, index: number) => ({
    ...dayObject,
    id: `dropbox-day${index + 1}`,
    day: daysOfWeek[index as keyof typeof daysOfWeek],
}));

const PlanningPage = () => {
    const utilityStore = useUtilityStore();
    const confirm = useConfirm();
    const [date, setDate] = useState(moment());
    const [days, setDays] = useState<typeof initialDaysState>(initialDaysState);

    const handleDragEnd = (event: any) => {
        console.log("handleDragEnd", event, days);
        setDays((days) => days.map((day: typeof days[number]) => (day.id === event.over?.id) 
            ? ({
                ...day,
                exercises: [
                    ...day.exercises, 
                    event.active.id
                ],
            })
            : day
        ));
    };

    useEffect(() => {
        if (days.every(({ exercises }: { exercises: string[] }) => exercises.length > 0)) {
            utilityStore.createAlert("success", "Planning satisfied!");
        }
    }, [days])

    return (
        <Box mt={18}>
        <DndContext onDragEnd={handleDragEnd}>
            <Grid container>
                <Grid item sm={12} sx={{ px: 2, display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h4" gutterBottom>
                        Planning
                    </Typography>
                    <FormControl>
                        <Select value={"1"}>
                            <MenuItem value="1">Exercise</MenuItem>
                            <MenuItem value="2">Food</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>


                <Grid item sm={12} sx={{ px: 2 }}>
                    <QueryWrapper path={paths.database + "/exercise"}>
                        {({ data }) => data && (
                            <>
                                <DroppableContainer id="pickbox">
                                    <Grid container rowSpacing={2} sx={{ p: 2, my: 2, border: "1px solid black", borderRadius: 2 }}>
                                        <Grid item sm={12}>
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={data}
                                                    getOptionLabel={(option: { name: string }) => option.name}
                                                    // sx={{ width: 300 }}
                                                    renderInput={(params) => <TextField {...params} label="Search Exercise" />}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item sm={12}>
                                            <Chip label="Recents" />
                                        </Grid>
                                        <Grid item sm={12} sx={{ display: "flex", gap: 2, }}>
                                            {[
                                                ...data,
                                                {
                                                    "id": "custom",
                                                    "created_at": "2024-09-09T01:17:52.089Z",
                                                    "name": "Rest",
                                                    "reps": 0,
                                                    "sets": 0,
                                                    // "date": "",
                                                    // "time": "",
                                                    "muscle": "",
                                                    "difficulty": "required",
                                                    "equipment": "body_only",
                                                    "instructions": "Rest",
                                                    "type": "strength",
                                                    "user_id": "",
                                                    "weight": 0,
                                                    "calories_burned": 0
                                                }
                                            ].map((exercise: any) => (
                                                <DraggableContainer id={exercise.name} key={exercise.id}>
                                                    <Card
                                                        // key={exercise.id}
                                                        sx={{ p: 2, "&: hover": { background: "rgba(0,0,0,0.1)", cursor: "pointer" } }}
                                                    >
                                                        {exercise.name}
                                                        <Typography>{exercise.category}</Typography>
                                                        <Typography>{exercise.muscle}</Typography>
                                                        <Typography>{exercise.equipment}</Typography>
                                                        <Typography>{exercise.difficulty}</Typography>
                                                    </Card>
                                                </DraggableContainer>
                                            ))}
                                        </Grid>

                                    </Grid>
                                </DroppableContainer>
                            </>
                        )}
                    </QueryWrapper>
                </Grid>
                <Grid item sm={12} sx={{ px: 2, display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h4">
                        Week of
                    </Typography>
                    <Box sx={{ display: "Flex", gap: 2 }}>
                        <DatePicker label="Week of" value={moment()} onChange={(newDate) => setDate(moment(newDate))}  />
                        <Button variant="contained" size="large" onClick={() => {console.log("Save.btn.data: ", days, date); confirm.openConfirm({
                            title: "Are you sure?",
                            open: true,
                            severity: "error",
                            message: "Are you sure you want to save?",
                            onConfirm: (answer, resolve) => {
                                console.log("Save.btn.data: ", days, date);
                                if ( resolve ) resolve(answer);
                                utilityStore.clearConfirm();
                                utilityStore.createAlert("success", "Saved!");
                            }
                        })}} sx={{ borderRadius: 2 }}>
                            Save
                        </Button>
                    </Box>
                </Grid>
                <Grid item sm={12}>
                    <Grid container sx={{ display: "flex", justifyContent: "space-between", p: 2 }} spacing={2}>
                        {days.map((day, index: number) => (
                            <Grid item xs={12} sm={12 / 7} key={index}>
                                <DroppableContainer id={`dropbox-day${index + 1}`}>
                                    <Box sx={{ 
                                        p: 1, 
                                        width: "100%", 
                                        height: 300, 
                                        border: `1px solid ${!day.exercises.length ? "rgba(240,0,0,0.6)" : "rgba(0,240, 0, 0.6)"}`, 
                                        borderRadius: 2 
                                    }}>
                                        <Typography variant="h5">Day {index + 1}</Typography>
                                        <List>
                                            {day.exercises.map((exercise: any, index: number) => (
                                                <DraggableContainer id={`${exercise}-day${index + 1}`} key={index}>
                                                    <Card
                                                        key={index}
                                                        sx={{ p: 2, "&: hover": { background: "rgba(0,0,0,0.1)", cursor: "pointer" } }}
                                                    >
                                                        {exercise}
                                                    </Card>
                                                </DraggableContainer>
                                            ))}
                                        </List>
                                    </Box>
                                </DroppableContainer>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

            </Grid>
        </DndContext>
        </Box>
    )
}

export default PlanningPage