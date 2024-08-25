import { 
    Avatar, ListItem, ListItemText, 
    ListItemIcon,ListItemButton
} from '@mui/material';

import { useFitnessStore } from '../../../store';


const ListContent = ({ data }: { data: any }) => {
    const fitnessStore = useFitnessStore();

    // console.log("ListContent data: ", data);

    const handleSelected = async (selection: any) => {

        fitnessStore.setSelectedSearchItem(selection);
        fitnessStore.toggleDrawer({ open: false, anchor: "bottom" });

        setTimeout(() => fitnessStore.toggleDrawer({ open: true, anchor: "right" }), 250);
    };

    if (!data || (data?.name && data?.name.includes('DrizzleError'))) return "Error loading data...";

    return data?.branded 
        ? data.branded.map((food: any, index: number) => (
            <ListItem 
                key={index} 
                sx={{ 
                    borderBottom: 'solid 1px rgba(0,0,0,0.1)', 
                    '&:hover': { 
                        background: "rgba(0,0,0,0.1)",
                        cursor: "pointer"
                    } 
                }}
            >
                <ListItemButton onClick={() => handleSelected(food)}>
                    <ListItemIcon>
                        <Avatar src={food.photo.thumb} />
                    </ListItemIcon>
                    <ListItemText primary={food.brand_name} secondary={`${food.nf_calories} Calories`} />
                </ListItemButton>
            </ListItem>
        )) 
        : ((fitnessStore.activeDrawer === "exercise") && (data.length > 0))
            ? data.map((exercise: any, index: number) => (
                <ListItem
                    key={index}
                    sx={{
                        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
                        '&:hover': {
                            background: "rgba(0,0,0,0.1)",
                            cursor: "pointer"
                        }
                    }}
                >
                    {/* {console.log("exercise: ", exercise) as any} */}
                    <ListItemButton onClick={() => handleSelected(exercise)}>
                        <ListItemText primary={exercise.name} secondary={`${exercise.instructions}`} />
                    </ListItemButton>
                </ListItem>
            ))
            : ((fitnessStore.activeDrawer === "food") && (data.length > 0))
                ? data.map((food: any, index: number) => (
                    <ListItem
                        key={index}
                        sx={{
                            borderBottom: 'solid 1px rgba(0,0,0,0.1)',
                            '&:hover': {
                                background: "rgba(0,0,0,0.1)",
                                cursor: "pointer"
                            }
                        }}
                    >
                        <ListItemButton onClick={() => handleSelected(food)}>
                            <ListItemIcon>
                                <Avatar src={food.nutrients?.photo?.thumb} />
                            </ListItemIcon>
                            <ListItemText primary={food.name} secondary={`${food.calories} Calories`} />
                        </ListItemButton>
                    </ListItem>
                ))
                : `No ${fitnessStore.activeSearchTab} data available`;
};

export default ListContent;
