import axios from 'axios'

/*
const ip = window.location.host;
console.log(ip)
*/

//DESKTOP-BBB6GQC, 192.168.0.18 192.168.43.125, iotgas
const baseUrl = 'http://localhost:3010/meso'

const createOne = (newObject) => {
    const request = axios.post(`${baseUrl}/create`, newObject);
    return request.then(response => response.data);
}

const readAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
}

const readLast = () => {
    const request = axios.get(`${baseUrl}/last`); 
    console.log('ReactServices-readlast: /last');
    return request.then(response => response.data)
}

const readGasLast = (id) => {
    console.log('ReactServices-readGaslast: /gaslast/' + id);
    const request = axios.get(`${baseUrl}/gaslast/${id}`); 
    //console.log('ReactServices: readGaslast done ');
    return request.then(response => response.data)
}

const readGasFirst = (id) => {
    console.log('ReactServices-readGasFirst: /gasfirst/' + id);
    const request = axios.get(`${baseUrl}/gasfirst/${id}`); 
    //console.log('ReactServices: readGasFirst done ');
    return request.then(response => response.data)
}

const readLastvalues = () => {
    console.log('ReactServices-readLastvalues: /lastvalues/' );
    const request = axios.get(`${baseUrl}/lastvalues`); 
    return request.then(response => response.data)
}

const readGasnames = () => {
    // meso_getgases_distinct 
    const request = axios.get(`${baseUrl}/gasnames`); 
    console.log('ReactServices-readGasnames: /gasnames');
    return request.then(response => response.data)
}

const readGasvaluesX = (id, mesos) => {
    //  /gases/:id/:mesos'
    const request = axios.get(`${baseUrl}/gasvalues/${id}/${mesos}`); 
    console.log(`ReactServices-readGasvaluesX: /gasvalues/${id}/${mesos} (time & gas values)`);
    return request.then(response => response.data);
}

const gasvaluesinterval = (id, ibegin, iend) => {
    //  /gases/:id/:begin/:end'
    const request = axios.get(`${baseUrl}/gasvaluesinterval/${id}/${ibegin}/${iend}`); 
    console.log(`ReactServices-gasvaluesinterval: /gasvalues/${id}/${ibegin}/${iend} (inteval of gas values)`);
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
    console.log('ReactServices destroyOne: /delete/' + id);
    return request.then(response => response.data);
}

export default { 
    readAll, readLast, readGasFirst, readGasvaluesX, readGasLast, 
    readGasnames, readLastvalues,  gasvaluesinterval, 
    createOne, readOne, updateOne, destroyOne 
} 
