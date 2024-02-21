# `react-query-simple` README.md

## Introduction

`react-query-simple` is a lightweight npm package designed to streamline the process of working with the API layer in React applications. This package addresses the common challenge of writing repetitive boilerplate code and managing concerns such as caching, requesting, and accessing data. Leveraging the power of React Query, react-query-simple simplifies the development experience by providing a set of ready-to-use hooks generated from a single function call.

## Features
- **Reduced Boilerplate**: Automate repetitive tasks related to API calls, focusing on your application logic instead.
- **Flexibility**: Change the configuration as needed to match your API structure and requirements.
- **Easy Cache Invalidation**: With structured and predictable query keys, invalidating the cache becomes straightforward.

## Installation

```
npm install react-query-simple
```

## Usage

Get ready to use React Query hooks to cover all your needs:

```
import { simpleReactQuery } from 'react-query-simple';

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = simpleReactQuery({
  name: "product",
  baseUrl: "https://dummyjson.com",
});
```

And use it in your React components:

```
const { isPending, isLoading, isFetching, isError, error, data } = useGetProductsQuery();
const { data, error, isFetching } = useGetProductQuery(productId);
const createMutation = useCreateProductMutation();
const updateMutation = useUpdateProductMutation();
const deleteMutation = useDeleteProductMutation();
```

This is a basic usage. For more advanced cases you could modify generated hooks.

### Editing URL Parameters

Modify API request URLs on the fly using `useEditParams`. This hook allows you to append base URLs to your endpoints dynamically.
```
const useEditParams: UseEditParams = () => {
  const { params } = useParamsContext();

  return {
    editUrl: (url: EditUrlArg) => "https://dummyjson.com" + url.baseUrl,
    keyParams: params,
  };
}
```

### Custom Fetching Data

```
const useFetch: UseFetch = () => {
  const {token} = useAuth();
  return async function (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
    const authOptions = {
      ...init,
      headers: {
        ...init?.headers,
        'Authorization': `Bearer ${token}`,
      },
    };
    return fetch(input, authOptions);
  };
}
```

### Use modified factory

Just provide `simpleReactQuery` with a custom URL editor and modified `fetch`.

```
export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = simpleReactQuery<Post, "post", ListPostsResponse>({
  name: "post",
  baseUrl: "",
  useEditParams,
  useFetch,
});
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue if you have suggestions for improvements or have identified bugs.

## License
MIT License - [Askhat Assilbekov](https://github.com/assilbekov)