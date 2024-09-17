import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    AppBar, Avatar, Box, IconButton, 
    Toolbar, Tooltip, Typography
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { useSupabaseStore, useUtilityStore } from '../../../../utilities/store';
import NavSettingsMenu from './NavSettingsMenu';



export const Navbar = () => {
    const navigate = useNavigate();
    const supabaseStore = useSupabaseStore();
    const utilityStore = useUtilityStore();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = async (setting: any) => {
        if (setting?.onClick) setting.onClick({ supabaseStore, navigate });
        else navigate(setting.toLocation);

        setAnchorElUser(null);
    };

    return (
        <AppBar>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                
                <IconButton color="inherit" onClick={() => navigate("/")}>
                    <HomeIcon />
                </IconButton>
                
                <Typography variant="h6">OpenFitness</Typography> 
                
                <Box sx={{ display: "flex", flexGrow: 0, gap: 1 }}>

                    {/* Settings Dropdown Menu */}
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="M" src="M" />
                        </IconButton>
                    </Tooltip>
                    <NavSettingsMenu 
                        anchorElUser={anchorElUser} 
                        handleCloseUserMenu={handleCloseUserMenu} 
                    />

                    {/* Light/Dark Mode */}
                    <Tooltip title={true ? "Light Mode" : "Dark Mode"}>
                        <IconButton color="inherit" onClick={() => utilityStore.setColorMode(utilityStore.colorMode === "light" ? "dark" : "light")}>
                            {utilityStore.colorMode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Tooltip>

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
