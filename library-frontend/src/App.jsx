import { useEffect, useState } from "react";
import {
  useApolloClient,
  useQuery,
  useSubscription,
} from "@apollo/client/react";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import LoginForm from "./components/LoginForm";
import { ALL_BOOKS, BOOK_ADDED, ME } from "./queries";
import RecommendedBooks from "./components/RecommendedBooks";
import { addBookToApolloCache } from "./utils";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token"),
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState("authors");
  const client = useApolloClient();
  const currentUser = useQuery(ME);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log("data received");

      const bookAdded = data.data.bookAdded;
      window.alert(`Added a book called ${bookAdded.title}`);
      addBookToApolloCache(client.cache, ALL_BOOKS, bookAdded);
    },
  });

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const onLogin = (token) => {
    localStorage.setItem("library-user-token", token);
    setToken(token);
    currentUser.refetch();
    setPage("authors");
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <button onClick={() => setPage("recommendations")}>recommend</button>
        )}
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={() => logout()}>logout</button>}
      </div>

      <Authors show={page === "authors"} showEditForm={!!token} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} onAddition={() => setPage("books")} />
      {currentUser.data?.me && (
        <RecommendedBooks
          show={page === "recommendations"}
          favoriteGenre={currentUser.data.me.favoriteGenre}
        />
      )}
      <LoginForm show={page === "login"} setError={notify} onLogin={onLogin} />
    </div>
  );
};

export default App;
