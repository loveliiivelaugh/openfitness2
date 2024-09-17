import {
    Avatar,
    ListItem, ListItemIcon,
    Menu, MenuItem, Typography
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { client } from '../api';


const settings2 = [
    {
        name: 'Account',
        toLocation: "/user/account",
        icon: <Avatar />,
        // onClick: () => navigate()
    },
    {
        name: 'Dashboard',
        toLocation: "/",
        icon: <HomeIcon color="inherit" />
    },
    {
        name: 'Changelog',
        toLocation: "/docs/changelog",
        icon: <LightModeIcon color="inherit" />
    },
    {
        name: 'Roadmap',
        toLocation: "/docs/roadmap",
        icon: <DarkModeIcon color="inherit" />
    },
    {
        name: 'Documentation',
        toLocation: "/docs/documentation",
        icon: <LightModeIcon color="inherit" />
    },
    {
        name: 'Usage Guide',
        toLocation: "/docs/guide",
        icon: <LightModeIcon color="inherit" />
    },
    {
        name: 'Feature Request',
        toLocation: "/reporting/feature",
        icon: <LightModeIcon color="inherit" />
    },
    {
        name: 'Bug Report',
        toLocation: "/reporting/bug",
        icon: <LightModeIcon color="inherit" />
    },
    {
        name: 'Import Data',
        toLocation: "",
        icon: <LightModeIcon color="inherit" />,
        onClick: async () => {
            // import a single CSV to populate all the tables

        }
    },
    {
        name: 'Export Data',
        toLocation: "",
        icon: <LightModeIcon color="inherit" />,
        onClick: async () => {
            // export all the data from the tables
            const { csv } = (await client.get("/database/export/data")).data;

            console.log("exportData.response: ", csv);
            
            if (csv) {
                csv.forEach((sheet: any) => {
                    const blob = new Blob([sheet], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.setAttribute("hidden", "");
                    a.setAttribute("href", url);
                    a.setAttribute("download", "openfitness-data-9-8-2024.csv");
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            };

        }
    },
    {
        name: 'Plan Builder',
        toLocation: "/planning/exercise",
        icon: <LightModeIcon color="inherit" />
    },
    {
        name: 'Logout',
        toLocation: "",
        icon: <LightModeIcon color="inherit" />,
        onClick: async (utilities: { supabaseStore: any, navigate: any }) => {
            // await supabase.auth.signOut();
            await client.get('/auth/logout');
            utilities.supabaseStore.setSession(null);
            utilities.supabaseStore.setUserType(null);
            utilities.navigate("/");
        }
    }
]

const NavSettingsMenu = (props: {
    anchorElUser: any,
    handleCloseUserMenu: (setting: typeof settings2[number]) => void
}) => {

    return (
        <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={props.anchorElUser}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(props.anchorElUser)}
            onClose={props.handleCloseUserMenu}
        >
            {settings2
                .map((setting: typeof settings2[number], index: number) => (
                    <MenuItem 
                        key={index} 
                        onClick={() => props.handleCloseUserMenu(setting)} 
                        sx={{
                            ...[1, 5, 7, 9, 10].includes(index) 
                            && { borderBottom: "solid 1px rgba(33,33,33, 1)" }
                        }}
                    >
                        <ListItem>
                            <ListItemIcon sx={{ px: 1 }}>
                                {setting.icon}
                            </ListItemIcon>
                            <Typography>
                                {setting.name}
                            </Typography>
                        </ListItem>
                    </MenuItem>
                ))
            }
        </Menu>
    );
};

export default NavSettingsMenu;