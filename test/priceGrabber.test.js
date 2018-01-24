const test = require('ava').test;
const priceGrabber = require('../src/priceGrabber');


test('get BTC price', async (t) => {
    const price = await priceGrabber.getCoinPrice('BTC');
    t.truthy(price.bpi.USD.rate);
    t.falsy(isNaN(price.bpi.USD.rate_float));
    console.log(`Current Bitcoin price ${price.bpi.USD.rate_float} USD`);
});