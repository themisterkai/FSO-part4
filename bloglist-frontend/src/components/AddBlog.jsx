import { useState } from 'react';
import PropTypes from 'prop-types';

const AddBlog = ({ handleAdd }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setURL] = useState('');
  const handleSubmit = event => {
    event.preventDefault();
    handleAdd({
      title,
      url,
      author,
    });
    setTitle('');
    setAuthor('');
    setURL('');
  };
  return (
    <>
      <h2>add new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title
          <input
            type="text"
            value={title}
            name="Title"
            id="title-input"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            name="Author"
            id="author-input"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            name="URL"
            id="url-input"
            onChange={({ target }) => setURL(target.value)}
          />
        </div>
        <button type="submit" id="submit-blog-button">
          create
        </button>
      </form>
    </>
  );
};

export default AddBlog;

AddBlog.displayName = 'AddBlog';
AddBlog.propTypes = {
  handleAdd: PropTypes.func.isRequired,
};