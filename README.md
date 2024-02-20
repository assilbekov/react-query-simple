# Reduce React API Boilerplate Code

This npm package provides a streamlined way to interact with your React components and API layer, significantly reducing the amount of boilerplate code required in your applications. Utilizing a series of hooks and utilities, you can easily manage API calls and state management in a more concise and readable manner.

## Features
- **Reduced Boilerplate**: Automate repetitive tasks related to API calls, focusing on your application logic instead.
- **Flexibility: Change**: Change the configuration as needed to match your API structure and requirements.
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

### Fetching Data

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