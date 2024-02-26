import {
  useMutation,
  useQuery,
  UseMutationResult,
  UseQueryResult,
  DefaultError,
  UseMutationOptions,
  QueryClient,
  QueryKey,
  UseQueryOptions,
  UndefinedInitialDataOptions,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  useQueryClient,
} from "@tanstack/react-query";

const capitalizeFirstLetter = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const useDefaultEditParams: UseEditParams = () => {
  return {
    editUrl: (url: EditUrlArg) => url.baseUrl,
    keyParams: {},
  };
}

const useDefaultFetch: UseFetch = () => {
  return async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    const response = await fetch(
      input,
      {
        headers: { 'Content-Type': 'application/json' },
        ...init,
      },
    );

    return response.json();
  };
}

export function reactQuerySimple<
  TEntity extends (unknown & { id: number | string }),
  EName extends string,
  LTQueryFnData = TEntity[],
  GTQueryFnData = TEntity,
  CData = Partial<TEntity>,
  UData = TEntity,
  DData = void,
  LTError = DefaultError,
  GTError = DefaultError,
  CError = DefaultError,
  UError = DefaultError,
  DError = DefaultError,
  LTData = LTQueryFnData,
  GTData = GTQueryFnData,
  CVariables = CData,
  UVariables = UData,
  DVariables = TID,
  LTQueryKey extends QueryKey = QueryKey,
  GTQueryKey extends QueryKey = QueryKey,
  CContext = unknown,
  UContext = unknown,
  DContext = unknown,
>({ name, baseUrl, useEditParams = useDefaultEditParams, useFetch = useDefaultFetch }: {
  name: EName;
  baseUrl: string;
  useEditParams?: UseEditParams;
  useFetch?: UseFetch;
}): RData<
  EName,
  LTQueryFnData,
  GTQueryFnData,
  CData,
  UData,
  DData,
  LTError,
  GTError,
  CError,
  UError,
  DError,
  LTData,
  GTData,
  CVariables,
  UVariables,
  DVariables,
  LTQueryKey,
  GTQueryKey,
  CContext,
  UContext,
  DContext> {
  const pluralizedName = `${name}s`;
  const capitiledName = capitalizeFirstLetter(name);

  const getListApi = async (_fetch: TFetch, editUrl: EditUrlFunc, params: EditParamsDict): Promise<LTQueryFnData> => {
    return await _fetch(editUrl({
      baseUrl: `${baseUrl}/${pluralizedName}`,
      name,
      type: "GET",
      params,
    }), {
      method: "GET",
    }) as LTQueryFnData;
  };

  const getApi = async (id: TID, _fetch: TFetch, editUrl: EditUrlFunc, params: EditParamsDict): Promise<GTQueryFnData> => {
    return await _fetch(editUrl({
      baseUrl: `${baseUrl}/${pluralizedName}/${id}`,
      name,
      type: "GET",
      id,
      params,
    }), {
      method: "GET",
    }) as GTQueryFnData;
  };

  const createApi = async (data: Partial<TEntity>, _fetch: TFetch, editUrl: EditUrlFunc, params: EditParamsDict): Promise<CData> => {
    return await _fetch(editUrl({
      baseUrl: `${baseUrl}/${pluralizedName}`,
      name,
      type: "POST",
      params,
    }), {
      method: "POST",
      body: JSON.stringify(data),
    }) as CData;
  };

  const updateApi = async (data: TEntity, _fetch: TFetch, editUrl: EditUrlFunc, params: EditParamsDict): Promise<UData> => {
    return await _fetch(editUrl({
      baseUrl: `${baseUrl}/${pluralizedName}/${data.id}`,
      name,
      type: "PUT",
      id: data.id,
      params,
    }), {
      method: "PUT",
      body: JSON.stringify(data),
    }) as UData;
  };

  const deleteApi = async (id: number, _fetch: TFetch, editUrl: EditUrlFunc, params: EditParamsDict) => {
    return await _fetch(editUrl({
      baseUrl: `${baseUrl}/${pluralizedName}/${id}`,
      name,
      type: "DELETE",
      id,
      params,
    }), {
      method: "DELETE",
    });
  };

  function useGetListQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(options?: UseQueryOptionsSimple<TQueryFnData, TError, TData, TQueryKey>,
    _queryClient?: QueryClient): UseQueryResult<TData, TError> | DefinedUseQueryResult<TData, TError> {
    const _fetch = useFetch();
    const { editUrl, keyParams } = useEditParams();

    return useQuery({
      queryKey: [name, { type: "list" }, keyParams] as unknown as TQueryKey,
      queryFn: async () => getListApi(_fetch, editUrl, keyParams) as TQueryFnData,
      ...options,
    });
  }

  function useGetQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(id: TID, options?: UseQueryOptionsSimple<TQueryFnData, TError, TData, TQueryKey>,
    _queryClient?: QueryClient): UseQueryResult<TData, TError> | DefinedUseQueryResult<TData, TError> {
    const _fetch = useFetch();
    const { editUrl, keyParams } = useEditParams();

    return useQuery({
      queryKey: [name, { id }, keyParams] as unknown as TQueryKey,
      queryFn: async () => getApi(id, _fetch, editUrl, keyParams) as TQueryFnData,
      ...options,
    });
  }

  function useCreateMutation<
    TData = TEntity,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown>(options?: UseMutationOptions<TData, TError, TVariables, TContext>,
      _queryClient?: QueryClient): UseMutationResult<TData, TError, TVariables, TContext> {
    const _fetch = useFetch();
    const queryClient = useQueryClient();
    const { editUrl, keyParams } = useEditParams();

    return useMutation({
      mutationFn: (async (data: Partial<TEntity>) => createApi(data, _fetch, editUrl, keyParams)) as unknown as MutationFunction<TData, TVariables>,
      onSuccess: () => {
        queryClient?.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
      },
      ...options,
    });
  }

  function useUpdateMutation<
    TData = TEntity,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown>(options?: UseMutationOptions<TData, TError, TVariables, TContext>,
      _queryClient?: QueryClient): UseMutationResult<TData, TError, TVariables, TContext> {
    const _fetch = useFetch();
    const queryClient = useQueryClient();
    const { editUrl, keyParams } = useEditParams();

    return useMutation({
      mutationFn: (async (data: TEntity) => updateApi(data, _fetch, editUrl, keyParams)) as unknown as MutationFunction<TData, TVariables>,
      onSuccess: () => {
        queryClient?.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
      },
      ...options,
    });
  }

  function useDeleteMutation<
    TData = void,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown>(options?: UseMutationOptions<TData, TError, TVariables, TContext>,
      _queryClient?: QueryClient): UseMutationResult<TData, TError, TVariables, TContext> {
    const _fetch = useFetch();
    const queryClient = useQueryClient();
    const { editUrl, keyParams } = useEditParams();

    return useMutation({
      mutationFn: (async (data: number) => deleteApi(data, _fetch, editUrl, keyParams)) as unknown as MutationFunction<TData, TVariables>,
      onSuccess: () => {
        queryClient?.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
      },
      ...options,
    });
  }

  return {
    [`useGet${capitiledName}sQuery`]: useGetListQuery,
    [`useGet${capitiledName}Query`]: useGetQuery,
    [`useCreate${capitiledName}Mutation`]: useCreateMutation,
    [`useUpdate${capitiledName}Mutation`]: useUpdateMutation,
    [`useDelete${capitiledName}Mutation`]: useDeleteMutation,
  } as RData<
    EName,
    LTQueryFnData,
    GTQueryFnData,
    CData,
    UData,
    DData,
    LTError,
    GTError,
    CError,
    UError,
    DError,
    LTData,
    GTData,
    CVariables,
    UVariables,
    DVariables,
    LTQueryKey,
    GTQueryKey,
    CContext,
    UContext,
    DContext>
}

