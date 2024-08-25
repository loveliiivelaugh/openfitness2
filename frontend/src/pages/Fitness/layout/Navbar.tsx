import React from 'react'
import {
    AppBar, Avatar, Box, IconButton, Menu,
    MenuItem, Toolbar, Tooltip, Typography
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import { paths } from '../api';
import { useSupabaseStore } from '../../../store';


const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
type SettingType = 'Profile' | 'Account' | 'Dashboard' | 'Logout';

export const Navbar = () => {
    const supabaseStore = useSupabaseStore();
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = async (setting: SettingType) => {
        if (setting === 'Logout') {
            const result = true;
            if (result) supabaseStore.setSession(null);
        };

        setAnchorElUser(null);
    };

    return (
        <AppBar>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton color="inherit">
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
                    {settings.map((setting: any) => (
                        <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                            <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
