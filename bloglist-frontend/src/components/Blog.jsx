import { useState } from 'react';
const Blog = ({ blog }) => {
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
          <div>{blog.likes}</div>
          {blog.user && <div>{blog.user.name}</div>}
        </>
      )}
    </div>
  );
};

export default Blog;