type TID = number | string;
type _TData = {
  [key: string]: unknown;
} & { id: TID };

type UseMutationSimple<
  TData = _TData,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> = (
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
  _queryClient?: QueryClient,
) => UseMutationResult<TData, TError, TVariables, TContext>;

type CreateMutationHookData<
  EName extends string,
  TData = _TData,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown> = {
    [K in `useCreate${Capitalize<EName>}Mutation`]: UseMutationSimple<TData, TError, TVariables, TContext>;
  }

type UpdateMutationHookData<
  EName extends string,
  TData = _TData,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown> = {
    [K in `useUpdate${Capitalize<EName>}Mutation`]: UseMutationSimple<TData, TError, TVariables, TContext>;
  }

type DeleteMutationHookData<
  EName extends string,
  TData = void,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown> = {
    [K in `useDelete${Capitalize<EName>}Mutation`]: UseMutationSimple<TData, TError, TVariables, TContext>;
  }

type UseQueryOptionsSimple<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> |
  UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> |
  DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>;

type UseQuerySimple<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = (
  options?: UseQueryOptionsSimple<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient,
) => UseQueryResult<TData, TError> | DefinedUseQueryResult<TData, TError>;

type UseGetQuerySimple<
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey> = (
    id: number | string,
    options?: UseQueryOptionsSimple<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
  ) => UseQueryResult<TData, TError> | DefinedUseQueryResult<TData, TError>;

type GetQueryHookData<
  T extends string,
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = {
    [K in `useGet${Capitalize<T>}Query`]: UseGetQuerySimple<TQueryFnData, TError, TData, TQueryKey>;
  }

type ListQueryHookData<
  T extends string,
  TQueryFnData,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = {
    [K in `useGet${Capitalize<T>}sQuery`]: UseQuerySimple<TQueryFnData, TError, TData, TQueryKey>;
  }

type RData<
  T extends string,
  LTQueryFnData,
  GTQueryFnData,
  CData = GTQueryFnData,
  UData = LTQueryFnData,
  DData = void,
  LTError = DefaultError,
  GTError = DefaultError,
  CError = DefaultError,
  UError = DefaultError,
  DError = DefaultError,
  LTData = LTQueryFnData,
  GTData = GTQueryFnData,
  CVariables = Partial<CData>,
  UVariables = UData,
  DVariables = DData,
  LTQueryKey extends QueryKey = QueryKey,
  GTQueryKey extends QueryKey = QueryKey,
  CContext = unknown,
  UContext = unknown,
  DContext = unknown,
> = ListQueryHookData<T, LTQueryFnData, LTError, LTData, LTQueryKey> &
  GetQueryHookData<T, GTQueryFnData, GTError, GTData, GTQueryKey> &
  CreateMutationHookData<T, CData, CError, CVariables, CContext> &
  UpdateMutationHookData<T, UData, UError, UVariables, UContext> &
  DeleteMutationHookData<T, DData, DError, DVariables, DContext>;

type EditParamsDict = {
  [key: string]: string | number;
}
type EditUrlArg = {
  baseUrl: string;
  name: string;
  type: "GET" | "POST" | "PUT" | "DELETE";
  id?: string | number;
  params: EditParamsDict;
}
type EditUrlFunc = (url: EditUrlArg) => string;
type UseEditParams = () => {
  editUrl: EditUrlFunc;
  keyParams: EditParamsDict;
}

type TFetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;
type UseFetch = () => TFetch;