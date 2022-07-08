sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"../model/models",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
    "sap/ui/core/Control"
], function (Controller,formatter,models,History,Fragment) {
	"use strict";

	return Controller.extend("fiori.actions.controller.BaseController", {
        models: models,
        formatter: formatter,

        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        showError: function() {
            JSON.parse(oResponse.responseText).error.message.value;
        },

        onNavBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash(),
                oCrossAppNavigator = sap.ushell.Container.getService(
                "CrossApplicationNavigation"
                );

            if (
                sPreviousHash !== undefined ||
                !oCrossAppNavigator.isInitialNavigation()
            ) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("Overview", {}, true);
            }
        },

        getDialog: async function (sDialogName) {
            var oView = this.getView();

            if (!this[sDialogName]) {
                this[sDialogName] = await Fragment.load({
                id: sDialogName,
                name: "fiori.actions.view.fragments." + sDialogName,
                controller: this,
                });

                oView.addDependent(this[sDialogName]);
            }

            return await this[sDialogName];
        }
    });
});