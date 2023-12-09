import axios from "axios"
import { organization } from "../zincoApi"

const createAccount = async function(body) {
    const { data } = await axios.post('v1/accounts/create-account/', {
        organization,
        as_on_date: new Date().toJSON().slice(0, 10),
        country: "",
        ...body
    })
    return data
} 

const detailsAccount = async function(body) {
    const { data } = await axios.post('v1/accounts/details-account/', {
        organization,
        ...body
    })
    return data
} 

const updateAccount = async function(body) {
    const { data } = await axios.post('v1/accounts/update-account/', {
        organization,
        as_on_date: new Date().toJSON().slice(0, 10),
        ...body
    })
    return data
} 

const deleteAccount = async function(body) {
    const { data } = await axios.post('v1/accounts/delete-account/', {
        organization,
        ...body
    })
    return data
} 

const listAccount = async function(body) {
    const { data } = await axios.post('v1/accounts/list-account/', {
        organization,
        ...body,
    })
    return data
} 
 

export {
    createAccount,
    deleteAccount,
    detailsAccount,
    updateAccount,
    listAccount,
}