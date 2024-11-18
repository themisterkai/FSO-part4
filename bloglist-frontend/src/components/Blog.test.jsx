import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders content when blogs are unexpanded', () => {
  const blog = {
    title: 'My Blog',
    author: 'Haida',
    url: 'http://myurl.com',
    likes: 5,
  };

  const mockHandler = vi.fn();

  const { container } = render(
    <Blog blog={blog} handleLikes={mockHandler} handleRemove={mockHandler} />
  );

  const div = container.querySelector('.blog');
  expect(div).toHaveTextContent('My Blog');
  expect(div).toHaveTextContent('Haida');
  expect(div).not.toHaveTextContent('http://myurl.com');
  expect(div).not.toHaveTextContent(5);
});

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'My Blog',
    author: 'Haida',
    url: 'http://myurl.com',
    likes: 5,
  };

  const mockHandler = vi.fn();

  const { container } = render(
    <Blog blog={blog} handleLikes={mockHandler} handleRemove={mockHandler} />
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
