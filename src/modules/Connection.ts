import axios from 'axios'
import { Snapshot } from '../types/Types';

const { REACT_APP_MAP_URL }: NodeJS.ProcessEnv = process.env;

export interface AxiosResponse {
    data: {
        data: {
            count: number;
            rows: Snapshot[]
        }
    }
}

export const Connection = axios.create({
    baseURL: `${REACT_APP_MAP_URL}`
});