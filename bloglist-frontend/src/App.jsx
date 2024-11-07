import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Login from './components/Login';
import AddBlog from './components/AddBlog';
import blogService from './services/blogs';
import loginServices from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setURL] = useState('');

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
    console.log(username, password);

    try {
      const userFromLogin = await loginServices.login({
        username,
        password,
      });
      setUser(userFromLogin);
      console.log(userFromLogin);
      window.localStorage.setItem(
        'loggedInUser',
        JSON.stringify(userFromLogin)
      );
      blogService.setToken(userFromLogin.token);
      setUsername('');
      setPassword('');
    } catch (e) {
      console.log('error', e);
    }
  };

  const handleAdd = async event => {
    event.preventDefault();
    try {
      const newBlog = await blogService.create({
        author,
        title,
        url,
      });
      setBlogs([...blogs, newBlog]);
      setTitle('');
      setAuthor('');
      setURL('');
    } catch (e) {}
  };

  const handleLogout = async event => {
    event.preventDefault();
    setUser(null);
  };

  return (
    <div>
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
          <AddBlog
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            url={url}
            setURL={setURL}
            handleAdd={handleAdd}
          />
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
