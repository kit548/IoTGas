import axios from 'axios'

const ip = window.location.host;
console.log(ip)

//DESKTOP-BBB6GQC, 192.168.0.18
const baseUrl = 'http://localhost:3010/meso'

const createOne = (newObject) => {
    // http://localhost:port/default
    const request = axios.post(`${baseUrl}/create`, newObject);
    return request.then(response => response.data);
}

const readAll = () => {
    // http://localhost:port/default
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
}

const readLast100 = () => {
    // http://localhost:port/default
    const request = axios.get(`${baseUrl}/last100`); 
    console.log('ReactServices: last100');
    return request.then(response => response.data);
}

const readLast = () => {
    // http://localhost:port/default
    const request = axios.get(`${baseUrl}/last`); 
    console.log('ReactServices: readlast');
    return request.then(response => response.data)
}

const readGasLast = (id) => {
    // http://localhost:port/default  /last/:gasname, meso_getgasxlast_get
    console.log('ReactServices: readGaslast ' + id);
    const request = axios.get(`${baseUrl}/gaslast/${id}`); 
    console.log('ReactServices: readGaslast done ');
    return request.then(response => response.data)
}

const readGasnames = () => {
    // http://localhost:port/default  <- meso_getgases_distinct 
    const request = axios.get(`${baseUrl}/gasenames`); 
    console.log('ReactServices: gasenames');
    return request.then(response => response.data)
}

const readGasvalueslast100 = (id) => {
    // http://localhost:port/default
    const request = axios.get(`${baseUrl}/gasvalueslast100/${id}`); 
    console.log(`ReactServices: last 100 ${id} time & gas values`);
    return request.then(response => response.data);
}

const readGasvaluesX = (id, mesos) => {
    // http://localhost:port/default  //gases/:id/mesos/:mesos'
    const request = axios.get(`${baseUrl}/gasvalues/${id}/${mesos}`); 
    console.log(`ReactServices: X gases ${id} ${mesos} time & gas values`);
    return request.then(response => response.data);
}

const readOne = (id) => {
    // http://localhost:port/default/id
    const request = axios.get(`${baseUrl}/${id}`);
    return request.then(response => response.data);
}

const updateOne = (id, updatedObject) => {
    // http://localhost:port/default/id 
    //console.log('UpdateOne: ' + id)
    const request = axios.put(`${baseUrl}/update/${id}`, updatedObject);
    return request.then(response => response.data);
}

const destroyOne = (id) => {
    // http://localhost:port/default/id
    const request = axios.delete(`${baseUrl}/delete/${id}`);
    console.log('ReactServices del: ' + id);
    return request.then(response => response.data);
}

export default { 
    readAll, readLast, readLast100, readGasvalueslast100, readGasvaluesX, 
    readGasLast, readGasnames, createOne, readOne, updateOne, destroyOne 
} 
