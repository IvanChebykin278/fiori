const cds = require("@sap/cds");

module.exports = async (srv) => {
    const db = await cds.connect.to('db');
    const { Actions, Catalogs, Groups, SemanticObjects, TargetMappings, Tiles, CatalogTile } = db.entities();

    srv.before(['DELETE', 'UPDATE', 'CREATE'], '*', async (req) => {
        if(req.req.url.indexOf('simulate=error') >= 0) {
            return req.reject(500, `This is a auto-genereted error for debugging`);
        }
    });

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

    srv.before(['DELETE', 'UPDATE'], '*', async (req) => {
        const deletedEntry = await SELECT.one().from(req.target.name).where({ ID: req.data.ID });

        if (deletedEntry.isReadOnly) {
            return req.reject(409, 'Entry is Read-Only');
        }
    });

    srv.on('DELETE', ['Actions', 'SemanticObjects'], async (req) => {
        const entry = await SELECT.one().from(req.target.name).where(req.data);
        const { ID, createdAt, createdBy, modifiedAt, modifiedBy, ...data } = entry;
        const targetMapping = await SELECT.one().from(TargetMappings).where(data);

        if (targetMapping) {
            req.reject(409, 'Entry is already used in target mapping');
        } 
    });
};