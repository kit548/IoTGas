import axios from 'axios'

const ip = window.location.host;
console.log(ip)

//DESKTOP-BBB6GQC, 192.168.0.18 192.168.43.125, iotgas
const baseUrl = 'http://192.168.0.18:3010/meso'

const createOne = (newObject) => {
    const request = axios.post(`${baseUrl}/create`, newObject);
    return request.then(response => response.data);
}

const readAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
}

const readLast100 = () => {
    const request = axios.get(`${baseUrl}/last100`); 
    console.log('ReactServices: last100');
    return request.then(response => response.data);
}

const readLast = () => {
    const request = axios.get(`${baseUrl}/last`); 
    console.log('ReactServices: readlast');
    return request.then(response => response.data)
}

const readGasLast = (id) => {
    // /last/:gasname -> meso_getgasxlast_get
    console.log('ReactServices: readGaslast ' + id);
    const request = axios.get(`${baseUrl}/gaslast/${id}`); 
    console.log('ReactServices: readGaslast done ');
    return request.then(response => response.data)
}

const readGasnames = () => {
    // meso_getgases_distinct 
    const request = axios.get(`${baseUrl}/gasenames`); 
    console.log('ReactServices: gasenames');
    return request.then(response => response.data)
}

const readGasvaluesX = (id, mesos) => {
    //  /gases/:id/:mesos'
    const request = axios.get(`${baseUrl}/gasvalues/${id}/${mesos}`); 
    console.log(`ReactServices: X gases ${id} ${mesos} time & gas values`);
    return request.then(response => response.data);
}

const readOne = (id) => {
    // by /id
    const request = axios.get(`${baseUrl}/${id}`);
    return request.then(response => response.data);
}

const updateOne = (id, updatedObject) => {
    // /update/id 
    //console.log('UpdateOne: ' + id)
    const request = axios.put(`${baseUrl}/update/${id}`, updatedObject);
    return request.then(response => response.data);
}

const destroyOne = (id) => {
    const request = axios.delete(`${baseUrl}/delete/${id}`);
    console.log('ReactServices del: ' + id);
    return request.then(response => response.data);
}

export default { 
    readAll, readLast, readLast100, readGasvaluesX, 
    readGasLast, readGasnames, createOne, readOne, updateOne, destroyOne 
} 
