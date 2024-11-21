import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders content when blogs are unexpanded', () => {
  const username = 'Kai';
  const blog = {
    title: 'My Blog',
    author: 'Haida',
    url: 'http://myurl.com',
    likes: 5,
    user: {
      name: 'Kai',
    },
  };

  const mockHandler = vi.fn();

  const { container } = render(
    <Blog
      blog={blog}
      handleLikes={mockHandler}
      handleRemove={mockHandler}
      username={username}
    />
  );

  const div = container.querySelector('.blog');
  expect(div).toHaveTextContent('My Blog');
  expect(div).toHaveTextContent('Haida');
  expect(div).not.toHaveTextContent('http://myurl.com');
  expect(div).not.toHaveTextContent(5);
});

test('renders content when blogs are expanded', async () => {
  const username = 'Kai';
  const blog = {
    title: 'My Blog',
    author: 'Haida',
    url: 'http://myurl.com',
    likes: 5,
    user: {
      name: 'Kai',
    },
  };

  const mockHandler = vi.fn();

  const { container } = render(
    <Blog
      blog={blog}
      handleLikes={mockHandler}
      handleRemove={mockHandler}
      username={username}
    />
  );

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  const div = container.querySelector('.blog');
  expect(div).toHaveTextContent('My Blog');
  expect(div).toHaveTextContent('Haida');
  expect(div).toHaveTextContent('http://myurl.com');
  expect(div).toHaveTextContent(5);
});

test('clicking like button calls event handler', async () => {
  const username = 'Kai';
  const blog = {
    title: 'My Blog',
    author: 'Haida',
    url: 'http://myurl.com',
    likes: 5,
    user: {
      name: 'Kai',
    },
  };

  const mockLikeHandler = vi.fn();
  const mockRemoveHandler = vi.fn();

  render(
    <Blog
      blog={blog}
      handleLikes={mockLikeHandler}
      handleRemove={mockRemoveHandler}
      username={username}
    />
  );

  const user = userEvent.setup();
  const expandButton = screen.getByText('view');
  await user.click(expandButton);

  const likeButton = screen.getByText('like');
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockLikeHandler.mock.calls).toHaveLength(2);
  expect(mockRemoveHandler.mock.calls).toHaveLength(0);
});
