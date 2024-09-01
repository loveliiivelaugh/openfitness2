import { Box, Button, styled } from '@mui/material';

import AuthForm from './AuthForm';
import { useSupabaseStore } from '../../store';
import { supabase } from '../../config/auth.config';


const Styled = {
    AuthBox1: styled(Box)(() => ({
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center" 
    })),
    AuthBox2: styled(Box)(() => ({
        border: "1px solid white",
        borderRadius: "8px",
        padding: "24px",
        display: "block"
    }))
};

export function AuthProvider({ children }: any) {
    const supabaseStore = useSupabaseStore();

    async function handleGuestSignIn() {
        supabaseStore.setUserType("guest");
        
        const { data, error } = await supabase.auth.signInAnonymously();
        console.log("handleGuestSignIn: ", data, error);
        supabaseStore.setSession(data as any);
    };

    async function handleSubmit(form: { email: string, password: string }) {
        supabaseStore.setUserType("admin");

        const { data, error }  = await supabase.auth.signInWithPassword(form);
        console.log("handleSubmit: ", data, error);
        supabaseStore.setSession(data as any);
    };

    if (!supabaseStore.session && !supabaseStore.userType) return (
        <Styled.AuthBox1>
            <Styled.AuthBox2>
                <Button color="inherit" onClick={() => supabaseStore.setUserType("admin")}>
                    Sign In
                </Button>
                <Button color="inherit" onClick={handleGuestSignIn}>
                    Continue as Guest
                </Button>
            </Styled.AuthBox2>
        </Styled.AuthBox1>
    );

    if (!supabaseStore.session && (supabaseStore.userType === "admin")) return (
        <AuthForm 
            handleSubmit={handleSubmit} 
            handleCancel={() => supabaseStore.setUserType(null)}
        />
    );

    else return children;
};