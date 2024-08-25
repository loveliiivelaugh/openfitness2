import { useState, useEffect } from 'react'
import { ReactNode } from 'react';
import { Box, Button } from '@mui/material';

import AuthForm from './AuthForm';
import { supabase } from './supabase'
import { useSupabaseStore } from '../store';

export default function Auth({ children }: { children: ReactNode }) {
    const supabaseStore = useSupabaseStore();
    const [session, setSession] = useState<null | any>(null)
    const [userType, setUserType] = useState<"admin" | "guest" | null>(null);

    async function handleSuccess(data: any) {
        console.log("handleSuccess: ", data);
        supabaseStore.setSession({ 
            ...data, 
            // roles: data.roles
            //     .map(({ role }: { role: string }) => JSON.parse(role))[0]
        });
        // Get App Config right here
    };

    async function handleGuestSignIn() {
        setUserType("guest");
        
        // Updated Flow:
        const response = await supabase.auth.signInAnonymously();

        if (response.data) handleSuccess(response.data);
    };

    async function handleSubmit(form: { email: string, password: string }) {
        setUserType("admin");

        // Updated Flow:
        const response = await supabase.auth.signInWithPassword(form);

        if (response.data) handleSuccess(response.data);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!session && !userType) return (
        <Box sx={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ border: "1px solid white", borderRadius: 1, p: 3, display: "block" }}>
                <Button onClick={() => setUserType("admin")}>Continue to Sign In</Button>
                <Button onClick={handleGuestSignIn}>Continue as Guest</Button>
            </Box>
        </Box>
    );

    if (!supabaseStore.session && (userType === "admin")) {
        return <AuthForm handleSubmit={handleSubmit} handleCancel={() => setUserType(null)} />
    }

    else return children;
}