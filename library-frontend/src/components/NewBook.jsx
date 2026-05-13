import { useState } from "react";
import { useMutation } from "@apollo/client/react";

import { ALL_AUTHORS, ALL_BOOKS, ALL_GENRES, CREATE_BOOK } from "../queries";
import { addBookToApolloCache } from "../utils";

const NewBook = ({ show, onAddition }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    // Re-fetching doesn't seem to work reliably?
    // https://github.com/apollographql/apollo-client/issues/5419
    refetchQueries: [
      { query: ALL_BOOKS },
      { query: ALL_AUTHORS },
      { query: ALL_GENRES },
    ],
    update: (cache, response) => {
      addBookToApolloCache(cache, ALL_BOOKS, response.data.addBook);
    },
    onCompleted: () => onAddition(),
  });

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    createBook({ variables: { title, author, published: +published, genres } });
    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">title</label>
          <input
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor="published">published</label>
          <input
            id="published"
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <label htmlFor="genre">genre</label>
          <input
            id="genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button name="add genre" onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
