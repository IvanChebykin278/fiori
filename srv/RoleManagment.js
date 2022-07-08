const cds = require("@sap/cds");

module.exports = async (srv) => {
    const db = await cds.connect.to('db');
    const { Roles, RoleUser, RoleCatalog, RoleGroup } = db.entities();

    const messageFactory = (target, event) => {
        switch(true) {
            case target.indexOf('Roles') >= 0:
                return `Role was ${event.toLowerCase()}d successfully`;
            case target.indexOf('RoleUser') >= 0:
                return `User assignment in the role was ${event.toLowerCase()}d successfully`;
            case target.indexOf('RoleCatalog') >= 0:
                return `Catalog assignment in the role was ${event.toLowerCase()}d successfully`;
            case target.indexOf('RoleGroup') >= 0:
                return `User assignment in the role was ${event.toLowerCase()}d successfully`;
            default:
                return 'Event was performed successfully';
        }
    };

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

    srv.before(['CREATE', 'UPDATE'], 'RoleUser', async (req) => {
        
    });

    srv.before(['CREATE', 'UPDATE'], 'RoleCatalog', async (req) => {

    });

    srv.before(['CREATE', 'UPDATE'], 'RoleGroup', async (req) => {

    });

    srv.after(['CREATE','UPDATE','DELETE'], '*', (data, req) => {
        req.notify({
            code: 'SUCCESS',
            message: messageFactory(req.target.name, req.event),
            status: 200
        });
    });
};