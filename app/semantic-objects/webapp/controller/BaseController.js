sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/models",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment"
], function (Controller,models,History,Fragment) {
	"use strict";

	return Controller.extend("fiori.semanticobjects.controller.BaseController", {
        models: models,

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

        getDialog: async function (sDialogName) {
            var oView = this.getView();

            if (!this[sDialogName]) {
                this[sDialogName] = await Fragment.load({
                id: sDialogName,
                name: "fiori.semanticobjects.view.fragments." + sDialogName,
                controller: this,
                });

                oView.addDependent(this[sDialogName]);
            }

            return await this[sDialogName];
        }

    });
});