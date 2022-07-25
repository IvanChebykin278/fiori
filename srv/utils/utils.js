const validateChanges = require('./validation/validateChanges');
const ValidateActionsStrategy = require('./validation/strategies/ValidateActionsStrategy');
const sendMessage = require('./messages/sendMessage');
const MessageType = require('./messages/MessageType');
const MessageTypeHandler = require('./messages/MessageTypeHandler');
const BaseStrategy = require('./validation/strategies/BaseStrategy');

module.exports = {
    messages: {
        MessageType,
        MessageTypeHandler,
        sendMessage
    },
    validation: {
        strategies: {
            BaseStrategy,
            ValidateActionsStrategy
        },
        validateChanges
    }
};