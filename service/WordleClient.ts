import axios from 'axios';
const urlGeyWords = 'https://challenge.trio.dev/api/v1/wordle-words';

export default class WordleClient {
    static fetchDailyWords = async () => {
        return await axios.get(urlGeyWords)
    }
}