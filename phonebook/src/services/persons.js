import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
    const req = axios.get(baseUrl);
    return req.then( resp => resp.data  );
}

const addNew = (newRecord) => {
    const req = axios.post(baseUrl, newRecord);
    return req.then ( resp => resp.data);
}

const update = (newRecord) => {
    const req = axios.put(`${baseUrl}/${newRecord.id}`, newRecord);
    return req.then ( resp => resp.data );
}

const del = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`);
    return req.then (resp => resp.data);
}
const personsServ = {getAll, addNew, update, del} 
export default personsServ;
