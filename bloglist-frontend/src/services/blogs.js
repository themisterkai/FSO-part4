import axios from 'axios';
const baseUrl = '/api/blogs';

let token = '';

const getConfig = () => ({
  headers: { Authorization: token },
});

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig());
  return response.data;
};

const create = async blogObject => {
  const response = await axios.post(baseUrl, blogObject, getConfig());
  return response.data;
};

export default { getAll, create, setToken };
