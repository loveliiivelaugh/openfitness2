import { useEffect, useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useFitnessStore } from '../../../store';
import { openfitnessScripts } from '../../../scripts';
import { paths, queries } from '.';

const topics: any[] = ["Weight", "Food", "Exercise", "Profile", "Sleep", "Steps"];

const useInitialQuery = () => {
    const fitnessStore = useFitnessStore();
    const [data, setData] = useState<any>([]);
    const [status, setStatus] = useState<"pending" | "loading" | "success" | "error">("loading");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const schemaQuery = useQuery(queries.query(paths.database + "/schema"));
    const directQueries = useQueries({ 
        queries: [...topics].map((topic: string) => queries.queryDirect({ table: topic.toLowerCase() }))
    });

    const reload = () => directQueries.forEach((query: { refetch: () => void }) => query.refetch());
    let isSuccess = [...directQueries, schemaQuery].every((query: { isSuccess: boolean }) => query.isSuccess);

    useEffect(() => {
        if (isSuccess) {
            const fitnessTables = directQueries.map((query: any) => query.data);
            (async () => {
                const results = await openfitnessScripts.getAllTables({ tablesResults: fitnessTables, schemas: schemaQuery.data });
                fitnessStore.setFitnessTables(results);
                setData(results);
                setStatus("success");
                setIsLoading(false);
            })();
        } else {
            setStatus("error");
            setIsLoading(false);
            setIsError(true);
        };
    }, [isSuccess]);

    return { data, isLoading, isError, status, reload };
};

export default useInitialQuery;