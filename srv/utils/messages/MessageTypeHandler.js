const MessageType = require('./MessageType');

module.exports = {
    [MessageType.Error]: 'error',
    [MessageType.Success]: 'notify',
    [MessageType.Warning]: 'warn',
    [MessageType.Info]: 'info'
}