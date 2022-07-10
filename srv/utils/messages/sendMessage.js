const MessageTypeHandler = require('./MessageTypeHandler');

module.exports = function(params) {
    // TODO: validate parameters
    const { type, parts, message, ...properties } = params;
    const i18n = this.getTextBundle();
    const text = i18n.getText(message, parts) || message;
    const handler = MessageTypeHandler[type];

    return this[handler](Object.assign(properties, { message: text }));
};