const cds = require("@sap/cds");

module.exports = (srv) => {
    srv.before(['DELETE', 'UPDATE'], '*', async (req) => {
        const deletedEntry = await SELECT.one().from(req.target.name).where({ ID: req.data.ID });

        if (deletedEntry.isReadOnly) {
            return req.error({
                code: 'ENTITY_IS_READ_ONLY',
                message: 'Entry is Read-Only',
                status: 409
            });
        }
    });

    srv.before(['CREATE','UPDATE'], 'Roles', async (req) => {
        const entry = await SELECT.one().from(req.target.name).where({ ID: req.data.ID });

        if(!req.data.ID) {
            return req.error({
                code: 'ROLE_IS_EMPTY',
                message: 'Name of Role can not be empty',
                target: 'ID',
                status: 400
            });
        }

        if(entry) {
            return req.error({
                code: 'ROLE_ALREADY_EXISTS',
                message: 'Role already exists',
                target: 'ID',
                status: 400
            });
        }
    });
};