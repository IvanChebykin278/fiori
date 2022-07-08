sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "fiori/roles/model/models",
        "fiori/roles/controller/ErrorHandler"
    ],
    function (UIComponent, Device, models, ErrorHandler) {
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
                var oMessageManager = sap.ui.getCore().getMessageManager();
                var oModel = this.getModel();
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);


                // register message processor
                oMessageManager.registerMessageProcessor(oModel);

                // set message model
                this.setModel(oMessageManager.getMessageModel(), 'messages');

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                
                this.oErrorHandler = new ErrorHandler(this);

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