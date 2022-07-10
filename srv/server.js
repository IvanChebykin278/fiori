"use strict";

const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
const { utils } = require('./utils');

cds.on("bootstrap", app => {
    app.get('/ping', function (req, res) {
        res.send('OK');
    });
    app.use(proxy());
});


cds.once('served', (services) => {
    services.PageBuilder.useRequest(utils());
});

module.exports = cds.server;