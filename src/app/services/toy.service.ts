import axios from "axios"
import { ToyModel } from "../models/toy.model"

const client = axios.create({
    baseURL: 'https://toy.pequla.com/api',
    headers: {
        'Accept': 'application/json',
        'X-Name': 'KVA_2026/dev'
    },
    validateStatus(status) {
        return status === 200
    }
})
export class ToyService {
    static async getToys(){
        return await client.get<ToyModel[]>('/toy')
    }

    static async getToyById(id:number){
        return await client.get<ToyModel>('/toy/' + id)
    }
}