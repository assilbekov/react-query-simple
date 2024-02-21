import { useMutation, useQuery, useQueryClient, UseMutationResult, UseQueryResult } from "@tanstack/react-query";

type TData = {
  [key: string]: any
};

type ListHookData<T extends string, R = TData[]> = {
  [K in `useGet${Capitalize<T>}sQuery`]: () => UseQueryResult<R>;
}

type GetHookData<T extends string, R = TData> = {
  [K in `useGet${Capitalize<T>}Query`]: (id: number) => UseQueryResult<R>;
}

type CreateHookData<T extends string, R = TData> = {
  [K in `useCreate${Capitalize<T>}Mutation`]: () => UseMutationResult<R>;
}

type UpdateHookData<T extends string, R = TData> = {
  [K in `useUpdate${Capitalize<T>}Mutation`]: () => UseMutationResult<R>;
}

type DeleteHookData<T extends string, R = void> = {
  [K in `useDelete${Capitalize<T>}Mutation`]: () => UseMutationResult<R>;
}

type RData<
  T extends string,
  ListResponse = T[],
  GetResponse = T,
  CreateResponse = T,
  UpdateResponse = T,
  DeleteResponse = void
> = ListHookData<T, ListResponse> &
  GetHookData<T, GetResponse> &
  CreateHookData<T, CreateResponse> &
  UpdateHookData<T, UpdateResponse> &
  DeleteHookData<T, DeleteResponse>;

// UseEditParams --- START
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
  return fetch;
}

export function reactQuerySimple<
  T extends TData,
  E extends string,
  ListResponse = T[],
  GetResponse = T,
  CreateResponse = T,
  UpdateResponse = T,
  DeleteResponse = void
>({
  name, baseUrl, useEditParams = useDefaultEditParams, useFetch = useDefaultFetch,
}: {
  name: E;
  baseUrl: string;
  useEditParams?: UseEditParams;
  useFetch?: UseFetch;
}): RData<
  E,
  ListResponse,
  GetResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse
> {

  const pluralizedName = `${name}s`;
  const capitiledName = capitalizeFirstLetter(name);

  const getListApi = async (_fetch: TFetch, editUrl: EditUrlFunc, params: EditParamsDict): Promise<ListResponse> => {
    const response = await _fetch(editUrl({
      baseUrl: `${baseUrl}/${pluralizedName}`,
      name,
      type: "GET",
      params,
    }), {
      method: "GET",
    });

    return response.json();
  };

  const getApi = async (id: number, _fetch: TFetch, editUrl: EditUrlFunc, params: EditParamsDict): Promise<GetResponse> => {
    const response = await _fetch(editUrl({
      baseUrl: `${baseUrl}/${pluralizedName}/${id}`,
      name,
      type: "GET",
      id,
      params,
    }), {
      method: "GET",
    });

    return response.json();
  };

  const createApi = async (data: Partial<T>, _fetch: TFetch, editUrl: EditUrlFunc, params: EditParamsDict): Promise<CreateResponse> => {
    const response = await _fetch(editUrl({
      baseUrl: `${baseUrl}/${pluralizedName}`,
      name,
      type: "POST",
      params,
    }), {
      method: "POST",
      body: JSON.stringify(data),
    });

    return response.json();
  };

  const updateApi = async (data: T & { id: number }, _fetch: TFetch, editUrl: EditUrlFunc, params: EditParamsDict): Promise<UpdateResponse> => {
    const response = await _fetch(editUrl({
      baseUrl: `${baseUrl}/${pluralizedName}/${data.id}`,
      name,
      type: "PUT",
      id: data.id,
      params,
    }), {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return response.json();
  };

  const deleteApi = async (id: number, _fetch: TFetch, editUrl: EditUrlFunc, params: EditParamsDict) => {
    const response = await _fetch(editUrl({
      baseUrl: `${baseUrl}/${pluralizedName}/${id}`,
      name,
      type: "DELETE",
      id,
      params,
    }), {
      method: "DELETE",
    });

    return response;
  };

  const useGetListHook = () => {
    const _fetch = useFetch();
    const { editUrl, keyParams } = useEditParams();

    return useQuery({
      queryKey: [name, { type: "list" }, keyParams],
      queryFn: () => getListApi(_fetch, editUrl, keyParams),
    });
  };

  const useGetHook = (id: number) => {
    const _fetch = useFetch();
    const { editUrl, keyParams } = useEditParams();

    return useQuery({
      queryKey: [name, { id }, keyParams],
      queryFn: () => getApi(id, _fetch, editUrl, keyParams),
    });
  };

  const useCreateHook = () => {
    const _fetch = useFetch();
    const queryClient = useQueryClient();
    const { editUrl, keyParams } = useEditParams();

    return useMutation({
      mutationFn: (data: Partial<T>) => createApi(data, _fetch, editUrl, keyParams),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
      },
    });
  };

  const useUpdateHook = () => {
    const _fetch = useFetch();
    const queryClient = useQueryClient();
    const { editUrl, keyParams } = useEditParams();

    return useMutation({
      mutationFn: (data: T & { id: number }) => updateApi(data, _fetch, editUrl, keyParams),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
      },
    });
  };

  const useDeleteHook = () => {
    const _fetch = useFetch();
    const queryClient = useQueryClient();
    const { editUrl, keyParams } = useEditParams();

    return useMutation({
      mutationFn: (data: number) => deleteApi(data, _fetch, editUrl, keyParams),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
      },
    });
  };


  return {
    [`useGet${capitiledName}sQuery`]: useGetListHook,
    [`useGet${capitiledName}Query`]: useGetHook,
    [`useCreate${capitiledName}Mutation`]: useCreateHook,
    [`useUpdate${capitiledName}Mutation`]: useUpdateHook,
    [`useDelete${capitiledName}Mutation`]: useDeleteHook,
  } as RData<
    E,
    ListResponse,
    GetResponse,
    CreateResponse,
    UpdateResponse,
    DeleteResponse
  >;
}