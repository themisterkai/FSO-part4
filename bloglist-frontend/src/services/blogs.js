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

const update = async (id, blogObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, blogObject, getConfig());
  return response.data;
};

const remove = async id => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig());
  return response.data;
};

export default { getAll, create, update, remove, setToken };
