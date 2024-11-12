import { useState } from 'react';
const Blog = ({ blog, handleLikes, handleRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleSetIsVisible = event => {
    event.preventDefault();
    setIsVisible(!isVisible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const addLike = () => {
    const blogObject = {
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };
    if (blog.user != null) {
      blogObject.user = blog.user.id;
    }
    handleLikes(blog.id, blogObject);
  };

  const confirmDelete = () => {
    const userConfirmed = confirm(
      `Are you sure you want to delete ${blog.title} by ${blog.author}?`
    );
    if (userConfirmed) {
      handleRemove(blog);
    }
  };

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={handleSetIsVisible}>
          {isVisible ? 'hide' : 'view'}
        </button>
      </div>
      {isVisible && (
        <>
          <div>{blog.url}</div>
          <div>
            {blog.likes} <button onClick={addLike}>like</button>
          </div>
          {blog.user && <div>{blog.user.name}</div>}
          <div>
            <button onClick={confirmDelete}>remove</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Blog;
