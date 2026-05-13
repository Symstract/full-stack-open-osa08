import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const AuthorAgeForm = ({ authors, onUpdate }) => {
  const [name, setName] = useState(authors[0].name);
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onCompleted: () => onUpdate(),
  });

  const submit = async (event) => {
    event.preventDefault();

    editAuthor({ variables: { name, setBornTo: +born } });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select
            name="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="born">born</label>

          <input
            id="born"
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button name="update author" type="submit">
          Update author
        </button>
      </form>
    </div>
  );
};

export default AuthorAgeForm;
