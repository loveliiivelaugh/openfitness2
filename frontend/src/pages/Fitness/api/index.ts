import axios from 'axios';
import { supabase } from '../../../config/auth.config';

const paths = {
    "auth": "/auth",
    "appConfig": "/appConfig",
    "database": "/database",
    "openfitness": "/openfitness",
    "appDepot": (import.meta.env.MODE === "development")
        ? "http://localhost:3000"
        : import.meta.env.VITE_HOME_APP,
    "hostname": (import.meta.env.MODE === "development")
        ? "http://localhost:5001"
        : import.meta.env.VITE_HOSTNAME
}

const client = axios.create({
    baseURL: (paths.hostname + "/api/v1"),
    headers: {},
});

type RequestMethods = "get" | "post" | "put" | "patch" | "delete";

type WriteTableReqData = {
    method?: RequestMethods
    table: string
    data: any
}

type SearchQueryReq = {
    query: string
}

const fitnessQueries = ({
    readDatabaseQuery: () => ({
        queryKey: ['readDatabase'],
        queryFn: async () => (await client.get(`/database/schema`)).data
    }),
    readTableQuery: (schema: any) => ({
        queryKey: ['readTableData', schema],
        queryFn: async () => (await client.get(`/database/${schema.table}`)).data,
        // queryFn: async () => (await client.get(`/database/read_db?table=${schema.table}`)).data,
    }),
    writeTableQuery: () => ({
        mutationKey: ['mutateDb'],
        mutationFn: async (data: WriteTableReqData) => (await client.post(`/database/${data.table}`, data.data)).data
        // mutationFn: async (data: WriteTableReqData) => (await client.post(`/database/${data.table}`, data.data)).data
    }),
    updateTableQuery: () => ({
        mutationKey: ['mutateDb'],
        mutationFn: async (data: WriteTableReqData) => (await client.put(`/database/${data.table}`, data.data)).data
        // mutationFn: async (data: WriteTableReqData) => (await client.put(`/database/${data.table}`, data.data)).data
    }),
    fitnessTablesQuery: () => ({
        queryKey: ['fitnessTables'],
        queryFn: async () => (await client.get(`/openfitness/fitness_tables`)).data
    }),
    exercisesQuery: () => ({
        queryKey: ['exercisedb'],
        mutationFn: async (params: SearchQueryReq) => (await client.get(`/openfitness/get-exercises?name=${params.query}`)).data,
        enabled: false
    }),
    foodsQuery: () => ({
        queryKey: ['fooddb'],
        mutationFn: async (params: SearchQueryReq) => {
            console.log('foodsQuery.mutationFn: ', params)
            return (await client.get(`/openfitness/get-foods?food=${params.query}`)).data},
        enabled: false
    })
});

// general app queries
const queries = ({
    // General Query to use any query with a passed queryPath
    query: (queryPath: string, payload?: any, method?: string) => ({
        queryKey: [queryPath],
        queryFn: async () => payload 
            ? (await (client as any)[method || "post"](queryPath, payload)).data
            : (await (client as any)[method || "get"](queryPath)).data
    }),

    queryDirect: (params: any) => ({
        queryKey: [`direct-${params.table}`], 
        queryFn: async () => (await supabase.from(params.table).select('*')).data
    })
});

export { client, paths, fitnessQueries, queries };