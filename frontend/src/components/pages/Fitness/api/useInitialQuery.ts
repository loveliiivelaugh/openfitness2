import { useEffect, useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useFitnessStore } from '../../../../utilities/store';
import { openfitnessScripts } from '../../../../utilities/scripts';
import { paths, queries } from '.';

const topics: any[] = ["Weight", "Food", "Exercise", "Profile", "Sleep", "Steps"];

const usePrivateDatabase = () => {
    const weightTable = useIndexedDB("weight");
    const foodTable = useIndexedDB("food");
    const exerciseTable = useIndexedDB("exercise");
    const profileTable = useIndexedDB("profile");
    const sleepTable = useIndexedDB("sleep");
    const stepsTable = useIndexedDB("steps");

    return { 
        // table: { getById, getByIndex, getAll, add, update, deleteRecord, clear },
        weightTable, 
        foodTable,
        exerciseTable,
        profileTable,
        sleepTable,
        stepsTable 
    };
};

const useInitialQuery = () => {
    const fitnessStore = useFitnessStore();
    const privateDatabase = usePrivateDatabase();
    console.log("useInitialQuery.privateDatabase: ", { privateDatabase });
    const [data, setData] = useState<any>({});
    const [status, setStatus] = useState<"pending" | "loading" | "success" | "error">("loading");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    const schemaQuery = useQuery(queries.query(paths.database + "/schema"));
    const directQueries = useQueries({ 
        queries: [...topics].map((topic: string) => queries.queryDirect({ table: topic.toLowerCase() }))
    });

    const loadTables = async () => {
        const fitnessTables = directQueries.map((query: any) => query.data);

        // console.log("loadTables: ", { fitnessTables, schemaQuery });
        const results = await openfitnessScripts.getAllTables({ 
            tablesResults: fitnessTables, 
            schemas: schemaQuery.data 
        });
        fitnessStore.setFitnessTables(results);
        setData(results);
        setStatus("success");
        setIsLoading(false);
    };
    const reload = async () => {
        const result = await Promise.allSettled(
            directQueries.map((query: { refetch: () => void }) => query.refetch())
        );
        await loadTables();
        return result;
    };

    let isSuccess = [...directQueries, schemaQuery].every((query: { isSuccess: boolean }) => query.isSuccess);

    useEffect(() => {
        if (isSuccess) loadTables();
        else {
            setStatus("error");
            setIsLoading(false);
            setIsError(true);
        };
    }, [isSuccess]);

    return { data, isLoading, isError, status, reload };
};

export default useInitialQuery;