import { Alert, Typography } from '@mui/material'

const Alerts = ({ message }: { message: string }) => {
    return (
        <Alert severity={'error'}>
            <Typography variant="h6">
                {message}
            </Typography>
        </Alert>
    )
};

export default Alerts
