const request = require('request');


//TODO find a better crypto api with more cryptocurrencies
const COINDESK_API_URL = 'https://api.coindesk.com/v1/bpi/currentprice.json';

const getCoinPrice = async (coin) => {
    return new Promise((resolve, reject) => {
        request(COINDESK_API_URL, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
};


module.exports = {getCoinPrice};