sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "fiori/semanticobjects/model/models",
        "fiori/semanticobjects/controller/ErrorHandler"
    ],
    function (UIComponent, Device, models, ErrorHandler) {
        "use strict";

        return UIComponent.extend("fiori.semanticobjects.Component", {
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

                // register message processor
                oMessageManager.registerMessageProcessor(oModel);

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                this.oErrorHandler = new ErrorHandler(this);

                //
                this.setModel(oMessageManager.getMessageModel(), 'messages');
            }
        });
    }
);