const sendMessage = require('../messages/sendMessage');

module.exports = async function (strategy) {
    const message = await strategy.execute(cds.context.data);

    if (message) {
        sendMessage(message);

        return false;
    }

    return true;
};