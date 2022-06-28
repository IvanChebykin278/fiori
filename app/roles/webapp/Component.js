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

                oModel.setDeferredGroups(["roles", "idCatalogList", "idGroupList", "idUserList"]);
                oModel.setChangeGroups({
                    "Roles": {
                        groupId: "roles",
                        single: true
                    },
                    "RoleCatalog": {
                        groupId: "idCatalogList",
                        single: true
                    },
                    "RoleGroup": {
                        groupId: "idGroupList",
                        single: true
                    },
                    "RoleUser": {
                        groupId: "idUserList",
                        single: true
                    }
                });
            }
        });
    }
);