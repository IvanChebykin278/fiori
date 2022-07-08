sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"../model/models",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
    'sap/m/MessagePopover',
	'sap/m/MessageItem',
], function (Controller,formatter,models,History,Fragment,MessagePopover,MessageItem) {
	"use strict";

	return Controller.extend("fiori.roles.controller.BaseController", {
        models: models,
        formatter: formatter,

        onInit: function() {
            var oMessageManager = sap.ui.getCore().getMessageManager();
            var oMessageTemplate = new MessageItem({
				type: '{messages>type}',
				title: '{messages>title}',
				activeTitle: "{messages>active}",
				description: '{messages>description}',
				subtitle: '{messages>subtitle}',
				counter: '{messages>counter}'
			});

            this.oMessagePopover = new MessagePopover({
				items: {
					path: 'messages>/',
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
                name: "fiori.roles.view.fragments." + sDialogName,
                controller: this,
                });

                oView.addDependent(this[sDialogName]);
            }

            return await this[sDialogName];
        },

        handleMessagePopoverPress: function(oEvent) {
            this.oMessagePopover.toggle(oEvent.getSource());
        }
    });
});