import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const isServer = typeof window === 'undefined'; // Kiểm tra nếu đang chạy trên server

const httpLink = new HttpLink({
  uri: 'https://beta.pokeapi.co/graphql/v1beta', // Endpoint GraphQL của PokeAPI
  credentials: 'same-origin', // Đảm bảo gửi cookie khi gọi API từ server
});

const client = new ApolloClient({
  ssrMode: isServer, // Kích hoạt chế độ SSR nếu chạy trên server
  link: httpLink, // Sử dụng HttpLink đã cấu hình
  cache: new InMemoryCache(), // Bộ nhớ cache Apollo
});

export default client;
