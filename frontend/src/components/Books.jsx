import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { ALL_BOOKS, ALL_GENRES } from "../queries";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const genreResult = useQuery(ALL_GENRES, { fetchPolicy: "no-cache" });
  const bookResult = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    fetchPolicy: "no-cache",
  });

  if (!props.show) {
    return null;
  }

  if (genreResult.loading || bookResult.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>

      <div>
        {genreResult.data.allGenres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all</button>
      </div>

      <p>
        genre: <b>{selectedGenre || "all"}</b>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookResult.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
