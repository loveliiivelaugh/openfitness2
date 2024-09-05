import { Box, Button, styled } from '@mui/material';
// import { useEffect } from 'react';

import AuthForm from './AuthForm';
import { useFitnessStore, useSupabaseStore } from '../../store';
import { supabase } from '../../config/auth.config';
// import RegistrationView from '../../pages/Registration/RegistrationView';


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
    const fitnessStore = useFitnessStore();

    async function handleGuestSignIn() {
        supabaseStore.setUserType("guest");
        
        const { data } = await supabase.auth.signInAnonymously();
        fitnessStore.setRegistrationView(true);
        supabaseStore.setSession(data.session as any);
    };

    async function handleSubmit(form: { email: string, password: string }, loginType: string) {
        supabaseStore.setUserType("admin");

        if (loginType === "signin") {
            const { data }  = await supabase.auth.signInWithPassword(form);
            supabaseStore.setSession(data.session as any);
        }

        if (loginType === "signup") {
            const { data } = await supabase.auth.signUp(form);
            fitnessStore.setRegistrationView(true);
            supabaseStore.setSession(data as any);
        }
    };

    async function handleCancel() {
        fitnessStore.setRegistrationView(false);
        supabaseStore.setUserType(null);
        supabaseStore.setSession(null);
    };

    async function handleForgotPassword(email: string) {
        // const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        console.log("handleForgotPassword: ", email);
    };

    // useEffect(() => {
    //     // Auto-login
    //     const storageKeys = Object.keys(localStorage);

    //     if (storageKeys[0].includes("auth-token")) {
    //         const key = storageKeys[0];
    //         (async () => {
    //             const token = JSON.parse(localStorage.getItem(key) as string)?.access_token;
    //             console.log("localStorage.login.token: ", token)
    //             // supabase.auth.getUser();
    //             const response = await supabase.auth.getUser(token);
    //             // const response = await supabase.auth.getUser(JSON.parse(localStorage.getItem(key) as string)?.access_token);
    //             console.log("localStorage.login.response: ", response);
    //         })();
    //     };
    // }, []);


    // if (fitnessStore.registrationView) return <RegistrationView />;

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
            handleCancel={handleCancel}
            handleForgotPassword={handleForgotPassword}
        />
    );

    else return children;
};