sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/models",
    "../model/formatter",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
    'sap/m/MessagePopover',
	'sap/m/MessageItem'
], function (Controller,models, formatter, History,Fragment,MessagePopover,MessageItem) {
	"use strict";

	return Controller.extend("fiori.semanticobjects.controller.BaseController", {
        models: models,
        formatter: formatter,

        onInit: function(){

            var oMessageManager = sap.ui.getCore().getMessageManager();
            var oMessageTemplate = new MessageItem({
				type: '{messages>type}',
				title: '{messages>message}',
				description: '{messages>description}',
			});

            this.oMessagePopover = new MessagePopover({
				groupItems: true,
                items: {
					path: 'messages>/',
                    sorter: new sap.ui.model.Sorter({ path: 'date', descending: true}), 
					template: oMessageTemplate
				}
			});

            this.setModel(oMessageManager.getMessageModel(), 'messages');
            this.byId("messagePopoverBtn").addDependent(this.oMessagePopover);
        },



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

            var oDialog = await this[sDialogName];
            oDialog.attachEventOnce('afterClose',function(oEvent){
                oEvent.getSource().unbindElement();
                this.getModel().refresh(false);
            }, this);
            
            return oDialog;

            //return await this[sDialogName];
        },

        handleMessagePopoverPress: function(oEvent) {
            this.oMessagePopover.toggle(oEvent.getSource());
        }

    });
});