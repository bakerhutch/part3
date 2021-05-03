import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => {
        console.log(response.data)
        return response.data
    })
}

const addEntry = (personObj) => {
    const request = axios.post(baseUrl, personObj)
    //console.log(`Added ${personObj.name} to JSON server`)
    return request.then(response => response.data)
}

const delEntry = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    //console.log('DelEntry')
    return request.then(response=>response.data)
}

const changeNumber = (personObj, newNumber) => {
    const newPerson = {...personObj, number: newNumber}
    //console.log('changeNumber', newPerson)
    const request = axios.put(`${baseUrl}/${personObj.id}`, newPerson)
    return request.then(response=>response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {getAll, addEntry, delEntry, changeNumber}