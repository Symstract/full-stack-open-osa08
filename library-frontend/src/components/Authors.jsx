import { useQuery } from "@apollo/client/react";
import { ALL_AUTHORS } from "../queries";
import AuthorAgeForm from "./AuthorAgeForm";

const Authors = ({ show, showEditForm }) => {
  const { loading, data } = useQuery(ALL_AUTHORS, { fetchPolicy: "no-cache" });

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showEditForm && <AuthorAgeForm authors={data.allAuthors} />}
    </div>
  );
};

export default Authors;
