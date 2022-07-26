const BaseStrategy = require('./BaseStrategy');

class ValidateActionsStrategy extends BaseStrategy {
    messageByDependent = { 
        code: 'ACTION_IS_EMPTY',
        message: 'Name of Action can not be empty',
        target: 'action',
        status: 400
    };

    messageByEmpty = {
        code: 'ACTION_ALREADY_EXISTS',
        message: 'Action already exists',
        target: 'action',
        status: 400
    };

    messageByReadOnly = {
        code: 'ENTITY_IS_READ_ONLY',
        message: 'Action is Read-Only',
        status: 409
    };

    async getTargetEntity(data) {
        const { Actions } = await this.getEntities();
        const entry = await SELECT.one().from(Actions).where({ action: data.ID });

        return entry;
    }

    async getDependentEntity(data) {
        const { Actions } = await this.getEntities();
        const entry = await SELECT.one().from(Actions).where({ action: data.action });

        return entry;
    }

    async isDependent(data) { 
        return !!(await this.getDependentEntity(data));
    }

    async isReadOnly(data) { 
        const entry = await this.getTargetEntity(data);

        return !!entry && entry.isReadOnly;
    }

    async isEmpty(data) {
        return !data.action;
    }
}

module.exports = ValidateActionsStrategy;