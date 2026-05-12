import { useEffect, useState } from "react";
import {
  useApolloClient,
  useLazyQuery,
  useSubscription,
} from "@apollo/client/react";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { ALL_BOOKS, BOOK_ADDED, ME } from "./queries";
import RecommendedBooks from "./components/RecommendedBooks";
import { addBookToApolloCache } from "./utils";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );
  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  const [getCurrentUser, currentUser] = useLazyQuery(ME);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log("data received");

      const bookAdded = data.data.bookAdded;
      window.alert(`Added a book called ${bookAdded.title}`);
      addBookToApolloCache(client.cache, ALL_BOOKS, bookAdded);
    },
  });

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser, token]);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  const onLogin = () => {
    setPage("authors");
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <button onClick={() => setPage("recommendations")}>
            recommendations
          </button>
        )}
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={() => logout()}>logout</button>}
      </div>

      <Authors show={page === "authors"} showEditForm={!!token} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      {currentUser.data?.me && (
        <RecommendedBooks
          show={page === "recommendations"}
          favoriteGenre={currentUser.data.me.favoriteGenre}
        />
      )}
      <LoginForm
        show={page === "login"}
        setToken={setToken}
        onLogin={onLogin}
      />
    </div>
  );
};

export default App;
