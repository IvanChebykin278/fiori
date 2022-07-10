const cds = require('@sap/cds');

class BaseService extends cds.ApplicationService {

    _requestMiddlewares = [];

    useRequest(middleware) {
        this._requestMiddlewares.push(middleware);
    }

    async handle(req) {
        this._requestMiddlewares.forEach(middleware => middleware(req));

        return super.handle(req);
    }
}

module.exports = BaseService;