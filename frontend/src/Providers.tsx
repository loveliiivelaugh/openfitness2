import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { PageTransitionWrapper, ThemeProvider } from './theme/ThemeProvider';
import './index.css'


const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <PageTransitionWrapper>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            {children}
                        </LocalizationProvider>
                    </PageTransitionWrapper>
                </ThemeProvider>
            </QueryClientProvider>
    );
};