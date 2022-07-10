const cds = require("@sap/cds");
const MessageType = require('../../messages/MessageType');

class BaseStrategy {

    /**
     * abstract properties
     */
    messageByDependent = null
    messageByEmpty = null
    messageByReadOnly = null

    async getEntities() {
        const db = await cds.connect.to('db');
        return db.entities();
    }

    async execute(data) {
        const isDependent = await this.isDependent(data);
        const isReadOnly = await this.isReadOnly(data)
        const isEmpty = await this.isEmpty(data);

        if(isReadOnly) {
            return this.messageByDependent;
        }

        if(isEmpty) {
            return this.messageByEmpty;
        }
        
        if(isDependent) {
            return this.messageByReadOnly;
        }
        
        return null;
    }

    /**
     * abstract methods
     */
    async getDependentEntity(data) { return null; }
    async isDependent(data) { return false; }
    isReadOnly(data) { return false; }
    isEmpty(data) { return false; }
};

module.exports = BaseStrategy;