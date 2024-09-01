import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { PageTransitionWrapper, ThemeProvider } from '../../theme/ThemeProvider';
import { AuthProvider } from '../Auth/Auth3';


const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <PageTransitionWrapper>
                        <AuthProvider>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                {children}
                            </LocalizationProvider>
                        </AuthProvider>
                    </PageTransitionWrapper>
                </ThemeProvider>
            </QueryClientProvider>
    );
};