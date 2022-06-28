sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "fiori/roles/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("fiori.roles.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                var oModel = this.getModel();
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                oModel.setDeferredGroups(["roles", "catalogs", "groups", "users"]);
                oModel.setChangeGroups({
                    "Roles": {
                        groupId: "roles",
                        single: true
                    },
                    "RoleCatalog": {
                        groupId: "catalogs",
                        single: true
                    },
                    "RoleGroup": {
                        groupId: "groups",
                        single: true
                    },
                    "RoleUser": {
                        groupId: "users",
                        single: true
                    }
                });
            }
        });
    }
);