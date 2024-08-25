import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import AuthProvider from './Auth/Auth';
import { PageTransitionWrapper, ThemeProvider } from './theme/ThemeProvider';
import './index.css'


const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <PageTransitionWrapper>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            {children}
                        </LocalizationProvider>
                    </PageTransitionWrapper>
                </ThemeProvider>
            </QueryClientProvider>
        </AuthProvider>
    );
};