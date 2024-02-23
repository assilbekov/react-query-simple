"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactQuerySimple = void 0;
const react_query_1 = require("@tanstack/react-query");
const capitalizeFirstLetter = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};
const useDefaultEditParams = () => {
    return {
        editUrl: (url) => url.baseUrl,
        keyParams: {},
    };
};
const useDefaultFetch = () => {
    return fetch;
};
function reactQuerySimple({ name, baseUrl, useEditParams = useDefaultEditParams, useFetch = useDefaultFetch, }) {
    const pluralizedName = `${name}s`;
    const capitiledName = capitalizeFirstLetter(name);
    const getListApi = (_fetch, editUrl, params) => __awaiter(this, void 0, void 0, function* () {
        const response = yield _fetch(editUrl({
            baseUrl: `${baseUrl}/${pluralizedName}`,
            name,
            type: "GET",
            params,
        }), {
            method: "GET",
        });
        return response.json();
    });
    const getApi = (id, _fetch, editUrl, params) => __awaiter(this, void 0, void 0, function* () {
        const response = yield _fetch(editUrl({
            baseUrl: `${baseUrl}/${pluralizedName}/${id}`,
            name,
            type: "GET",
            id,
            params,
        }), {
            method: "GET",
        });
        return response.json();
    });
    const createApi = (data, _fetch, editUrl, params) => __awaiter(this, void 0, void 0, function* () {
        const response = yield _fetch(editUrl({
            baseUrl: `${baseUrl}/${pluralizedName}`,
            name,
            type: "POST",
            params,
        }), {
            method: "POST",
            body: JSON.stringify(data),
        });
        return response.json();
    });
    const updateApi = (data, _fetch, editUrl, params) => __awaiter(this, void 0, void 0, function* () {
        const response = yield _fetch(editUrl({
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
    });
    const deleteApi = (id, _fetch, editUrl, params) => __awaiter(this, void 0, void 0, function* () {
        const response = yield _fetch(editUrl({
            baseUrl: `${baseUrl}/${pluralizedName}/${id}`,
            name,
            type: "DELETE",
            id,
            params,
        }), {
            method: "DELETE",
        });
        return response;
    });
    const useGetListHook = () => {
        const _fetch = useFetch();
        const { editUrl, keyParams } = useEditParams();
        return (0, react_query_1.useQuery)({
            queryKey: [name, { type: "list" }, keyParams],
            queryFn: () => getListApi(_fetch, editUrl, keyParams),
        });
    };
    const useGetHook = (id) => {
        const _fetch = useFetch();
        const { editUrl, keyParams } = useEditParams();
        return (0, react_query_1.useQuery)({
            queryKey: [name, { id }, keyParams],
            queryFn: () => getApi(id, _fetch, editUrl, keyParams),
        });
    };
    const useCreateHook = () => {
        const _fetch = useFetch();
        const queryClient = (0, react_query_1.useQueryClient)();
        const { editUrl, keyParams } = useEditParams();
        return (0, react_query_1.useMutation)({
            mutationFn: (data) => createApi(data, _fetch, editUrl, keyParams),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
            },
        });
    };
    const useUpdateHook = () => {
        const _fetch = useFetch();
        const queryClient = (0, react_query_1.useQueryClient)();
        const { editUrl, keyParams } = useEditParams();
        return (0, react_query_1.useMutation)({
            mutationFn: (data) => updateApi(data, _fetch, editUrl, keyParams),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
            },
        });
    };
    const useDeleteHook = () => {
        const _fetch = useFetch();
        const queryClient = (0, react_query_1.useQueryClient)();
        const { editUrl, keyParams } = useEditParams();
        return (0, react_query_1.useMutation)({
            mutationFn: (data) => deleteApi(data, _fetch, editUrl, keyParams),
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
    };
}
exports.reactQuerySimple = reactQuerySimple;
