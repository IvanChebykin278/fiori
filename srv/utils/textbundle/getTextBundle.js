const cds = require('@sap/cds');
const { ResourceManager } = require('@sap/textbundle');
const resourceManager = new ResourceManager(path.resolve(__dirname, '_i18n'));

module.exports = () => resourceManager.getTextBundle(cds.context.locale);