export const addBookToApolloCache = (cache, query, addedBook) => {
  console.log(addedBook.genres);

  const genres = [...addedBook.genres, null];
  const queryPerGenre = genres.map((genre) => {
    return {
      query,
      variables: { genre },
    };
  });

  queryPerGenre.forEach((query) => {
    const uniqByName = (a) => {
      let seen = new Set();

      return a.filter((item) => {
        let k = item.id;
        return seen.has(k) ? false : seen.add(k);
      });
    };

    cache.updateQuery(query, (data) => {
      if (!data) {
        return;
      }

      return {
        allBooks: uniqByName(data.allBooks.concat(addedBook)),
      };
    });
  });
};
