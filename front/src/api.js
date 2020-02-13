import axios from 'axios';

export function getJornalData() {
    return axios.get('http://localhost:5000/jornal-datas');
}