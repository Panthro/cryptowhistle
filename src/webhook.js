/*** ===== TELEGRAM FUNCTIONS  ========= ***/

const request = require('request');
const defaultMessages = [
    {
        "pattern": "/start",
        "message": "Welcome to CryptoWhistle, I can tell you the cryptocurrencies (currently only BTC) price. Would like to try it out? Just send me the /price command."
    },
    {
        "pattern": ".*",
        "message": "Sorry, I didn't understand that message."
    }
];

const TELEGRAM_BASE_URL = 'https://api.telegram.org/bot';

/**
 * Matches the given message with the message patterns available and send the matched message
 * @param token telegram token
 * @param chat the chat id
 * @param message the message to be matched
 */
const sendMatchedMessage = (token, chat, message) => {

    const firstMatchedMessage = defaultMessages.find((m) => new RegExp(m.pattern, "gi").test(message));
    sendTelegramMessage(token, chat, firstMatchedMessage.message);
}

/**
 * Sends the given message using the given token to the given chat id
 * @param token {string} the telegram bot token
 * @param chatId {string} the chatIt to send the message
 * @param message {string} the message to be sent
 */
//TODO support markdown formatting for messages
const sendTelegramMessage = (token, chatId, message) => {
    const baseUrl = `${TELEGRAM_BASE_URL}${token}`;
    request.post(`${baseUrl}/sendMessage`, {
        form: {
            chat_id: chatId,
            text: message
        }
    })
};

/*** ======== END TELEGRAM FUNCTIONS ========== ***/

/*** ======== Coins functions ======== ***/
//TODO find a better crypto api with more cryptocurrencies
const COINDESK_API_URL = 'https://api.coindesk.com/v1/bpi/currentprice.json';

const getCoinPrice = (coin) => {
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

/*** ========== Webtask Functions ======== ***/
/**
 * Checks if the required fields are set in the context
 * @param ctx the request context
 * @param cb the callback function to be used when returning error messages
 */
const checkContext = (ctx, cb) => {
    if (!ctx.data.token) {
        cb('Invalid telegram token');
    }
};

module.exports = (ctx, cb) => {

    checkContext(ctx, cb);
    //TODO stop the execution when the context is invalid to optimise resource usage

    const token = ctx.data.token;
    const chat = ctx.data.message.chat.id;
    const message = ctx.data.message.text;

    if (/\/price/gi.test(message)) {
        const coin = 'BTC'; //TODO extract coin from message, and support multiple coins
        getCoinPrice(coin).then((price) => {
            sendTelegramMessage(token, chat, `Current BTC price $${price.bpi.USD.rate_float}`);
        });
    } else {
        sendMatchedMessage(token, chat, message);
    }

    cb(null, {status: 'ok'});
};

