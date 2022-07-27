sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "fiori/designer/model/models",
        "fiori/designer/controller/ListSelector"
    ],
    function (UIComponent, Device, models, ListSelector) {
        "use strict";

        return UIComponent.extend("fiori.designer.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {

                this.oListSelectorGroups = new ListSelector();
                this.oListSelectorCatalogs = new ListSelector();
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },

            destroy : function () {
				this.oListSelectorGroups.destroy();
                this.oListSelectorCatalogs.destroy();
				this._oErrorHandler.destroy();
				// call the base component's destroy function
				UIComponent.prototype.destroy.apply(this, arguments);
			},
        });
    }
);