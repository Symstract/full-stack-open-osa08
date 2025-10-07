import { useEffect, useState } from "react";
import { useApolloClient, useLazyQuery } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { ME } from "./queries";
import RecommendedBooks from "./components/RecommendedBooks";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  const [getCurrentUser, currentUser] = useLazyQuery(ME);

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
