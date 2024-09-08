import { useState } from 'react'
import {
    Alert,
    AppBar, Avatar, Box, IconButton, Menu,
    MenuItem, Toolbar, Tooltip, Typography
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import { useSupabaseStore } from '../../../../utilities/store';
import { supabase } from '../../../../utilities/config/auth.config';
import { useNavigate } from 'react-router-dom';


const settings = [
    'Account',
    'Dashboard',
    'Changelog',
    'Roadmap',
    'Documentation',
    'Feature Request',
    'Bug Report',
    // 'Privacy Policy',
    // 'Terms of Service',
    // 'Data Policy',
    'Logout'
];

export const Navbar = () => {
    const navigate = useNavigate();
    const supabaseStore = useSupabaseStore();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = async (setting: string) => {

        if ((typeof setting !== "string") || !setting) {setAnchorElUser(null); return;}
        
        let toLocation = setting;
        
        if (["Feature Request", "Bug Report"].includes(setting)) 
            toLocation = ("reporting/" + setting.split(" ")[0].toLowerCase())
        else if (["Documentation", "Changelog", "Roadmap"].includes(setting))
            toLocation = ("docs/" + setting.toLowerCase())
        else toLocation = setting.toLowerCase();

        navigate("/" + toLocation);

        if (setting === 'Logout') {
            await supabase.auth.signOut();
            supabaseStore.setSession(null);
            supabaseStore.setUserType(null);
        }

        setAnchorElUser(null);
    };

    return (
        <AppBar>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton color="inherit" onClick={() => navigate("/")}>
                    <HomeIcon />
                </IconButton>
                <Typography variant="h6">OpenFitness</Typography> 
                {/* <Avatar src={"M"} sx={{ width: 40, height: 40 }} /> */}
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="M" src="M" />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                    {settings.map((setting: string, index: number) => (
                        <MenuItem 
                            key={setting} 
                            onClick={() => handleCloseUserMenu(setting)} 
                            sx={{
                                ...[1, 4, 6].includes(index) 
                                && { borderBottom: "solid 1px rgba(33,33,33, 1)" }
                            }}
                        >
                            {/* <ListItemIcon sx={{ px: 1 }}>
                                <Avatar alt="M" />
                            </ListItemIcon> */}
                            <Typography>
                                {setting}
                            </Typography>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
            </Toolbar>
            <Alert severity='warning'>
                <Typography variant="h6">
                    Live Data is being used. Click <a style={{ "cursor": "pointer" }}>here</a> for more information.
                </Typography>
            </Alert>
        </AppBar>
    )
}
