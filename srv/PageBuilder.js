const cds = require("@sap/cds");

module.exports = async (srv) => {
    const db = await cds.connect.to('db');
    const { Actions, Catalogs, Groups, SemanticObjects, TargetMappings } = db.entities();

    srv.before(['DELETE', 'UPDATE'], ['Actions', 'Catalogs', 'Groups', 'SemanticObjects', 'TargetMappings'], async (req) => {
        const deletedEntry = await SELECT.one().from(req.target.name).where(req.data);

        if (deletedEntry.isReadOnly) {
            return req.reject(409, 'Entry is Read-Only');
        }
    });

    srv.on('DELETE', ['Actions', 'SemanticObjects'], async (req) => {
        const targetMapping = await SELECT.one().from(TargetMappings).where(req.data);

        if (targetMapping) {
            req.reject(409, 'Entry is already used in target mapping');
        }
    });
};