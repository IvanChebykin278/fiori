/* Copyright (c) 2009-2022 SAP SE, All Rights Reserved */
/* eslint-disable valid-jsdoc */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/IconPool",
    "sap/ui/thirdparty/datajs",
    "sap/ushell/components/container/ApplicationContainer",
    "sap/ushell/services/ShellNavigation",
    "sap/ushell/services/NavTargetResolution",
    "sap/ushell/services/Message",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/Container"
], function (
    Controller,
    IconPool,
    datajs,
    ApplicationContainer,
    ShellNavigation,
    NavTargetResolution,
    Message,
    MessageToast,
    MessageBox,
    AppConfiguration,
    Container
) {
    "use strict";

    return Controller.extend("fiori.shell.Shell", {
        /**
         * Set application container based on information in URL hash.
         */
        doHashChange: function (sShellHash) {
            var oView = this.getView();

            if (!sShellHash) {
                sShellHash = "";
            }
            if (sShellHash.charAt(0) !== "#") {
                sShellHash = "#" + sShellHash;
            }

            if (this.oDefaultApp && sShellHash === "#") {
                // resolve empty hash directly to default app, if specified in config
                var oContainer = oView.byId("container");
                oContainer.setAdditionalInformation(this.oDefaultApp.additionalInformation);
                oContainer.setApplicationType(this.oDefaultApp.applicationType);
                oContainer.setUrl(this.oDefaultApp.url);
                oContainer.setVisible(true);
            } else {
                // resolve via target resolution service
                sap.ushell.Container.getService("NavTargetResolution")
                    .resolveHashFragment(sShellHash)
                    .done(function (oApplication, sParameters) {
                        // set current application before initializing the application
                        sap.ushell.services.AppConfiguration.setCurrentApplication(oApplication);
                        var oContainer = oView.byId("container");
                        if (oApplication) {
                            var url = oApplication.url;
                            if (url && sParameters) {
                                if (url.indexOf("?") > 0) {
                                    url += "&" + sParameters;
                                } else {
                                    url += "?" + sParameters;
                                }
                            }

                            oContainer.setAdditionalInformation(oApplication.additionalInformation);
                            oContainer.setApplicationType(oApplication.applicationType);
                            oContainer.setUrl(url);
                        }
                        oContainer.setVisible(true);
                    });
            }
        },

        /**
         * SAPUI5 lifecycle hook.
         */
        onInit: function () {
            var oViewData = this.getView().getViewData();

            // set default app as member if specified in config; is read in doHashChange
            this.oDefaultApp = oViewData && oViewData.config && oViewData.config.defaultApp;

            // initialize the shell navigation service; also triggers the doHashChange callback for the initial load (or an empty hash)
            sap.ushell.Container.getService("ShellNavigation").init(jQuery.proxy(this.doHashChange, this));
            sap.ushell.Container.getService("Message").init(jQuery.proxy(this.doShowMessage, this));
        },

        /**
         * Callback registered with Message service. Triggered on message show request.
         *
         * @private
         */
        doShowMessage: function (iType, sMessage, oParameters) {
            if (iType === sap.ushell.services.Message.Type.ERROR) {
                MessageBox.show(sMessage, MessageBox.Icon.ERROR,
                    oParameters.title || sap.ushell.resources.i18n.getText("error"));
            } else if (iType === sap.ushell.services.Message.Type.CONFIRM) {
                if (oParameters.actions) {
                    MessageBox.show(sMessage, MessageBox.Icon.QUESTION, oParameters.title, oParameters.actions, oParameters.callback);
                } else {
                    MessageBox.confirm(sMessage, oParameters.callback, oParameters.title);
                }
            } else {
                MessageToast.show(sMessage, { duration: oParameters.duration || 3000 });
            }
        }
    });
});
