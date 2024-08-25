import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';

import AuthForm from './AuthForm';
import { client } from '../pages/Fitness/api';
import { useSupabaseStore } from '../store';

export async function handleSignOut() {

    const result = await client.get("/auth/v1/logout");

    localStorage.removeItem("jwt");
    
    if (result.data) return true;

    return false
}

export function AuthProvider({ children }: any) {
    const supabaseStore = useSupabaseStore();
    const [userType, setUserType] = useState<"admin" | "guest" | null>("admin");


    async function handleSuccess(data: any) {
        localStorage.setItem("jwt", data.jwt);

        supabaseStore.setSession({ 
            ...data, 
            roles: data.roles
                .map(({ role }: { role: string }) => JSON.parse(role))[0]
        });
        
        (client as any).defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
        // Get App Config right here
    }

    async function handleGuestSignIn() {
        setUserType("guest");
        
        // Can change this to anonymous login
        // Updated Flow:
        const response = await client.post('/auth/v1/login', {
            email: import.meta.env.VITE_GUEST_LOGIN_EMAIL,
            password: import.meta.env.VITE_GUEST_LOGIN_PASSWORD
        });

        if (response.data) handleSuccess(response.data);
    };

    async function handleSubmit(form: { email: string, password: string }) {
        setUserType("admin");

        // Updated Flow:
        const response = await client.post('/auth/v1/login', form);

        if (response.data) handleSuccess(response.data);
    };

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");

        if (jwt) client.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
        
        client.post('/auth/v1/protected', { token: jwt })
            .then((response: any) => {

                setUserType("admin");

                if (response.data.status === "success") handleSuccess({ ...response.data.user.data, jwt });
            })
    }, []);


    if (!supabaseStore.session && !userType) return (
        <Box sx={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ border: "1px solid white", borderRadius: 1, p: 3, display: "block" }}>
                <Button onClick={() => setUserType("admin")}>Continue as Admin</Button>
                <Button onClick={handleGuestSignIn}>Continue as Guest</Button>
            </Box>
        </Box>
    );

    if (!supabaseStore.session && (userType === "admin")) {
        return <AuthForm handleSubmit={handleSubmit} handleCancel={() => setUserType(null)} />
    }

    else return children;
}