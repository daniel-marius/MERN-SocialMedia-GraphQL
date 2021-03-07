import React from "react";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

import App from "./App";

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
  credentials: "same-origin"
  // headers: {
  //   cookie: req.header('Cookie')
  // }
});
const persistedQueryLink = createPersistedQueryLink();
const link = persistedQueryLink.concat(httpLink);

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  ssrMode: true,
  cache: new InMemoryCache(),
  link: authLink.concat(link)
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
