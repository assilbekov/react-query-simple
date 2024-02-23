import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
type TData = {
    [key: string]: any;
};
type ListHookData<T extends string, R = TData[]> = {
    [K in `useGet${Capitalize<T>}sQuery`]: () => UseQueryResult<R>;
};
type GetHookData<T extends string, R = TData> = {
    [K in `useGet${Capitalize<T>}Query`]: (id: number) => UseQueryResult<R>;
};
type CreateHookData<T extends string, R = TData> = {
    [K in `useCreate${Capitalize<T>}Mutation`]: () => UseMutationResult<R>;
};
type UpdateHookData<T extends string, R = TData> = {
    [K in `useUpdate${Capitalize<T>}Mutation`]: () => UseMutationResult<R>;
};
type DeleteHookData<T extends string, R = void> = {
    [K in `useDelete${Capitalize<T>}Mutation`]: () => UseMutationResult<R>;
};
type RData<T extends string, ListResponse = T[], GetResponse = T, CreateResponse = T, UpdateResponse = T, DeleteResponse = void> = ListHookData<T, ListResponse> & GetHookData<T, GetResponse> & CreateHookData<T, CreateResponse> & UpdateHookData<T, UpdateResponse> & DeleteHookData<T, DeleteResponse>;
type EditParamsDict = {
    [key: string]: string | number;
};
type EditUrlArg = {
    baseUrl: string;
    name: string;
    type: "GET" | "POST" | "PUT" | "DELETE";
    id?: string | number;
    params: EditParamsDict;
};
type EditUrlFunc = (url: EditUrlArg) => string;
type UseEditParams = () => {
    editUrl: EditUrlFunc;
    keyParams: EditParamsDict;
};
type TFetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;
type UseFetch = () => TFetch;
export declare function reactQuerySimple<T extends TData, E extends string, ListResponse = T[], GetResponse = T, CreateResponse = T, UpdateResponse = T, DeleteResponse = void>({ name, baseUrl, useEditParams, useFetch, }: {
    name: E;
    baseUrl: string;
    useEditParams?: UseEditParams;
    useFetch?: UseFetch;
}): RData<E, ListResponse, GetResponse, CreateResponse, UpdateResponse, DeleteResponse>;
export {};
//# sourceMappingURL=index.d.ts.map