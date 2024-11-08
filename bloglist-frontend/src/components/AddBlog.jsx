const AddBlog = ({
  title,
  setTitle,
  author,
  setAuthor,
  url,
  setURL,
  handleAdd,
}) => (
  <>
    <h2>add new blog</h2>
    <form onSubmit={handleAdd}>
      <div>
        title
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={url}
          name="URL"
          onChange={({ target }) => setURL(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  </>
);

export default AddBlog;
