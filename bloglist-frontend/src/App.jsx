import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Login from './components/Login';
import AddBlog from './components/AddBlog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginServices from './services/login';
import Togglable from './components/Toggable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setURL] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const blogsFormRef = useRef();

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const userFromLS = JSON.parse(loggedInUser);
      setUser(userFromLS);
      blogService.setToken(userFromLS.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, [user, blogs]);

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const userFromLogin = await loginServices.login({
        username,
        password,
      });
      setUser(userFromLogin);
      window.localStorage.setItem(
        'loggedInUser',
        JSON.stringify(userFromLogin)
      );
      blogService.setToken(userFromLogin.token);
      setUsername('');
      setPassword('');
      handleMessage(`${userFromLogin.name} successfully logged in`);
    } catch (e) {
      handleErrorMessage(e.response.data.error);
    }
  };

  const handleMessage = message => {
    setMessage(message);
    setIsError(false);
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const handleErrorMessage = message => {
    setMessage(message);
    setIsError(true);
    setTimeout(() => {
      setMessage('');
      setIsError(false);
    }, 5000);
  };

  const handleAdd = async event => {
    event.preventDefault();
    try {
      const newBlog = await blogService.create({
        author,
        title,
        url,
      });
      blogsFormRef.current.toggleVisibility();
      setBlogs([...blogs, newBlog]);
      setTitle('');
      setAuthor('');
      setURL('');
      handleMessage(`a new blog ${title} by ${author} added`);
    } catch (e) {
      handleErrorMessage(e.response.data.error);
    }
  };

  const handleLogout = async event => {
    event.preventDefault();
    handleMessage(`${user.name} logged out successfully`);
    setUser(null);
    window.localStorage.clear();
  };

  return (
    <div>
      {message !== '' && <Notification message={message} isError={isError} />}
      {user == null && (
        <Login
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}
      {user != null && (
        <div>
          <div>{user.name} logged in</div>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="create" ref={blogsFormRef}>
            <AddBlog
              title={title}
              setTitle={setTitle}
              author={author}
              setAuthor={setAuthor}
              url={url}
              setURL={setURL}
              handleAdd={handleAdd}
            />
          </Togglable>
          <h2>blogs</h2>
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
