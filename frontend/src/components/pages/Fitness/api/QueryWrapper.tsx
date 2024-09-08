import { ReactNode, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';

import { CircularProgress } from '@mui/material';
import { queries } from '.';


const QueryWrapper = ({
    path,
    children,
    loadingContent,
    errorContent
} : {
    path: string,
    children: (data: any) => ReactNode
    loadingContent?: ReactNode,
    errorContent?: (error: any) => ReactNode
}) => {
    const wrapperQuery = useQuery(queries.query(path));
    
    return ({
        pending: (<></>),
        loading: (loadingContent ? loadingContent : <CircularProgress />),
        error: (
            errorContent 
                ? errorContent(wrapperQuery.error) 
                : <>Something went wrong. {JSON.stringify(wrapperQuery.error, null, 2)}</>
        ),
        success: (
            <Suspense fallback={<CircularProgress />}>
                {children({ data: wrapperQuery.data })}
            </Suspense>
        )
    }[wrapperQuery.status])
};

export default QueryWrapper;