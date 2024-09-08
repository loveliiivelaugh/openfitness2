import { Box, Button, styled } from '@mui/material';
import { useEffect } from 'react';

import AuthForm from './AuthForm';
import { useFitnessStore, useSupabaseStore } from '../../utilities/store';
import { supabase } from '../../utilities/config/auth.config';
import { client } from '../pages/Fitness/api';
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
        
        // If Auth from Backend
        const response = (await client.post('/auth/login/guest')).data;
        supabaseStore.setSession(response);
        // If auth from Front end
        // const { data } = await supabase.auth.signInAnonymously();
        // console.log("handleGuestSignIn: ", response);
        fitnessStore.setRegistrationView(true);
        // supabaseStore.setSession(data.session as any);
    };

    async function handleSubmit(form: { email: string, password: string }, loginType: string) {
        supabaseStore.setUserType("admin");

        if (loginType === "signin") {
            // If Auth from Backend
            const response = (await client.post('/auth/login/user', form)).data;
            // console.log("handleSubmit: ", response);
            supabaseStore.setSession(response);
            const { data } = await supabase.auth.setSession(response.session)
            if (data) console.log("setSession: Success!");
            // // If auth from Front end
            // const { data }  = await supabase.auth.signInWithPassword(form);
            // supabaseStore.setSession(data.session as any);
        }

        if (loginType === "signup") {
            // If Auth from Backend
            const response = await client.post('/auth/signup', form);
            // console.log("handleSubmit:.signup:  ", response);
            // // If auth from Front end
            // const { data } = await supabase.auth.signUp(form);
            fitnessStore.setRegistrationView(true);
            supabaseStore.setSession(response.data as any);
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

    // todo: Work on auto-login with JWT
    // useEffect(() => {
    //     const jwt = localStorage.getItem("jwt");

    //     if (jwt) client.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
        
    //     client.post('/auth/protected', { token: jwt })
    //         .then(({ data }: any) => {
    //             if (data) console.log('/auth/protected: Success!')
    //             supabaseStore.setUserType("admin");
    //             // supabaseStore.setSession(data);
    //             // fitnessStore.setRegistrationView(false);
    //         })
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