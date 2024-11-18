import { render, screen } from '@testing-library/react';
import AddBlog from './AddBlog';
import userEvent from '@testing-library/user-event';

test('<AddBlog /> updates parent state and calls handleAdd', async () => {
  const handleAdd = vi.fn();
  const user = userEvent.setup();

  const { container } = render(<AddBlog handleAdd={handleAdd} />);

  const title = container.querySelector('#title-input');
  const author = container.querySelector('#author-input');
  const url = container.querySelector('#url-input');
  const submitButton = container.querySelector('#submit-blog-button');

  await user.type(title, 'my blog');
  await user.type(author, 'haida');
  await user.type(url, 'www.url.com');
  await user.click(submitButton);

  expect(handleAdd.mock.calls).toHaveLength(1);
  expect(handleAdd.mock.calls[0][0].title).toBe('my blog');
  expect(handleAdd.mock.calls[0][0].author).toBe('haida');
  expect(handleAdd.mock.calls[0][0].url).toBe('www.url.com');
});
