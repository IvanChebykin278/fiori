const validateChanges = require('./validation/validateChanges');
const ValidateActionsStrategy = require('./validation/strategies/ValidateActionsStrategy');
const sendMessage = require('./messages/sendMessage');

module.exports = (function() {
    let instance = null;

    const getInstance = () => {
        if(!instance) {
            instance = {
                validateChanges,
                ValidateActionsStrategy,
                sendMessage
            };
        }

        return instance;
    };

    const useUtils = () => {
        return (req, res, next) => {
            cds.context = cds.context ? cds.context : {};
            cds.context.utils = cds.context.utils ? cds.context.utils : {};
            cds.context.utils.sendMessage = sendMessage;
            cds.context.utils.validateChanges = validateChanges;

            next();
        }
    }

    return {
        getInstance: getInstance,
        useUtils: useUtils
    }
})();