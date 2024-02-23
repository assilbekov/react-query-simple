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
    return (input, init) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(input, Object.assign({ headers: { 'Content-Type': 'application/json' } }, init));
        return response.json();
    });
};
function reactQuerySimple({ name, baseUrl, useEditParams = useDefaultEditParams, useFetch = useDefaultFetch }) {
    const pluralizedName = `${name}s`;
    const capitiledName = capitalizeFirstLetter(name);
    const getListApi = (_fetch, editUrl, params) => __awaiter(this, void 0, void 0, function* () {
        return yield _fetch(editUrl({
            baseUrl: `${baseUrl}/${pluralizedName}`,
            name,
            type: "GET",
            params,
        }), {
            method: "GET",
        });
    });
    const getApi = (id, _fetch, editUrl, params) => __awaiter(this, void 0, void 0, function* () {
        return yield _fetch(editUrl({
            baseUrl: `${baseUrl}/${pluralizedName}/${id}`,
            name,
            type: "GET",
            id,
            params,
        }), {
            method: "GET",
        });
    });
    const createApi = (data, _fetch, editUrl, params) => __awaiter(this, void 0, void 0, function* () {
        return yield _fetch(editUrl({
            baseUrl: `${baseUrl}/${pluralizedName}`,
            name,
            type: "POST",
            params,
        }), {
            method: "POST",
            body: JSON.stringify(data),
        });
    });
    const updateApi = (data, _fetch, editUrl, params) => __awaiter(this, void 0, void 0, function* () {
        return yield _fetch(editUrl({
            baseUrl: `${baseUrl}/${pluralizedName}/${data.id}`,
            name,
            type: "PUT",
            id: data.id,
            params,
        }), {
            method: "PUT",
            body: JSON.stringify(data),
        });
    });
    const deleteApi = (id, _fetch, editUrl, params) => __awaiter(this, void 0, void 0, function* () {
        return yield _fetch(editUrl({
            baseUrl: `${baseUrl}/${pluralizedName}/${id}`,
            name,
            type: "DELETE",
            id,
            params,
        }), {
            method: "DELETE",
        });
    });
    function useGetListQuery(options, queryClient) {
        const _fetch = useFetch();
        const { editUrl, keyParams } = useEditParams();
        return (0, react_query_1.useQuery)(Object.assign({ queryKey: [name, { type: "list" }, keyParams], queryFn: () => __awaiter(this, void 0, void 0, function* () { return getListApi(_fetch, editUrl, keyParams); }) }, options), queryClient);
    }
    function useGetQuery(id, options, queryClient) {
        const _fetch = useFetch();
        const { editUrl, keyParams } = useEditParams();
        return (0, react_query_1.useQuery)(Object.assign({ queryKey: [name, { id }, keyParams], queryFn: () => __awaiter(this, void 0, void 0, function* () { return getApi(id, _fetch, editUrl, keyParams); }) }, options), queryClient);
    }
    function useCreateMutation(options, _queryClient) {
        const _fetch = useFetch();
        const queryClient = (0, react_query_1.useQueryClient)();
        const { editUrl, keyParams } = useEditParams();
        return (0, react_query_1.useMutation)(Object.assign({ mutationFn: ((data) => __awaiter(this, void 0, void 0, function* () { return createApi(data, _fetch, editUrl, keyParams); })), onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
            } }, options), _queryClient);
    }
    function useUpdateMutation(options, _queryClient) {
        const _fetch = useFetch();
        const queryClient = (0, react_query_1.useQueryClient)();
        const { editUrl, keyParams } = useEditParams();
        return (0, react_query_1.useMutation)(Object.assign({ mutationFn: ((data) => __awaiter(this, void 0, void 0, function* () { return updateApi(data, _fetch, editUrl, keyParams); })), onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
            } }, options), _queryClient);
    }
    function useDeleteMutation(options, _queryClient) {
        const _fetch = useFetch();
        const queryClient = (0, react_query_1.useQueryClient)();
        const { editUrl, keyParams } = useEditParams();
        return (0, react_query_1.useMutation)(Object.assign({ mutationFn: ((data) => __awaiter(this, void 0, void 0, function* () { return deleteApi(data, _fetch, editUrl, keyParams); })), onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [name, { type: "list" }, keyParams] });
            } }, options), _queryClient);
    }
    return {
        [`useGet${capitiledName}sQuery`]: useGetListQuery,
        [`useGet${capitiledName}Query`]: useGetQuery,
        [`useCreate${capitiledName}Mutation`]: useCreateMutation,
        [`useUpdate${capitiledName}Mutation`]: useUpdateMutation,
        [`useDelete${capitiledName}Mutation`]: useDeleteMutation,
    };
}
exports.reactQuerySimple = reactQuerySimple;
