import axios from 'axios'
const baseUrl = 'http://localhost:1111/cats'

const createOne = (newObject) => {
    // http://localhost:1111/cats
    const request = axios.post(baseUrl, newObject);
    return request.then(response => response.data);
}

const readAll = () => {
    // http://localhost:1111/cats
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
}

const readOne = (id) => {
    // http://localhost:1111/cats/id
    const request = axios.get(`${baseUrl}/${id}`);
    return request.then(response => response.data);
}

const updateOne = (id, updatedObject) => {
    // http://localhost:1111/cats/id
    const request = axios.put(`${baseUrl}/${id}`, updatedObject);
    return request.then(response => response.data);
}

const destroyOne = (id) => {
    // http://localhost:1111/cats/id
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then(response => response.data);
}

export default { createOne, readAll, readOne, updateOne, destroyOne } 
