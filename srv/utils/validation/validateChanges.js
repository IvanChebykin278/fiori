module.exports = async function(strategy) {
    const message = await strategy.execute(this.data);

    if(message) {
        this.utils.sendMessage(message);

        return false;
    }

    return true;
};