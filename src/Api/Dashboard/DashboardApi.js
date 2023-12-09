import axios from "axios"
import { organization } from "../zincoApi"

const dashboardDetails = async function(body) {
    const { data } = await axios.post('v1/dashboard/details-dashboard/', {
        organization
    })

    return data
}

export {
    dashboardDetails
}