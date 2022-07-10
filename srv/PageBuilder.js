const cds = require("@sap/cds");
const BaseService = require('./utils/BaseService');

// module.exports = async (srv) => {
//     const db = await cds.connect.to('db');
//     const { Actions, Catalogs, Groups, SemanticObjects, TargetMappings } = db.entities();

//     srv.before('*', '*', async req => { debugger; });

//     srv.before(['DELETE', 'UPDATE'], ['Actions', 'Catalogs', 'Groups', 'SemanticObjects', 'TargetMappings'], async (req) => {
//         const deletedEntry = await SELECT.one().from(req.target.name).where(req.data);

//         if (deletedEntry.isReadOnly) {
//             return req.reject(409, 'Entry is Read-Only');
//         }
//     });

//     srv.on('DELETE', ['Actions', 'SemanticObjects'], async (req) => {
//         const targetMapping = await SELECT.one().from(TargetMappings).where(req.data);

//         if (targetMapping) {
//             req.reject(409, 'Entry is already used in target mapping');
//         }
//     });
// };

class PageBuilder extends BaseService {
    async init() {
        const srv = this;

        const db = await cds.connect.to('db');
        const { Actions, Catalogs, Groups, SemanticObjects, TargetMappings } = db.entities();

        srv.before('*', '*', async req => { req.utils.validate(); });

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

        await super.init();
    }
}

module.exports = PageBuilder;