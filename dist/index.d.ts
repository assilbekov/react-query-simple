import { UseMutationResult, UseQueryResult, DefaultError, UseMutationOptions, QueryClient, QueryKey, UseQueryOptions, UndefinedInitialDataOptions, DefinedInitialDataOptions, DefinedUseQueryResult } from "@tanstack/react-query";
type TID = number | string;
type _TData = {
    [key: string]: unknown;
} & {
    id: TID;
};
type UseMutationSimple<TData = _TData, TError = DefaultError, TVariables = void, TContext = unknown> = (options?: UseMutationOptions<TData, TError, TVariables, TContext>, _queryClient?: QueryClient) => UseMutationResult<TData, TError, TVariables, TContext>;
type CreateMutationHookData<EName extends string, TData = _TData, TError = DefaultError, TVariables = void, TContext = unknown> = {
    [K in `useCreate${Capitalize<EName>}Mutation`]: UseMutationSimple<TData, TError, TVariables, TContext>;
};
type UpdateMutationHookData<EName extends string, TData = _TData, TError = DefaultError, TVariables = void, TContext = unknown> = {
    [K in `useUpdate${Capitalize<EName>}Mutation`]: UseMutationSimple<TData, TError, TVariables, TContext>;
};
type DeleteMutationHookData<EName extends string, TData = void, TError = DefaultError, TVariables = void, TContext = unknown> = {
    [K in `useDelete${Capitalize<EName>}Mutation`]: UseMutationSimple<TData, TError, TVariables, TContext>;
};
type UseQueryOptionsSimple<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>;
type UseQuerySimple<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = (options?: UseQueryOptionsSimple<TQueryFnData, TError, TData, TQueryKey>, queryClient?: QueryClient) => UseQueryResult<TData, TError> | DefinedUseQueryResult<TData, TError>;
type UseGetQuerySimple<TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = (id: number | string, options?: UseQueryOptionsSimple<TQueryFnData, TError, TData, TQueryKey>, queryClient?: QueryClient) => UseQueryResult<TData, TError> | DefinedUseQueryResult<TData, TError>;
type GetQueryHookData<T extends string, TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = {
    [K in `useGet${Capitalize<T>}Query`]: UseGetQuerySimple<TQueryFnData, TError, TData, TQueryKey>;
};
type ListQueryHookData<T extends string, TQueryFnData, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = {
    [K in `useGet${Capitalize<T>}sQuery`]: UseQuerySimple<TQueryFnData, TError, TData, TQueryKey>;
};
type RData<T extends string, LTQueryFnData, GTQueryFnData, CData = GTQueryFnData, UData = LTQueryFnData, DData = void, LTError = DefaultError, GTError = DefaultError, CError = DefaultError, UError = DefaultError, DError = DefaultError, LTData = LTQueryFnData, GTData = GTQueryFnData, CVariables = Partial<CData>, UVariables = UData, DVariables = DData, LTQueryKey extends QueryKey = QueryKey, GTQueryKey extends QueryKey = QueryKey, CContext = unknown, UContext = unknown, DContext = unknown> = ListQueryHookData<T, LTQueryFnData, LTError, LTData, LTQueryKey> & GetQueryHookData<T, GTQueryFnData, GTError, GTData, GTQueryKey> & CreateMutationHookData<T, CData, CError, CVariables, CContext> & UpdateMutationHookData<T, UData, UError, UVariables, UContext> & DeleteMutationHookData<T, DData, DError, DVariables, DContext>;
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
export declare function reactQuerySimple<TEntity extends (unknown & {
    id: number | string;
}), EName extends string, LTQueryFnData = TEntity[], GTQueryFnData = TEntity, CData = Partial<TEntity>, UData = TEntity, DData = void, LTError = DefaultError, GTError = DefaultError, CError = DefaultError, UError = DefaultError, DError = DefaultError, LTData = LTQueryFnData, GTData = GTQueryFnData, CVariables = CData, UVariables = UData, DVariables = TID, LTQueryKey extends QueryKey = QueryKey, GTQueryKey extends QueryKey = QueryKey, CContext = unknown, UContext = unknown, DContext = unknown>({ name, baseUrl, useEditParams, useFetch }: {
    name: EName;
    baseUrl: string;
    useEditParams?: UseEditParams;
    useFetch?: UseFetch;
}): RData<EName, LTQueryFnData, GTQueryFnData, CData, UData, DData, LTError, GTError, CError, UError, DError, LTData, GTData, CVariables, UVariables, DVariables, LTQueryKey, GTQueryKey, CContext, UContext, DContext>;
export declare const queryClientSimple: QueryClient;
export {};
//# sourceMappingURL=index.d.ts.map