import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { initDB } from "react-indexed-db-hook";

import { DBConfig } from "../../utilities/config/indexedDb.config";
import { AlertProvider } from './AlertProvider';
import { PageTransitionWrapper, ThemeProvider } from '../../utilities/theme/ThemeProvider';
import { AuthProvider } from '../Auth/Auth3';
import { AppRouter } from '../routes/AppRouter';

// Database local to user -> Persists on user's device
initDB(DBConfig);

const queryClient = new QueryClient();

export const Providers = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <PageTransitionWrapper>
                <AuthProvider>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <AlertProvider>
                            <AppRouter />
                        </AlertProvider>
                    </LocalizationProvider>
                </AuthProvider>
            </PageTransitionWrapper>
        </ThemeProvider>
    </QueryClientProvider>
);