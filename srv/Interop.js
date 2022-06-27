const cds = require("@sap/cds");

module.exports = (srv) => {
    srv.on('getUserInfo', async (req) => {
        return {
            ID: req.user.id,
            isAdmin: req.user.is('Administrator'),
            isUser: req.user.is('User'),
        }
    });
}