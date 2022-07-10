const cds = require("@sap/cds");

module.exports = async (srv) => {
    const db = await cds.connect.to('db');
    const { Actions, Catalogs, Groups, SemanticObjects, TargetMappings, Tiles, CatalogTile } = db.entities();

    const messageFactory = (target, event) => {
        switch(true) {
            case target.indexOf('Actions') >= 0:
                return `Actions was ${event.toLowerCase()}d successfully`;
            case target.indexOf('SemanticObjects') >= 0:
                return `Semantic objects was ${event.toLowerCase()}d successfully`;
            default:
                return 'Event was performed successfully';
        }
    };

    srv.on('getActionControl', async req => {
        const { catalogId, tileId } = req.data;
        const catalog = await SELECT.one().from(Catalogs).where({ ID: catalogId });
        const tile = await SELECT.one().from(Tiles).where({ ID: tileId });
        const catalogTile  = await SELECT.one().from(CatalogTile).where({ catalogId, tileId });

        if(!catalog) {
            return req.reject(400, `Catalog ${catalogId} was not found`);
        }

        if(!tile) {
            return {
                ac_Configure : false,
                ac_CreateTile : !catalog.isReadOnly,
                ac_Original : false,
                ac_Delete : false,
                ac_CreateReference : false,
            }
        }

        if(catalogTile) {
            return {
                ac_Configure : !tile.isReadOnly && !catalogTile.isReferense,
                ac_CreateTile : !catalog.isReadOnly,
                ac_Original : catalogTile.isReferense,
                ac_Delete : !tile.isReadOnly,
                ac_CreateReference : !catalogTile.isReferense,
            }
        }

        return req.reject(400, `Tile with ID ${tileId} didn't assigned to Catalog ${catalogId}`);
    });

    // srv.before('READ', '*', req => {
    //     req.utils.sendMessage();
    // });

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

    srv.before(['CREATE','UPDATE'], 'Actions', async (req) => {
        const entry = await SELECT.one().from(Actions).where({ action: req.data.action });

        if(!req.data.action) {
            return req.error({
                code: 'ACTION_IS_EMPTY',
                message: 'Name of Action can not be empty',
                target: 'action',
                status: 400
            });
        }

        if(entry) {
            return req.error({
                code: 'ACTION_ALREADY_EXISTS',
                message: 'Action already exists',
                target: 'action',
                status: 400
            });
        }
    });

    srv.before(['CREATE','UPDATE'], 'SemanticObjects', async (req) => {
        const entry = await SELECT.one().from(SemanticObjects).where({ semanticObject: req.data.semanticObject });

        if(!req.data.semanticObject) {
            return req.error({
                code: 'SEMANTIC_OBJECT_IS_EMPTY',
                message: 'Name of Semantic object can not be empty',
                target: 'semanticObject',
                status: 400
            });
        }

        if(entry) {
            return req.error({
                code: 'SEMANTIC_ALREADY_EXISTS',
                message: 'Semantic object already exists',
                target: 'semanticObject',
                status: 400
            });
        }
    });

    srv.on('DELETE', ['Actions', 'SemanticObjects'], async (req) => {
        const entry = await SELECT.one().from(req.target.name).where(req.data);
        const { ID, createdAt, createdBy, modifiedAt, modifiedBy, isReadOnly, ...data } = entry;
        const targetMapping = await SELECT.one().from(TargetMappings).where(data);

        if (targetMapping) {
            return req.error({
                code: 'ENTITY_ALREADY_USED',
                message: 'Entry is already used in target mapping',
                status: 409
            });
        }

        cds.run(req.query);
    });

    srv.after(['CREATE','UPDATE','DELETE'], ['Actions', 'SemanticObjects'], async (data, req) => {
        req.notify({
            code: 'SUCCESS',
            message: messageFactory(req.target.name, req.event),
            status: 200
        });
    });
};