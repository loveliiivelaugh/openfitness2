import { 
    Avatar, Box, Button, CardActionArea, Grid, 
    List, ListItem, ListItemButton, ListItemText 
} from "@mui/material"
import MyCalendar from "./Calendar";

const NewProfileSection = ({ data, filterList }: { data?: any, filterList?: (key: string) => boolean }) => {

    const formatHeight = (heightInches: number) => {
        const feet = Math.floor(heightInches / 12).toString();
        const inches = (heightInches % 12).toString();
        return `${feet} ft ${inches} inches`;
    };

    return (
        <Grid container>
            <Grid item sm={6}>
                <Grid container>
                    <Grid item xs={12} sm={8}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: "30%" }}>
                            <Avatar sx={{ width: 200, height: 200 }} />
                        </Box>
                        <CardActionArea sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                            <Button variant="text" color="inherit">
                                Upload Photo
                            </Button>
                        </CardActionArea>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <List dense>
                            {data &&
                                Object
                                    .keys(data)
                                    .map((key: string) => (filterList ? filterList(key) : true) && (
                                        <ListItem key={key} component={ListItemButton}>
                                            <ListItemText 
                                                primary={key} 
                                                secondary={
                                                    (key === "height") 
                                                        ? formatHeight(data[key]) 
                                                        : data[key]
                                                } 
                                            />
                                        </ListItem>
                                    ))
                            }
                        </List>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sm={6}>
                <MyCalendar />
            </Grid>
        </Grid>
    )
}

export default NewProfileSection