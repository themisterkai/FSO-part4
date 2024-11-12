const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const userId = request.user._id.toString();
  const user = await User.findById(userId);
  if (user == null) {
    return response.status(401).json({
      error: 'unauthorized',
    });
  }
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  });
  return response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const userId = request.user._id.toString();
  const user = await User.findById(userId);
  if (user == null) {
    return response.status(401).json({
      error: 'unauthorized',
    });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: userId,
  });

  const savedBlog = await blog.save();
  const savedBlogWithUser = await Blog.findById(savedBlog.id).populate('user', {
    username: 1,
    name: 1,
  });
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();
  return response.status(201).json(savedBlogWithUser);
});

blogsRouter.delete('/:id', async (request, response) => {
  const body = request.body;
  const userId = request.user._id.toString();
  const user = await User.findById(userId);
  if (user == null) {
    return response.status(401).json({
      error: 'unauthorized',
    });
  }

  const blogToDelete = await Blog.findById(request.params.id);
  // we will only allow deletion if the blog was added by the same user that is
  // making the requests.
  // Some blogs may not have a user field. We also won't allow deletion of these.
  if (blogToDelete.user == null || blogToDelete.user.toString() !== userId) {
    return response.status(401).json({
      error: 'unauthorized',
    });
  }

  await Blog.findByIdAndDelete(request.params.id);
  return response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const userId = request.user._id.toString();
  const user = await User.findById(userId);
  if (user == null) {
    return response.status(401).json({
      error: 'unauthorized',
    });
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  const userFromBody = await User.findById(body.user);
  if (user == null) {
    blog.user = userFromBody;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  }).populate('user', {
    username: 1,
    name: 1,
  });

  return response.json(updatedBlog);
});

module.exports = blogsRouter;
