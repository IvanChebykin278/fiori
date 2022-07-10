"use strict";

const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
const { useUtils } = require('./utils/utils'); 

cds.on("bootstrap", app =>{ 
    app.get('/ping', function (req, res) {
        res.send('OK');
    });
    app.use(useUtils());
    app.use(proxy());
});

module.exports = cds.server;